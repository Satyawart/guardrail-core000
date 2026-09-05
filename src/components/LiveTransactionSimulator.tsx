import React, { useState } from 'react';
import { useGuardrail } from '../context/GuardrailContext';
import { invokeGuardrailEngine, GuardrailDecisionResult } from '../utils/engine';
import { Bot, ShieldCheck, Play, Activity, Check, AlertOctagon, RefreshCcw } from 'lucide-react';
import { AgentRuntime } from '../types';
import { supabase } from '../utils/supabase';

export const LiveTransactionSimulator: React.FC = () => {
  const { agents, fetchLiveState, setSelectedTransaction, setIsTransactionDrawerOpen, setCurrentNav } = useGuardrail();
  
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [intent, setIntent] = useState('');
  const [proposedAmount, setProposedAmount] = useState<string>('');
  const [proposedDiscount, setProposedDiscount] = useState<string>('');
  const [estimatedCostBasis, setEstimatedCostBasis] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GuardrailDecisionResult | { error: string } | null>(null);

  // Quick preset loading
  const loadPreset = (presetType: 'PERMIT' | 'BLOCK' | 'REVIEW') => {
    if (!selectedAgentId) return;
    const agent = agents.find(a => a.id === selectedAgentId);
    if (!agent) return;

    if (presetType === 'PERMIT') {
      setIntent('Routine procurement within authority');
      setProposedAmount((agent.spendLimit * 0.5).toString());
      setProposedDiscount('2.0');
      setEstimatedCostBasis((agent.spendLimit * 0.4).toString());
    } else if (presetType === 'BLOCK') {
      setIntent('High discount request (Margin violation)');
      setProposedAmount('100000');
      setProposedDiscount('25.0'); // Usually breaks authority or margin policy
      setEstimatedCostBasis('92000'); // Low margin
    } else if (presetType === 'REVIEW') {
      setIntent('Escalated large order (Exceeds spend cap)');
      setProposedAmount((agent.spendLimit * 1.5).toString());
      setProposedDiscount('2.0');
      setEstimatedCostBasis((agent.spendLimit * 1.0).toString());
    }
  };

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
      const txIntent = txData.intents;
      const agent = txData.agents;

      const formattedTx: any = {
        id: txData.id,
        timestamp: txData.created_at,
        actor: agent?.name || 'Unknown Agent',
        actorId: txData.agent_id,
        actorType: agent?.type || 'AI Agent',
        action: txIntent?.description || 'Unknown Action',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgentId) return;

    setIsLoading(true);
    setResult(null);

    try {
      const res = await invokeGuardrailEngine({
        agentId: selectedAgentId,
        intent: intent || 'Simulated transaction',
        proposedAmount: parseFloat(proposedAmount || '0'),
        proposedDiscount: parseFloat(proposedDiscount || '0'),
        estimatedCostBasis: parseFloat(estimatedCostBasis || '0'),
        idempotencyKey: `sim_${Date.now()}`
      });
      
      setResult(res);

      if (res && res.transactionId) {
        await openTransactionTrace(res.transactionId);
        if (res.decision === 'REVIEW') {
          setTimeout(() => setCurrentNav('APPROVALS'), 600);
        }
      }
    } catch (err: any) {
      setResult({ error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const decisionColor = (res: GuardrailDecisionResult | { error: string } | null) => {
    if (!res || 'error' in res) return 'text-[#FF3D00]';
    if (res.decision === 'PERMIT') return 'text-[#00FF41]';
    if (res.decision === 'BLOCK') return 'text-[#FF3D00]';
    return 'text-[#FFA000]'; // REVIEW
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[#0A0A0A] border border-[#222] shadow-2xl shadow-[#00FF41]/10 w-96 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 bg-[#111] border-b border-[#222]">
        <Activity className="w-4 h-4 text-[#00FF41]" />
        <h3 className="text-white font-mono text-xs font-bold tracking-widest uppercase">
          LIVE GUARDRAIL SIMULATOR
        </h3>
      </div>

      <div className="p-4 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          
          <div className="space-y-1">
            <label className="text-[10px] text-[#888] mono uppercase">Target Agent Runtime</label>
            <select
              required
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="w-full bg-[#111] border border-[#333] px-3 py-2 text-xs text-white focus:border-[#00FF41] outline-none mono appearance-none"
            >
              <option value="">-- Select Active Agent --</option>
              {agents.filter(a => a.status === 'ACTIVE').map(a => (
                <option key={a.id} value={a.id}>{a.name} (Cap: ₹{a.spendLimit.toLocaleString()})</option>
              ))}
            </select>
          </div>

          {selectedAgentId && (
            <div className="grid grid-cols-3 gap-2">
              <button type="button" onClick={() => loadPreset('PERMIT')} className="px-2 py-1 bg-[#0E1A11] border border-[#00FF41] text-[#00FF41] text-[9px] mono hover:bg-[#00FF41] hover:text-black transition">TEST A (PERMIT)</button>
              <button type="button" onClick={() => loadPreset('BLOCK')} className="px-2 py-1 bg-[#1A0E0C] border border-[#FF3D00] text-[#FF3D00] text-[9px] mono hover:bg-[#FF3D00] hover:text-white transition">TEST B (BLOCK)</button>
              <button type="button" onClick={() => loadPreset('REVIEW')} className="px-2 py-1 bg-[#1A150C] border border-[#FFA000] text-[#FFA000] text-[9px] mono hover:bg-[#FFA000] hover:text-black transition">TEST C (REVIEW)</button>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] text-[#888] mono uppercase">Intent / Action</label>
            <input
              type="text"
              required
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="e.g. Purchase order #1234"
              className="w-full bg-[#111] border border-[#333] px-3 py-1.5 text-xs text-white placeholder-[#444] focus:border-[#00FF41] outline-none mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-[#888] mono uppercase">Proposed Amt (₹)</label>
              <input
                type="number"
                required
                value={proposedAmount}
                onChange={(e) => setProposedAmount(e.target.value)}
                className="w-full bg-[#111] border border-[#333] px-3 py-1.5 text-xs text-white placeholder-[#444] focus:border-[#00FF41] outline-none mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-[#888] mono uppercase">Cost Basis (₹)</label>
              <input
                type="number"
                required
                value={estimatedCostBasis}
                onChange={(e) => setEstimatedCostBasis(e.target.value)}
                className="w-full bg-[#111] border border-[#333] px-3 py-1.5 text-xs text-white placeholder-[#444] focus:border-[#00FF41] outline-none mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-[#888] mono uppercase">Proposed Discount (%)</label>
            <input
              type="number"
              step="0.1"
              required
              value={proposedDiscount}
              onChange={(e) => setProposedDiscount(e.target.value)}
              className="w-full bg-[#111] border border-[#333] px-3 py-1.5 text-xs text-white placeholder-[#444] focus:border-[#00FF41] outline-none mono"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !selectedAgentId}
            className="w-full bg-[#00FF41] hover:bg-[#00CC33] text-black px-3 py-2 font-mono text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                <span>EVALUATING...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>FIRE LIVE EVALUATION</span>
              </>
            )}
          </button>
        </form>

        {/* Results Area */}
        {result && (
          <div className="mt-4 p-3 bg-[#111] border border-[#333] space-y-2">
            <span className="text-[9px] text-[#888] mono font-bold uppercase border-b border-[#222] pb-1 block">
              GUARDRAIL ENGINE RESPONSE
            </span>
            {'error' in result ? (
              <div className="flex gap-2 text-[#FF3D00]">
                <AlertOctagon className="w-4 h-4 shrink-0" />
                <p className="text-[10px] mono">{result.error}</p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#888] mono">DECISION:</span>
                  <span className={`text-xs font-bold mono ${decisionColor(result)}`}>
                    {result.decision}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#888] mono">RISK SCORE:</span>
                  <span className="text-[10px] text-white mono">{result.finalRiskScore?.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#888] mono">AUTHORITY:</span>
                  <span className={`text-[10px] mono truncate max-w-[200px] ${result.details?.authority?.status === 'BLOCK' ? 'text-[#FF3D00]' : (result.details?.authority?.status === 'REVIEW' ? 'text-[#FFA000]' : 'text-white')}`}>
                    {result.details?.authority?.status} — {result.details?.authority?.reason}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#888] mono">POLICY BOUNDS:</span>
                  <span className={`text-[10px] mono truncate max-w-[200px] ${result.details?.policies?.status === 'BLOCK' ? 'text-[#FF3D00]' : 'text-white'}`}>
                    {result.details?.policies?.status}{result.details?.policies?.reason ? ` — ${result.details.policies.reason}` : ''}
                  </span>
                </div>
                <div className="pt-2 text-[9px] text-[#666] mono border-t border-[#222] flex justify-between">
                  <span>TX: {result.transactionId?.slice(0,18)}...</span>
                  <span className="text-[#00FF41]">AUDIT SECURED</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
