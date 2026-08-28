import React from 'react';
import { useGuardrail } from '../../context/GuardrailContext';
import { AgentRuntime } from '../../types';
import { X, Bot, ShieldCheck, Pause, Play, AlertOctagon, Terminal, ArrowRight } from 'lucide-react';

export const AgentDrawer: React.FC = () => {
  const { 
    selectedAgent, 
    setSelectedAgent, 
    toggleAgentStatus, 
    setSelectedTransaction, 
    setIsTransactionDrawerOpen,
    transactions 
  } = useGuardrail();

  if (!selectedAgent) return null;

  const agent = selectedAgent;
  const isBlocked = agent.status === 'BLOCKED';
  const isPaused = agent.status === 'PAUSED';
  const isActive = agent.status === 'ACTIVE';

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex justify-end backdrop-blur-xs">
      <div className="w-full max-w-xl bg-[#0E0E0E] border-l border-[#333] h-full flex flex-col shadow-2xl animate-in slide-in-from-right-4 duration-200">
        
        {/* Top Header */}
        <div className="p-4 border-b border-[#222] bg-[#141414] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-[#00FF41]">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="mono text-sm font-bold text-white">{agent.name}</span>
                <span className={`text-[9px] mono px-2 py-0.2 border ${
                  isActive 
                    ? 'bg-[#00FF41]/10 border-[#00FF41] text-[#00FF41]' 
                    : isPaused 
                    ? 'bg-[#FFA000]/10 border-[#FFA000] text-[#FFA000]' 
                    : 'bg-[#FF3D00]/10 border-[#FF3D00] text-[#FF3D00]'
                }`}>
                  [{agent.status}]
                </span>
              </div>
              <span className="text-[10px] mono text-[#888]">{agent.type} • ID: {agent.id}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isActive ? (
              <button
                onClick={() => toggleAgentStatus(agent.id, 'PAUSED')}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#1A1A1A] border border-[#FFA000]/50 hover:border-[#FFA000] text-xs mono text-[#FFA000] transition"
              >
                <Pause className="w-3 h-3" />
                <span>PAUSE RUNTIME</span>
              </button>
            ) : (
              <button
                onClick={() => toggleAgentStatus(agent.id, 'ACTIVE')}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#1A1A1A] border border-[#00FF41]/50 hover:border-[#00FF41] text-xs mono text-[#00FF41] transition"
              >
                <Play className="w-3 h-3" />
                <span>ACTIVATE</span>
              </button>
            )}

            <button
              onClick={() => setSelectedAgent(null)}
              className="p-1 text-[#888] hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Authority Boundaries */}
        <div className="p-4 bg-[#0A0A0A] border-b border-[#222] space-y-3 mono text-xs">
          <span className="text-[10px] text-[#888] tracking-wider block">AUTONOMY & SPEND BOUNDARIES</span>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 border border-[#222] bg-[#111]">
              <span className="text-[9px] text-[#888] block">SPEND CEILING</span>
              <span className="text-white font-bold">₹{agent.spendLimit.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-2 border border-[#222] bg-[#111]">
              <span className="text-[9px] text-[#888] block">DISCOUNT CEILING</span>
              <span className="text-white font-bold">{agent.discountAuthorityMaxPercent}%</span>
            </div>
            <div className="p-2 border border-[#222] bg-[#111]">
              <span className="text-[9px] text-[#888] block">REFUND CAP</span>
              <span className="text-white font-bold">₹{agent.refundAuthorityMax.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-[#888] mb-1">
              <span>CAPITAL UTILIZATION</span>
              <span className="text-[#00FF41] font-bold">{agent.utilizationPercent.toFixed(1)}% (₹{agent.usedSpend.toLocaleString('en-IN')} / ₹{agent.spendLimit.toLocaleString('en-IN')})</span>
            </div>
            <div className="w-full bg-[#222] h-1.5 overflow-hidden">
              <div className="bg-[#00FF41] h-1.5 transition-all duration-500" style={{ width: `${agent.utilizationPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Operational Timeline & Reasoning History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#222] text-[10px] text-[#888]">
            <span>AUTONOMOUS REASONING & ACTIONS</span>
            <span className="text-[#00FF41]">[{agent.timeline.length} EVENTS RECORDED]</span>
          </div>

          <div className="space-y-3">
            {agent.timeline.map((act) => {
              const isPass = act.decision === 'PERMIT';
              const isBlock = act.decision === 'BLOCK';
              const isReview = act.decision === 'REVIEW';

              return (
                <div key={act.id} className="p-3 border border-[#222] bg-[#0A0A0A] space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[#888]">{act.timestamp}</span>
                      <span className={`px-1.5 py-0.2 border font-bold ${
                        isBlock ? 'bg-[#FF3D00]/10 border-[#FF3D00] text-[#FF3D00]' : isReview ? 'bg-[#FFA000]/10 border-[#FFA000] text-[#FFA000]' : 'bg-[#00FF41]/10 border-[#00FF41] text-[#00FF41]'
                      }`}>
                        [{act.decision}]
                      </span>
                    </div>
                    <span className="text-white font-bold">₹{act.amount.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="text-[11px] text-white font-bold">{act.intent}</div>
                  <p className="text-[10px] text-[#888] leading-relaxed bg-[#111] p-2 border border-[#1A1A1A]">
                    <span className="text-[#00FF41] font-bold block mb-0.5">AGENT REASONING:</span>
                    {act.reasoning}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-[#666]">
                    <span>Outcome: {act.action}</span>
                    {act.txId && (
                      <button
                        onClick={() => {
                          const targetTx = transactions.find(t => t.id === act.txId);
                          if (targetTx) {
                            setSelectedTransaction(targetTx);
                            setIsTransactionDrawerOpen(true);
                          }
                        }}
                        className="text-[#00FF41] hover:underline flex items-center gap-0.5"
                      >
                        <span>INSPECT TX</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#222] bg-[#141414] flex items-center justify-between text-xs mono text-[#888]">
          <span>STATUS: BOUND TO GUARDRAIL CORE</span>
          <span className="text-[#00FF41]">SAFE AUTONOMY ACTIVE</span>
        </div>
      </div>
    </div>
  );
};
