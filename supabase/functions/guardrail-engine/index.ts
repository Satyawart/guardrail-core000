import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "./cors.ts";
import { EngineRequestPayload, GuardrailDecisionResult } from "./types.ts";
import { evaluateAuthority, evaluatePolicies, evaluateRisk } from "./rules.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload = (await req.json()) as EngineRequestPayload;
    
    // Instantiate Supabase client using the provided user JWT
    const authHeader = req.headers.get('Authorization')!;
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // 1. Resolve Auth Merchant (Proves RLS works)
    const { data: merchantId, error: rpcError } = await supabaseClient.rpc('auth_merchant_id');
    if (rpcError || !merchantId) {
      throw new Error(`Unauthorized or unmapped tenant: ${rpcError?.message}`);
    }

    // 2. Fetch Agent Authority
    const { data: authority, error: authError } = await supabaseClient
      .from('agent_authority')
      .select('*')
      .eq('agent_id', payload.agentId)
      .eq('merchant_id', merchantId)
      .single();

    // 3. Fetch Active Policies (case-insensitive: handles 'ACTIVE' or 'active')
    const { data: policies, error: polError } = await supabaseClient
      .from('policies')
      .select('id, category, status, name, policy_versions(version_number, configuration)')
      .eq('merchant_id', merchantId)
      .ilike('status', 'active');

    // 4. Run Evaluations
    const authEval = evaluateAuthority(payload.proposedAmount, payload.proposedDiscount, authority);
    const polEval = evaluatePolicies(payload.proposedAmount, payload.estimatedCostBasis, policies || []);
    const riskEval = evaluateRisk(payload.agentId, {});

    // 5. Synthesize Final Decision
    let finalDecision: 'PERMIT' | 'REVIEW' | 'BLOCK' = 'PERMIT';
    if (authEval.status === 'BLOCK' || polEval.status === 'BLOCK' || riskEval.status === 'BLOCK') {
      finalDecision = 'BLOCK';
    } else if (authEval.status === 'REVIEW' || polEval.status === 'REVIEW' || riskEval.status === 'REVIEW') {
      finalDecision = 'REVIEW';
    }

    // 6. DB Sequence: Write to ledger
    // Using sequential inserts for Phase 7 (production would use a stored procedure for full ACID tx)
    
    // a. Insert transaction
    // Schema columns: id, intent_id, merchant_id, agent_id, amount, currency, status,
    //                 idempotency_key, created_at, updated_at
    // NOTE: No 'metadata' column exists — intent description is not persisted here.
    const { data: tx, error: txError } = await supabaseClient
      .from('transactions')
      .insert({
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
        // Unique constraint on idempotency_key
        return new Response(JSON.stringify({ error: 'Duplicate idempotency key' }), { 
          status: 409, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      throw txError;
    }

    const transactionId = tx.id;

    // b. Insert Policy Evaluations
    // Schema columns: transaction_id, merchant_id, policy_version_id (NOT NULL), result, violation_details
    // NOTE: policy_version_id is required. We skip the insert if no policy_version_id is available
    //       (e.g. PERMIT path where no policy was violated). This prevents a NOT NULL constraint error.
    if (polEval.failedPolicyVersionId) {
      await supabaseClient.from('policy_evaluations').insert({
        merchant_id: merchantId,
        transaction_id: transactionId,
        policy_version_id: polEval.failedPolicyVersionId,
        result: polEval.status,
        violation_details: polEval.reason ? { reason: polEval.reason } : null
      });
    }

    // c. Insert Guardrail Decision
    await supabaseClient.from('guardrail_decisions').insert({
      merchant_id: merchantId,
      transaction_id: transactionId,
      decision: finalDecision,
      reason: authEval.reason || polEval.reason || 'Transaction cleared safely.'
    });

    // d. Insert Human Review (if REVIEW)
    if (finalDecision === 'REVIEW') {
      await supabaseClient.from('human_reviews').insert({
        merchant_id: merchantId,
        transaction_id: transactionId,
        status: 'PENDING'
      });
    }

    // e. Insert Audit Event
    // Schema columns: merchant_id, entity_type (NOT NULL), entity_id (NOT NULL), transaction_id,
    //                 event_type (NOT NULL), actor_type (NOT NULL), actor_id, metadata (JSONB)
    // NOTE: Removed nonexistent 'decision' and 'details' columns.
    //       entity_type = 'TRANSACTION', entity_id = the transaction UUID.
    await supabaseClient.from('audit_events').insert({
      merchant_id: merchantId,
      entity_type: 'TRANSACTION',
      entity_id: transactionId,
      transaction_id: transactionId,
      event_type: finalDecision === 'PERMIT' ? 'TRANSACTION_PERMITTED' : (finalDecision === 'BLOCK' ? 'POLICY_BLOCK' : 'SUPERVISOR_ESCALATION'),
      actor_type: 'AGENT',
      actor_id: payload.agentId,
      metadata: {
        decision: finalDecision,
        intent: payload.intent
      }
    });

    // Return the synthesized result
    const result: GuardrailDecisionResult = {
      decision: finalDecision,
      finalRiskScore: riskEval.score,
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
