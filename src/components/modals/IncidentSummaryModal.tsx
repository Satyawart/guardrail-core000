import React from 'react';
import { X, AlertTriangle, ShieldCheck, CheckCircle, RefreshCw, Lock, ArrowRight, DollarSign } from 'lucide-react';

interface IncidentSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunFailureLab?: () => void;
}

export const IncidentSummaryModal: React.FC<IncidentSummaryModalProps> = ({
  isOpen,
  onClose,
  onRunFailureLab
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#0E0E0E] border border-[#333] shadow-2xl mono text-xs">
        
        {/* Modal Header */}
        <div className="p-4 bg-[#141414] border-b border-[#222] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 bg-[#FF3D00]" />
            <span className="font-bold text-white tracking-wider">INCIDENT REPORT #INC-0042</span>
            <span className="text-[9px] px-2 py-0.2 bg-[#00FF41]/10 border border-[#00FF41] text-[#00FF41]">
              [RECOVERED]
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#888] hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          
          {/* Fault & Expected Behavior */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            <div className="p-3 bg-[#0A0A0A] border border-[#222] space-y-1">
              <span className="text-[9px] text-[#888] block uppercase">INJECTED FAULT:</span>
              <span className="text-[#FF3D00] font-bold block">Payment Gateway Timeout (T+1000ms)</span>
              <p className="text-[10px] text-[#666]">Razorpay testnet connection dropped during capture event.</p>
            </div>

            <div className="p-3 bg-[#0A0A0A] border border-[#222] space-y-1">
              <span className="text-[9px] text-[#888] block uppercase">EXPECTED BEHAVIOR:</span>
              <span className="text-white font-bold block">Do not blindly retry payment</span>
              <p className="text-[10px] text-[#666]">Check distributed idempotency ledger prior to any retry.</p>
            </div>
          </div>

          {/* Actual Response Trace */}
          <div className="p-3 bg-[#111] border border-[#222] space-y-2 text-xs">
            <span className="text-[10px] text-[#888] font-bold block">ACTUAL GUARDRAIL RESPONSE:</span>
            <div className="space-y-1 text-[#CCC] text-[11px]">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#00FF41] shrink-0" />
                <span>1. Transaction request frozen at core perimeter</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#00FF41] shrink-0" />
                <span>2. Idempotency key verified against central ledger</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#00FF41] shrink-0" />
                <span>3. Atomic lock prevented unsafe double-debit retry</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#00FF41] shrink-0" />
                <span>4. Webhook reconciliation verified clean single settlement</span>
              </div>
            </div>
          </div>

          {/* Before vs After Impact Comparison */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#1A0E0C] border border-[#FF3D00]/40 space-y-1">
              <span className="text-[9px] text-[#FF3D00] block font-bold">WITHOUT GUARDRAIL:</span>
              <span className="text-white font-bold block">Duplicate Debit: ₹3,20,000</span>
              <p className="text-[10px] text-[#AAA]">Blind retry would have charged customer account twice.</p>
            </div>

            <div className="p-3 bg-[#0E1A11] border border-[#00FF41]/40 space-y-1">
              <span className="text-[9px] text-[#00FF41] block font-bold">WITH GUARDRAIL CORE:</span>
              <span className="text-[#00FF41] font-bold block">₹0 Duplicate Loss</span>
              <p className="text-[10px] text-[#AAA]">Zero financial leakage. 100% verified settlement.</p>
            </div>
          </div>

          {/* Recovery Proof Status */}
          <div className="p-3 bg-[#0A0A0A] border border-[#222] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#00FF41]" />
              <div>
                <span className="text-white font-bold block">SYSTEM RECOVERED: YES</span>
                <span className="text-[10px] text-[#888]">Audit proof #84912 committed with SHA-256 root</span>
              </div>
            </div>

            <span className="text-[10px] mono px-2 py-1 bg-[#00FF41]/10 border border-[#00FF41] text-[#00FF41] font-bold">
              [VERIFIED RESILIENT]
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-[#141414] border-t border-[#222] flex items-center justify-between">
          <span className="text-[10px] text-[#888]">INCIDENT #INC-0042 • POST-MORTEM</span>
          <div className="flex items-center gap-2">
            {onRunFailureLab && (
              <button
                onClick={() => {
                  onClose();
                  onRunFailureLab();
                }}
                className="px-3 py-1.5 bg-[#1A1A1A] border border-[#FF3D00] text-[#FF3D00] hover:bg-[#FF3D00] hover:text-black font-bold transition text-xs flex items-center gap-1"
              >
                <span>OPEN IN FAILURE LAB</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-[#222] text-white hover:bg-[#333] transition text-xs font-bold"
            >
              CLOSE
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
