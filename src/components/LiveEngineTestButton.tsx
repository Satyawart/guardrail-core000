import React, { useState } from 'react';
import { invokeGuardrailEngine, GuardrailDecisionResult } from '../utils/engine';
import { supabase } from '../utils/supabase';
import { useGuardrail } from '../context/GuardrailContext';

// Resolve the seeded test agent ID once per test run
async function resolveTestAgent(merchantId: string) {
  const { data: agent, error } = await supabase
    .from('agents')
    .select('id, name, merchant_id')
    .eq('name', 'Live Test Agent #01')
    .maybeSingle();

  if (error) throw new Error(`Agent query failed: ${error.message}`);
  if (!agent) throw new Error(
    `Agent "Live Test Agent #01" not found under merchant ${merchantId}. Run seed_test_data.sql first.`
  );
  return agent;
}

// Common pre-flight: verify session + merchant resolver
async function preflight() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No authenticated session. Please log in.');

  const { data: merchantId } = await supabase.rpc('auth_merchant_id');
  if (!merchantId) throw new Error('auth_merchant_id() returned null. RLS resolver is broken.');

  return { session, merchantId };
}

interface TestResult {
  label: string;
  result: GuardrailDecisionResult | { error: string } | null;
  loading: boolean;
}

export const LiveEngineTestButton: React.FC = () => {
  const [testA, setTestA] = useState<TestResult>({ label: 'Test A', result: null, loading: false });
  const [testB, setTestB] = useState<TestResult>({ label: 'Test B', result: null, loading: false });
  const [testC, setTestC] = useState<TestResult>({ label: 'Test C', result: null, loading: false });
  const { fetchLiveState, setSelectedTransaction, setIsTransactionDrawerOpen, setCurrentNav } = useGuardrail();

  const openTransactionTrace = async (txId: string) => {
    await fetchLiveState();
    
    // Fetch the specific transaction that was just created to show in the trace
    const { data: txData } = await supabase
      .from('transactions')
      .select(`
        *,
        agents (name, type),
        intents (description, structured_data),
        guardrail_decisions (decision, reason),
        risk_evaluations (risk_score, risk_level, indicators),
        policy_evaluations (result, violation_details, policy_versions(natural_language))
      `)
      .eq('id', txId)
      .single();

    if (txData) {
      const decision = txData.guardrail_decisions?.[0];
      const risk = txData.risk_evaluations?.[0];
      const polEval = txData.policy_evaluations?.[0];
      const intent = txData.intents;
      const agent = txData.agents;

      const formattedTx: any = {
        id: txData.id,
        timestamp: txData.created_at,
        actor: agent?.name || 'Unknown Agent',
        actorId: txData.agent_id,
        actorType: agent?.type || 'AI Agent',
        action: intent?.description || 'Unknown Action',
        amount: txData.amount,
        status: txData.status === 'APPROVED' ? 'SUCCESS' : txData.status as any,
        merchantName: 'Your Organization',
        riskScore: risk?.risk_score ? Number(risk.risk_score) / 100 : 0.0,
        riskLevel: risk?.risk_level || 'LOW',
        policyApplied: polEval?.policy_versions?.natural_language || '',
        reason: decision?.reason || '',
        idempotencyKey: txData.idempotency_key || undefined,
        steps: [],
        explainability: {
           decision: decision?.decision as 'PERMIT' | 'BLOCKED' | 'REVIEW',
           summary: decision?.reason || 'Evaluated deterministically',
           checks: []
        }
      };

      setSelectedTransaction(formattedTx);
      setIsTransactionDrawerOpen(true);
    }
  };

  const runTestA = async () => {
    setTestA(prev => ({ ...prev, loading: true, result: null }));
    try {
      const { merchantId } = await preflight();
      const agent = await resolveTestAgent(merchantId);
      const res = await invokeGuardrailEngine({
        agentId: agent.id,
        intent: 'Test procurement of 5 laptops',
        proposedAmount: 320000,
        proposedDiscount: 5.0,
        estimatedCostBasis: 260000,
        idempotencyKey: `test_a_${Date.now()}`
      });
      setTestA(prev => ({ ...prev, result: res }));
      if (res && res.transactionId) {
        await openTransactionTrace(res.transactionId);
      }
    } catch (err: any) {
      setTestA(prev => ({ ...prev, result: { error: err.message } }));
    } finally {
      setTestA(prev => ({ ...prev, loading: false }));
    }
  };

  const runTestB = async () => {
    setTestB(prev => ({ ...prev, loading: true, result: null }));
    try {
      const { merchantId } = await preflight();
      const agent = await resolveTestAgent(merchantId);
      // Margin = (100000 - 92000) / 100000 = 8.0% — intentionally below the 15% floor
      const res = await invokeGuardrailEngine({
        agentId: agent.id,
        intent: 'Margin-violation test: below 15% floor',
        proposedAmount: 100000,
        proposedDiscount: 5.0,
        estimatedCostBasis: 92000,
        idempotencyKey: `test_b_${Date.now()}`
      });
      setTestB(prev => ({ ...prev, result: res }));
      if (res && res.transactionId) {
        await openTransactionTrace(res.transactionId);
      }
    } catch (err: any) {
      setTestB(prev => ({ ...prev, result: { error: err.message } }));
    } finally {
      setTestB(prev => ({ ...prev, loading: false }));
    }
  };

  const runTestC = async () => {
    setTestC(prev => ({ ...prev, loading: true, result: null }));
    try {
      const { merchantId } = await preflight();
      const agent = await resolveTestAgent(merchantId);
      // REVIEW trigger: proposedAmount intentionally exceeds the agent's single-tx spend_limit.
      // Margin = (1500000 - 900000) / 1500000 = 40% — above the 15% policy floor, so policy PASSES.
      // Authority sees amount > spend_limit → returns REVIEW.
      // Risk score may also be elevated from high utilization → reinforces REVIEW.
      const res = await invokeGuardrailEngine({
        agentId: agent.id,
        intent: 'Procurement: 50x Enterprise Server Blades (exceeds single-tx authority limit)',
        proposedAmount: 1500000,
        proposedDiscount: 2.0,
        estimatedCostBasis: 900000,
        idempotencyKey: `test_c_${Date.now()}`
      });
      setTestC(prev => ({ ...prev, result: res }));
      if (res && res.transactionId) {
        await openTransactionTrace(res.transactionId);
        // Navigate to APPROVALS so the demo flow is immediately visible
        if (res.decision === 'REVIEW') {
          await new Promise(resolve => setTimeout(resolve, 600));
          setCurrentNav('APPROVALS');
        }
      }
    } catch (err: any) {
      setTestC(prev => ({ ...prev, result: { error: err.message } }));
    } finally {
      setTestC(prev => ({ ...prev, loading: false }));
    }
  };

  const decisionColor = (result: GuardrailDecisionResult | { error: string } | null) => {
    if (!result || 'error' in result) return 'text-red-400';
    if (result.decision === 'PERMIT') return 'text-emerald-400';
    if (result.decision === 'BLOCK') return 'text-red-400';
    return 'text-amber-400';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[#111113] border border-blue-500/30 p-4 rounded-lg shadow-2xl w-80 max-h-[90vh] overflow-y-auto">
      <h3 className="text-blue-400 font-mono text-xs font-bold mb-3 tracking-widest uppercase">
        Phase 8–12: Engine Verification
      </h3>

      {/* TEST A */}
      <div className="mb-3">
        <div className="text-[10px] text-gray-500 font-mono mb-1">
          Test A — PERMIT scenario (margin 18.75% &gt; 15%)
        </div>
        <button
          onClick={runTestA}
          disabled={testA.loading}
          className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1.5 rounded font-mono text-xs w-full transition-colors disabled:opacity-50"
        >
          {testA.loading ? 'EXECUTING...' : 'FIRE TEST A — PERMIT SCENARIO'}
        </button>
        {testA.result && (
          <div className="mt-1 bg-black rounded border border-gray-800 p-2">
            {'error' in testA.result ? (
              <p className="text-red-400 text-[10px] font-mono">{testA.result.error}</p>
            ) : (
              <>
                <p className={`text-[11px] font-mono font-bold ${decisionColor(testA.result)}`}>
                  Decision: {testA.result.decision}
                </p>
                <p className="text-gray-500 text-[10px] font-mono">Intent: {testA.result.intentId}</p>
                <p className="text-gray-500 text-[10px] font-mono">TX: {testA.result.transactionId}</p>
                <p className="text-gray-500 text-[10px] font-mono">Risk: {testA.result.finalRiskScore?.toFixed(4)}</p>
                <p className="text-gray-500 text-[10px] font-mono">Auth: {testA.result.details?.authority?.status} — {testA.result.details?.authority?.reason}</p>
                <p className="text-gray-500 text-[10px] font-mono">Policy: {testA.result.details?.policies?.status}{testA.result.details?.policies?.reason ? ` — ${testA.result.details.policies.reason}` : ''}</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* TEST B */}
      <div>
        <div className="text-[10px] text-gray-500 font-mono mb-1">
          Test B — BLOCK scenario (margin 8.0% &lt; 15% floor)
        </div>
        <button
          onClick={runTestB}
          disabled={testB.loading}
          className="bg-red-800 hover:bg-red-700 text-white px-3 py-1.5 rounded font-mono text-xs w-full transition-colors disabled:opacity-50"
        >
          {testB.loading ? 'EXECUTING...' : 'FIRE TEST B — BLOCK SCENARIO'}
        </button>
        {testB.result && (
          <div className="mt-1 bg-black rounded border border-gray-800 p-2">
            {'error' in testB.result ? (
              <p className="text-red-400 text-[10px] font-mono">{testB.result.error}</p>
            ) : (
              <>
                <p className={`text-[11px] font-mono font-bold ${decisionColor(testB.result)}`}>
                  Decision: {testB.result.decision}
                </p>
                <p className="text-gray-500 text-[10px] font-mono">Intent: {testB.result.intentId}</p>
                <p className="text-gray-500 text-[10px] font-mono">TX: {testB.result.transactionId}</p>
                <p className="text-gray-500 text-[10px] font-mono">Risk: {testB.result.finalRiskScore?.toFixed(4)}</p>
                <p className="text-gray-500 text-[10px] font-mono">Auth: {testB.result.details?.authority?.status} — {testB.result.details?.authority?.reason}</p>
                <p className={`text-[10px] font-mono ${testB.result.details?.policies?.status === 'BLOCK' ? 'text-red-400' : 'text-gray-500'}`}>
                  Policy: {testB.result.details?.policies?.status}{testB.result.details?.policies?.reason ? ` — ${testB.result.details.policies.reason}` : ''}
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* TEST C */}
      <div className="mt-3">
        <div className="text-[10px] text-gray-500 font-mono mb-1">
          Test C — REVIEW scenario (amount &gt; spend_limit → authority escalation)
        </div>
        <button
          onClick={runTestC}
          disabled={testC.loading}
          className="bg-amber-700 hover:bg-amber-600 text-white px-3 py-1.5 rounded font-mono text-xs w-full transition-colors disabled:opacity-50"
        >
          {testC.loading ? 'EXECUTING...' : 'FIRE TEST C — REVIEW SCENARIO'}
        </button>
        {testC.result && (
          <div className="mt-1 bg-black rounded border border-gray-800 p-2">
            {'error' in testC.result ? (
              <p className="text-red-400 text-[10px] font-mono">{testC.result.error}</p>
            ) : (
              <>
                <p className={`text-[11px] font-mono font-bold ${decisionColor(testC.result)}`}>
                  Decision: {testC.result.decision}
                </p>
                <p className="text-gray-500 text-[10px] font-mono">Intent: {testC.result.intentId}</p>
                <p className="text-gray-500 text-[10px] font-mono">TX: {testC.result.transactionId}</p>
                <p className="text-gray-500 text-[10px] font-mono">Risk: {testC.result.finalRiskScore?.toFixed(4)}</p>
                <p className={`text-[10px] font-mono ${testC.result.details?.authority?.status === 'REVIEW' ? 'text-amber-400' : 'text-gray-500'}`}>
                  Auth: {testC.result.details?.authority?.status} — {testC.result.details?.authority?.reason}
                </p>
                {testC.result.decision === 'REVIEW' && (
                  <p className="text-amber-400 text-[10px] font-mono mt-1 font-bold">→ Check APPROVALS queue</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
