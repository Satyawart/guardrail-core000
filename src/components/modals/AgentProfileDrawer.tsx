import React, { useState } from 'react';
import { useGuardrail } from '../../context/GuardrailContext';
import { AgentRuntime } from '../../types';
import { 
  X, 
  Bot, 
  Pause, 
  Play, 
  AlertOctagon, 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  Lock, 
  DollarSign, 
  ArrowRight, 
  CheckCircle, 
  ExternalLink,
  History,
  FileText
} from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import { ConfirmationModal } from './ConfirmationModal';

interface AgentProfileDrawerProps {
  agent: AgentRuntime | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AgentProfileDrawer: React.FC<AgentProfileDrawerProps> = ({
  agent,
  isOpen,
  onClose
}) => {
  const { toggleAgentStatus, setCurrentNav, setSelectedTransaction, setIsTransactionDrawerOpen, transactions, addToast } = useGuardrail();
  const [activeSubTab, setActiveSubTab] = useState<'OVERVIEW' | 'ACTIONS' | 'POLICIES' | 'GOVERNANCE'>('OVERVIEW');
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);

  if (!isOpen || !agent) return null;

  const isActive = agent.status === 'ACTIVE';
  const isPaused = agent.status === 'PAUSED';
  const isBlocked = agent.status === 'BLOCKED';

  const agentRecentTx = transactions.filter(t => t.actor.includes(agent.name) || t.actor.includes(agent.id) || agent.name.includes(t.actor));

  const handleToggle = () => {
    if (isActive) {
      setShowPauseConfirm(true);
    } else {
      toggleAgentStatus(agent.id, 'ACTIVE');
      addToast({
        title: `Agent Resumed`,
        message: `${agent.name} is now [ACTIVE].`,
        type: 'success'
      });
    }
  };

  const confirmPause = () => {
    toggleAgentStatus(agent.id, 'PAUSED');
    setShowPauseConfirm(false);
    addToast({
      title: `Agent Paused`,
      message: `${agent.name} execution is paused.`,
      type: 'warning'
    });
  };

  const confirmRevoke = () => {
    toggleAgentStatus(agent.id, 'BLOCKED');
    setShowRevokeConfirm(false);
    addToast({
      title: 'Agent Authority Revoked',
      message: `Spend authority and settlement permissions revoked for ${agent.name}.`,
      type: 'error'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex justify-end backdrop-blur-xs">
      <div className="w-full max-w-xl bg-[#0E0E0E] border-l border-[#333] h-full flex flex-col shadow-2xl animate-in slide-in-from-right-4 duration-200 mono text-xs">
        
        {/* Header */}
        <div className="p-4 border-b border-[#222] bg-[#141414] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-[#00FF41]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{agent.name}</span>
                <span className={`text-[9px] px-2 py-0.2 border ${
                  isActive 
                    ? 'bg-[#00FF41]/10 border-[#00FF41] text-[#00FF41]' 
                    : isPaused 
                    ? 'bg-[#FFA000]/10 border-[#FFA000] text-[#FFA000]' 
                    : 'bg-[#FF3D00]/10 border-[#FF3D00] text-[#FF3D00]'
                }`}>
                  [{agent.status}]
                </span>
              </div>
              <span className="text-[10px] text-[#888]">{agent.type} • ID: {agent.id}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#888] hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Governance Control Strip */}
        <div className="p-3 bg-[#0A0A0A] border-b border-[#222] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggle}
              className={`px-3 py-1.5 border font-bold text-xs flex items-center gap-1.5 transition ${
                isActive
                  ? 'bg-[#141414] border-[#FFA000] text-[#FFA000] hover:bg-[#FFA000] hover:text-black'
                  : 'bg-[#141414] border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41] hover:text-black'
              }`}
            >
              {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isActive ? 'PAUSE AGENT' : 'RESUME AGENT'}</span>
            </button>

            <button
              onClick={() => setShowRevokeConfirm(true)}
              disabled={isBlocked}
              className="px-3 py-1.5 bg-[#141414] border border-[#FF3D00] text-[#FF3D00] hover:bg-[#FF3D00] hover:text-black font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-40"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>REVOKE AUTHORITY</span>
            </button>
          </div>

          <span className="text-[10px] text-[#888] hidden sm:inline">SANDBOX: STRICT</span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#222] bg-[#111] px-4">
          <button
            onClick={() => setActiveSubTab('OVERVIEW')}
            className={`px-3 py-2 border-b-2 font-bold transition ${
              activeSubTab === 'OVERVIEW' ? 'border-[#00FF41] text-white' : 'border-transparent text-[#888]'
            }`}
          >
            AUTHORITY & STATS
          </button>
          <button
            onClick={() => setActiveSubTab('ACTIONS')}
            className={`px-3 py-2 border-b-2 font-bold transition ${
              activeSubTab === 'ACTIONS' ? 'border-[#00FF41] text-white' : 'border-transparent text-[#888]'
            }`}
          >
            RECENT ACTIONS ({agentRecentTx.length})
          </button>
          <button
            onClick={() => setActiveSubTab('POLICIES')}
            className={`px-3 py-2 border-b-2 font-bold transition ${
              activeSubTab === 'POLICIES' ? 'border-[#00FF41] text-white' : 'border-transparent text-[#888]'
            }`}
          >
            BOUND POLICIES
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* TAB 1: Overview */}
          {activeSubTab === 'OVERVIEW' && (
            <div className="space-y-4">
              {/* Spend Meter Card */}
              <div className="p-4 bg-[#0A0A0A] border border-[#222] space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#888] font-bold">REAL-TIME SPEND CEILING:</span>
                  <span className="text-white font-bold">
                    {formatINR(agent.usedSpend)} / {formatINR(agent.spendLimit)}
                  </span>
                </div>
                <div className="w-full bg-[#222] h-2.5 overflow-hidden">
                  <div
                    className="bg-[#00FF41] h-2.5 transition-all duration-500"
                    style={{ width: `${agent.utilizationPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#888]">
                  <span>{agent.utilizationPercent.toFixed(1)}% ALLOCATED</span>
                  <span className="text-[#00FF41] font-bold">{formatINR(agent.remainingSpend)} REMAINING HEADROOM</span>
                </div>
              </div>

              {/* Constraint Parameters Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-[#0A0A0A] border border-[#222]">
                  <span className="text-[9px] text-[#888] block mb-1">MAX DISCOUNT:</span>
                  <span className="text-white font-bold text-sm">{agent.discountAuthorityMaxPercent}%</span>
                </div>
                <div className="p-3 bg-[#0A0A0A] border border-[#222]">
                  <span className="text-[9px] text-[#888] block mb-1">REFUND CAP:</span>
                  <span className="text-white font-bold text-sm">{formatINR(agent.refundAuthorityMax)}</span>
                </div>
                <div className="p-3 bg-[#0A0A0A] border border-[#222]">
                  <span className="text-[9px] text-[#888] block mb-1">RISK TIER:</span>
                  <span className={`font-bold text-sm ${agent.riskScore > 0.2 ? 'text-[#FF3D00]' : 'text-[#00FF41]'}`}>
                    {agent.riskScore.toFixed(2)} [LOW]
                  </span>
                </div>
              </div>

              {/* Agent Telemetry & Reasoning State */}
              <div className="p-3 bg-[#111] border border-[#222] space-y-2">
                <span className="text-[10px] text-[#888] font-bold block uppercase">CURRENT REASONING STATE:</span>
                <p className="text-[#CCC] text-[11px] leading-relaxed">
                  Agent is operating within standard tool bounds. Intent parser reports zero semantic drift. Spend authority locks engage dynamically at ₹5,00,000 threshold.
                </p>
                <div className="p-2 bg-[#0A0A0A] border border-[#222] text-[10px] text-[#00FF41]">
                  Last Action: {agent.lastAction}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Recent Actions */}
          {activeSubTab === 'ACTIONS' && (
            <div className="space-y-2">
              <div className="text-[10px] text-[#888] mb-1">RECENT COMMERCE INTENTS DISPATCHED:</div>
              {agentRecentTx.length > 0 ? (
                agentRecentTx.map((tx) => (
                  <div
                    key={tx.id}
                    onClick={() => {
                      setSelectedTransaction(tx);
                      setIsTransactionDrawerOpen(true);
                    }}
                    className="p-3 bg-[#0A0A0A] border border-[#222] hover:border-[#00FF41] cursor-pointer transition flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{tx.id}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 border ${
                          tx.status === 'BLOCKED' ? 'bg-[#FF3D00]/10 border-[#FF3D00] text-[#FF3D00]' : 'bg-[#00FF41]/10 border-[#00FF41] text-[#00FF41]'
                        }`}>
                          [{tx.status}]
                        </span>
                      </div>
                      <div className="text-[11px] text-[#888] mt-0.5">{tx.action}</div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-white">{formatINR(tx.amount)}</div>
                      <div className="text-[9px] text-[#00FF41] flex items-center gap-1 justify-end">
                        <span>INSPECT</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-[#666] bg-[#0A0A0A] border border-[#222]">
                  No recent transactions recorded for this runtime in current session.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Bound Policies */}
          {activeSubTab === 'POLICIES' && (
            <div className="space-y-3">
              <div className="p-3 bg-[#0A0A0A] border border-[#222] space-y-1">
                <span className="text-white font-bold block">POL-001: Margin Floor (15.0%)</span>
                <p className="text-[11px] text-[#888]">Requires all quotes and purchases to preserve a minimum 15% net margin.</p>
                <span className="text-[9px] text-[#00FF41]">[ENFORCED AT PERIMETER]</span>
              </div>
              <div className="p-3 bg-[#0A0A0A] border border-[#222] space-y-1">
                <span className="text-white font-bold block">POL-002: Spend Ceiling (₹5,00,000)</span>
                <p className="text-[11px] text-[#888]">Single transaction ceiling with automated escalation for over-limit proposals.</p>
                <span className="text-[9px] text-[#00FF41]">[ENFORCED AT PERIMETER]</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#222] bg-[#141414] flex items-center justify-between text-[10px] text-[#888]">
          <span>RUNTIME DIGITAL TWIN • BOUND TO GUARDRAIL CORE</span>
          <button
            onClick={() => {
              onClose();
              setCurrentNav('TRANSACTIONS');
            }}
            className="text-[#00FF41] hover:underline flex items-center gap-1"
          >
            <span>VIEW ALL AGENT ACTIVITY</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

      </div>

      {/* Confirmation for Revoke Authority */}
      <ConfirmationModal
        isOpen={showRevokeConfirm}
        title="REVOKE AGENT SPEND AUTHORITY?"
        message={`Are you sure you want to completely revoke spend, procurement, and payment settlement permissions for ${agent.name}?`}
        details="This will immediately block all pending transactions and disconnect the agent from Razorpay payment rails."
        confirmText="REVOKE ALL PERMISSIONS"
        variant="danger"
        onConfirm={confirmRevoke}
        onCancel={() => setShowRevokeConfirm(false)}
      />

      {/* Confirmation for Pause Agent */}
      <ConfirmationModal
        isOpen={showPauseConfirm}
        title="PAUSE CRITICAL AGENT RUNTIME?"
        message={`Are you sure you want to pause execution for ${agent.name}?`}
        details="The agent will enter a suspended state and reject any incoming user tasks until resumed."
        confirmText="PAUSE RUNTIME"
        variant="warning"
        onConfirm={confirmPause}
        onCancel={() => setShowPauseConfirm(false)}
      />
    </div>
  );
};
