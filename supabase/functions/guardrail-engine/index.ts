// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "./cors.ts";
import { EngineRequestPayload, GuardrailDecisionResult } from "./types.ts";
import { evaluateAuthority, evaluatePolicies, evaluateRisk } from "./rules.ts";

// @ts-ignore
declare const Deno: any;

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload = (await req.json()) as EngineRequestPayload;

    if (!payload.agentId || !payload.intent || typeof payload.proposedAmount !== 'number' || payload.proposedAmount < 0 || typeof payload.proposedDiscount !== 'number' || !payload.idempotencyKey) {
      return new Response(JSON.stringify({ error: 'Invalid or malformed payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Instantiate Supabase client using the provided user JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Missing Authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // 1. Resolve Auth Merchant — server-side, never trusted from payload
    const { data: merchantId, error: rpcError } = await supabaseClient.rpc('auth_merchant_id');
    if (rpcError || !merchantId) {
      throw new Error(`Unauthorized or unmapped tenant: ${rpcError?.message}`);
    }

    // 2. Fetch Agent Record (enforce tenancy and lifecycle)
    const { data: agent, error: agentError } = await supabaseClient
      .from('agents')
      .select('*')
      .eq('id', payload.agentId)
      .eq('merchant_id', merchantId)
      .single();
    
    if (agentError || !agent) {
      throw new Error(`Agent not found or unauthorized: ${agentError?.message}`);
    }

    // 3. Fetch Agent Authority
    const { data: authority, error: authError } = await supabaseClient
      .from('agent_authority')
      .select('*')
      .eq('agent_id', payload.agentId)
      .eq('merchant_id', merchantId)
      .single();

    // 4. Fetch Active Policies
    const { data: policies, error: polError } = await supabaseClient
      .from('policies')
      .select('id, category, status, name, policy_versions(id, version_number, configuration)')
      .eq('merchant_id', merchantId)
      .ilike('status', 'active');

    // 5. Pre-check Idempotency (prevent orphan intents)
    const { data: existingTx, error: existError } = await supabaseClient
      .from('transactions')
      .select('id, status')
      .eq('merchant_id', merchantId)
      .eq('idempotency_key', payload.idempotencyKey)
      .maybeSingle();

    if (existError) {
      throw new Error(`Database error during idempotency check: ${existError.message}`);
    }
    if (existingTx) {
      return new Response(JSON.stringify({ error: 'Duplicate idempotency key' }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 6. Run Evaluations
    const authEval = evaluateAuthority(payload.proposedAmount, payload.proposedDiscount, authority);
    const polEval = evaluatePolicies(payload.proposedAmount, payload.estimatedCostBasis, policies || []);
    const riskEval = evaluateRisk(agent, payload, authority);

    // 7. Synthesize Final Decision
    let finalDecision: 'PERMIT' | 'REVIEW' | 'BLOCK' = 'PERMIT';
    if (authEval.status === 'BLOCK' || polEval.status === 'BLOCK' || riskEval.status === 'BLOCK') {
      finalDecision = 'BLOCK';
    } else if (authEval.status === 'REVIEW' || polEval.status === 'REVIEW' || riskEval.status === 'REVIEW') {
      finalDecision = 'REVIEW';
    }

    // 8. DB Sequence: Write to ledger (Fail-closed)
    
    // a. Insert Intent
    const { data: intent, error: intentError } = await supabaseClient
      .from('intents')
      .insert({
        agent_id: payload.agentId,
        merchant_id: merchantId,
        description: payload.intent,
        structured_data: {
          proposedAmount: payload.proposedAmount,
          proposedDiscount: payload.proposedDiscount,
          estimatedCostBasis: payload.estimatedCostBasis,
          idempotencyKey: payload.idempotencyKey
        }
      })
      .select('id')
      .single();

    if (intentError) {
      throw new Error(`Intent creation failed: ${intentError.message}`);
    }

    const intentId = intent.id;

    // b. Insert Transaction
    const { data: tx, error: txError } = await supabaseClient
      .from('transactions')
      .insert({
        intent_id: intentId,
        merchant_id: merchantId,
        agent_id: payload.agentId,
        amount: payload.proposedAmount,
        currency: 'INR',
        status: finalDecision === 'PERMIT' ? 'APPROVED' : (finalDecision === 'BLOCK' ? 'REJECTED' : 'PENDING_REVIEW'),
        idempotency_key: payload.idempotencyKey
      })
      .select('id')
      .single();

    if (txError) {
      if (txError.code === '23505') {
        return new Response(JSON.stringify({ error: 'Duplicate idempotency key' }), {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      throw new Error(`Transaction creation failed: ${txError.message}`);
    }

    const transactionId = tx.id;

    // c. Insert Risk Evaluation
    const { error: riskInsertError } = await supabaseClient.from('risk_evaluations').insert({
      merchant_id: merchantId,
      transaction_id: transactionId,
      risk_score: riskEval.score,
      risk_level: riskEval.level,
      indicators: {
        agentRiskScore: parseFloat(agent.risk_score || '0'),
        amountUtilization: authority?.spend_limit ? payload.proposedAmount / parseFloat(authority.spend_limit) : 0,
        discountUtilization: authority?.discount_max_percent ? payload.proposedDiscount / parseFloat(authority.discount_max_percent) : 0,
        agentStatus: agent.status,
        reasons: riskEval.reasons
      }
    });
    if (riskInsertError) {
      throw new Error(`Risk evaluation persistence failed: ${riskInsertError.message}`);
    }

    // d. Insert Policy Evaluations (BLOCK path only)
    if (polEval.failedPolicyVersionId) {
      const { error: polEvalInsertError } = await supabaseClient.from('policy_evaluations').insert({
        merchant_id: merchantId,
        transaction_id: transactionId,
        policy_version_id: polEval.failedPolicyVersionId,
        result: polEval.status,
        violation_details: polEval.reason ? { reason: polEval.reason } : null
      });
      if (polEvalInsertError) {
        throw new Error(`Policy evaluation persistence failed: ${polEvalInsertError.message}`);
      }
    }

    // e. Insert Guardrail Decision
    const { error: decisionInsertError } = await supabaseClient.from('guardrail_decisions').insert({
      merchant_id: merchantId,
      transaction_id: transactionId,
      decision: finalDecision,
      reason: authEval.reason || polEval.reason || 'Transaction cleared safely.'
    });
    if (decisionInsertError) {
      throw new Error(`Guardrail decision persistence failed: ${decisionInsertError.message}`);
    }

    // f. Insert Human Review (REVIEW path only)
    if (finalDecision === 'REVIEW') {
      const { error: reviewInsertError } = await supabaseClient.from('human_reviews').insert({
        merchant_id: merchantId,
        transaction_id: transactionId,
        status: 'PENDING'
      });
      if (reviewInsertError) {
        throw new Error(`Human review persistence failed: ${reviewInsertError.message}`);
      }
    }

    // g. Insert Audit Event
    const { error: auditInsertError } = await supabaseClient.from('audit_events').insert({
      merchant_id: merchantId,
      entity_type: 'TRANSACTION',
      entity_id: transactionId,
      transaction_id: transactionId,
      event_type: finalDecision === 'PERMIT' ? 'TRANSACTION_PERMITTED' : (finalDecision === 'BLOCK' ? 'POLICY_BLOCK' : 'SUPERVISOR_ESCALATION'),
      actor_type: 'AGENT',
      actor_id: payload.agentId,
      metadata: {
        decision: finalDecision,
        intent: payload.intent,
        intentId,
        transactionId,
        agentId: payload.agentId,
        proposedAmount: payload.proposedAmount,
        proposedDiscount: payload.proposedDiscount,
        riskScore: riskEval.score,
        riskLevel: riskEval.level,
        policyStatus: polEval.status,
        authorityStatus: authEval.status
      }
    });
    if (auditInsertError) {
      throw new Error(`Audit event persistence failed: ${auditInsertError.message}`);
    }

    // Return the synthesized result
    const result: GuardrailDecisionResult = {
      decision: finalDecision,
      finalRiskScore: riskEval.score,
      intentId,
      transactionId,
      details: {
        authority: authEval,
        policies: polEval,
        risk: riskEval
      }
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Engine Execution Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
