import React, { useState } from 'react';
import { useGuardrail } from '../../context/GuardrailContext';
import { AgentRuntime } from '../../types';
import { AgentProfileDrawer } from '../modals/AgentProfileDrawer';
import { Bot, ShieldCheck, Pause, Play, AlertOctagon, Terminal, ArrowRight, Activity, Clock, Sliders, ExternalLink } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';
import { formatINR } from '../../utils/formatters';

export const AgentsView: React.FC = () => {
  const { agents, toggleAgentStatus, addToast } = useGuardrail();
  const [selectedAgentForDrawer, setSelectedAgentForDrawer] = useState<AgentRuntime | null>(null);

  const handleToggleAgent = (agent: AgentRuntime) => {
    const nextStatus = agent.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    toggleAgentStatus(agent.id, nextStatus);
    addToast({
      title: `Agent State Changed`,
      message: `${agent.name} is now [${nextStatus}].`,
      type: nextStatus === 'ACTIVE' ? 'success' : 'warning'
    });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Agent Profile Drawer */}
      <AgentProfileDrawer
        agent={selectedAgentForDrawer}
        isOpen={!!selectedAgentForDrawer}
        onClose={() => setSelectedAgentForDrawer(null)}
      />

      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#0E0E0E] border border-[#222]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#00FF41]" />
            <h1 className="text-base font-bold mono text-white tracking-wider">AI AGENT AUTHORITY & DIGITAL TWIN PROFILES</h1>
            <span className="text-[10px] mono px-2 py-0.5 bg-[#1A1A1A] border border-[#333] text-[#00FF41]">
              12 BOUND RUNTIMES
            </span>
          </div>
          <p className="text-xs mono text-[#888] mt-1">
            Deterministic governance parameters, real-time spend ceilings, and automated policy binding for all enterprise AI agents.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs mono text-[#888]">
          <div className="text-right">
            <span className="block text-[10px]">TOTAL GOVERNED SPEND CAP</span>
            <span className="text-white font-bold text-sm">₹16,00,000</span>
          </div>
        </div>
      </div>

      {/* Grid of Agent Runtimes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => {
          const isActive = agent.status === 'ACTIVE';
          const isPaused = agent.status === 'PAUSED';
          const isBlocked = agent.status === 'BLOCKED';

          return (
            <div 
              key={agent.id}
              className="p-4 bg-[#0E0E0E] border border-[#222] hover:border-[#333] transition flex flex-col justify-between space-y-4"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div 
                  onClick={() => setSelectedAgentForDrawer(agent)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-10 h-10 bg-[#141414] border border-[#333] group-hover:border-[#00FF41] flex items-center justify-center text-[#00FF41] transition">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm mono text-white group-hover:text-[#00FF41] transition">{agent.name}</span>
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
                    <span className="text-[11px] mono text-[#888]">{agent.type} • ID: {agent.id}</span>
                  </div>
                </div>

                {/* Status Toggle */}
                {isActive ? (
                  <button
                    onClick={() => handleToggleAgent(agent)}
                    className="px-2.5 py-1 bg-[#141414] border border-[#FFA000]/40 hover:border-[#FFA000] text-[#FFA000] text-[10px] mono transition flex items-center gap-1"
                  >
                    <Pause className="w-3 h-3" />
                    <span>PAUSE</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggleAgent(agent)}
                    className="px-2.5 py-1 bg-[#141414] border border-[#00FF41]/40 hover:border-[#00FF41] text-[#00FF41] text-[10px] mono transition flex items-center gap-1"
                  >
                    <Play className="w-3 h-3" />
                    <span>ACTIVATE</span>
                  </button>
                )}
              </div>

              {/* Spend Meter */}
              <div className="space-y-1.5 mono text-xs bg-[#0A0A0A] p-3 border border-[#1A1A1A]">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#888]">
                    <Tooltip term="Spend Authority" content="The deterministic maximum limit an autonomous agent is permitted to execute without human sign-off." />
                  </span>
                  <span className="text-white font-bold">
                    {formatINR(agent.usedSpend)} / {formatINR(agent.spendLimit)}
                  </span>
                </div>
                <div className="w-full bg-[#222] h-2 overflow-hidden">
                  <div 
                    className="bg-[#00FF41] h-2 transition-all duration-500" 
                    style={{ width: `${agent.utilizationPercent}%` }} 
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#666]">
                  <span>{agent.utilizationPercent.toFixed(1)}% ALLOCATED</span>
                  <span>{formatINR(agent.remainingSpend)} REMAINING</span>
                </div>
              </div>

              {/* Constraint Parameters */}
              <div className="grid grid-cols-3 gap-2 text-center mono text-xs">
                <div className="p-2 border border-[#222] bg-[#111]">
                  <span className="text-[9px] text-[#888] block">MAX DISCOUNT</span>
                  <span className="text-white font-bold">{agent.discountAuthorityMaxPercent}%</span>
                </div>
                <div className="p-2 border border-[#222] bg-[#111]">
                  <span className="text-[9px] text-[#888] block">MAX REFUND</span>
                  <span className="text-white font-bold">{formatINR(agent.refundAuthorityMax)}</span>
                </div>
                <div className="p-2 border border-[#222] bg-[#111]">
                  <span className="text-[9px] text-[#888] block">RISK SCORE</span>
                  <span className={`font-bold ${agent.riskScore > 0.2 ? 'text-[#FF3D00]' : 'text-[#00FF41]'}`}>
                    {agent.riskScore.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Latest Action & Drawer Trigger */}
              <div className="pt-2 border-t border-[#1A1A1A] flex items-center justify-between mono text-xs">
                <div className="truncate text-[#888] text-[11px] max-w-[240px]">
                  <span className="text-[#AAA] font-bold">Latest: </span>
                  {agent.lastAction}
                </div>
                <button
                  onClick={() => setSelectedAgentForDrawer(agent)}
                  className="text-[#00FF41] hover:underline flex items-center gap-1 text-[11px] font-bold shrink-0"
                >
                  <span>PROFILE & REASONING</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
