import React from 'react';
import { Transaction } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { formatINR, formatTime } from '../../utils/formatters';
import { Terminal, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

interface AIAgentInActionProps {
  activeTransaction: Transaction;
  onInspectDetails: () => void;
}

export const AIAgentInAction: React.FC<AIAgentInActionProps> = ({
  activeTransaction,
  onInspectDetails
}) => {
  return (
    <div className="bg-[#0E0E0E] border border-[#222] p-4 flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#222]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#FF3D00]" />
            <h3 className="text-xs font-bold mono text-white tracking-wider">
              AGENT EXECUTION HARNESS
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] mono text-[#888]">{activeTransaction.id}</span>
            <StatusBadge status={activeTransaction.status} />
          </div>
        </div>

        {/* Sub-meta */}
        <div className="grid grid-cols-3 gap-2 my-3 p-2.5 bg-[#0A0A0A] border border-[#222] text-[10px] mono">
          <div>
            <span className="text-[#666] block">ACTOR:</span>
            <span className="text-white font-bold truncate block">{activeTransaction.actor}</span>
          </div>
          <div>
            <span className="text-[#666] block">AMOUNT:</span>
            <span className="text-white font-bold block">
              {activeTransaction.amount > 0 ? formatINR(activeTransaction.amount) : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-[#666] block">SETTLEMENT:</span>
            <span className="text-[#00FF41] font-bold block">RAZORPAY_API</span>
          </div>
        </div>

        {/* Current Action Description */}
        <div className="p-2.5 bg-[#141414] border-l-2 border-[#FF3D00] text-xs mono text-[#CCC] mb-3">
          <div className="text-[9px] text-[#888] mb-0.5">INTENT PAYLOAD:</div>
          "{activeTransaction.action}"
        </div>

        {/* Reason notice if Blocked or Review */}
        {activeTransaction.reason && (
          <div className={`p-2.5 border text-[11px] mono mb-3 ${
            activeTransaction.status === 'BLOCKED'
              ? 'bg-[#FF3D00]/10 border-[#FF3D00]/40 text-[#FF3D00]'
              : 'bg-[#FFB52E]/10 border-[#FFB52E]/40 text-[#FFB52E]'
          }`}>
            <div className="font-bold text-[10px] mb-0.5">
              {activeTransaction.status === 'BLOCKED' ? '[VIOLATION PREVENTED]' : '[SUPERVISOR ESCALATION]'}
            </div>
            <p className="text-[10px] leading-relaxed opacity-90">{activeTransaction.reason}</p>
          </div>
        )}

        {/* 4-Step Verification Micro Pipeline */}
        <div className="space-y-1.5">
          <div className="text-[9px] mono text-[#666] uppercase tracking-wider">
            GOVERNANCE PIPELINE VERIFICATION
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[10px] mono">
            <div className="p-2 bg-[#0A0A0A] border border-[#222] flex items-center justify-between">
              <span className="text-[#888]">1. INTENT PLAN</span>
              <span className="text-[#00FF41]">[VERIFIED]</span>
            </div>
            <div className="p-2 bg-[#0A0A0A] border border-[#222] flex items-center justify-between">
              <span className="text-[#888]">2. SPEND CAP</span>
              <span className={activeTransaction.status === 'BLOCKED' ? 'text-[#FF3D00]' : 'text-[#00FF41]'}>
                {activeTransaction.status === 'BLOCKED' ? '[BREACH]' : '[PASSED]'}
              </span>
            </div>
            <div className="p-2 bg-[#0A0A0A] border border-[#222] flex items-center justify-between">
              <span className="text-[#888]">3. MARGIN FLOOR</span>
              <span className={activeTransaction.status === 'BLOCKED' ? 'text-[#FF3D00]' : 'text-[#00FF41]'}>
                {activeTransaction.status === 'BLOCKED' ? '[HALTED]' : '[PASSED]'}
              </span>
            </div>
            <div className="p-2 bg-[#0A0A0A] border border-[#222] flex items-center justify-between">
              <span className="text-[#888]">4. RAZORPAY RELAY</span>
              <span className={activeTransaction.status === 'SUCCESS' ? 'text-[#00FF41]' : 'text-[#888]'}>
                {activeTransaction.status === 'SUCCESS' ? '[SETTLED]' : '[HELD]'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Button inspect */}
      <button
        onClick={onInspectDetails}
        className="mt-3 w-full py-2 bg-[#1A1A1A] hover:bg-[#222] border border-[#333] hover:border-[#FF3D00] text-xs mono text-white flex items-center justify-center gap-2 transition"
      >
        <span>INSPECT FULL 10-STEP LIFECYCLE</span>
        <ArrowRight className="w-3.5 h-3.5 text-[#FF3D00]" />
      </button>
    </div>
  );
};
