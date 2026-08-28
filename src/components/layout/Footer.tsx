import React, { useState, useEffect } from 'react';
import { useGuardrail } from '../../context/GuardrailContext';
import { ShieldCheck, Cpu, Terminal, Clock, Activity, Zap, RotateCcw } from 'lucide-react';
import { ConfirmationModal } from '../modals/ConfirmationModal';

export const Footer: React.FC = () => {
  const { isTestMode, resetDemoState } = useGuardrail();
  const [lastSyncTime, setLastSyncTime] = useState<string>('14:29:04');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    // Keep sync time alive
    const timer = setInterval(() => {
      setLastSyncTime(new Date().toLocaleTimeString());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <footer className="h-8 bg-[#0E0E0E] border-t border-[#222] px-3 sm:px-4 flex items-center justify-between z-30 select-none text-[10px] mono text-[#888]">
        {/* Left: Environment & Subsystems Truth Indicators */}
        <div className="flex items-center gap-2 sm:gap-3 truncate">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[#666]">ENV:</span>
            <span className="text-[#00FF41] font-bold px-1.5 py-0.2 bg-[#1A1A1A] border border-[#333]">
              [SIMULATION]
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 shrink-0">
            <span className="text-[#666]">RAIL:</span>
            <span className={`font-bold px-1.5 py-0.2 bg-[#1A1A1A] border ${
              isTestMode ? 'border-[#00FF41] text-[#00FF41]' : 'border-[#333] text-[#AAA]'
            }`}>
              {isTestMode ? '[RAZORPAY TESTNET]' : '[LOCAL SANDBOX]'}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 shrink-0">
            <span className="text-[#666]">POLICY:</span>
            <span className="text-white font-bold px-1.5 py-0.2 bg-[#1A1A1A] border border-[#333]">
              [DETERMINISTIC AST]
            </span>
          </div>

          <div className="hidden xl:flex items-center gap-1.5 shrink-0">
            <span className="text-[#666]">AUDIT:</span>
            <span className="text-[#00FF41] font-bold px-1.5 py-0.2 bg-[#1A1A1A] border border-[#333]">
              [SHA-256 VERIFIED]
            </span>
          </div>
        </div>

        {/* Center: System Philosophy */}
        <div className="hidden 2xl:flex items-center gap-1.5 text-white font-bold">
          <span className="text-[#FF3D00]">[CORE PRINCIPLE]</span>
          <span>AI CAN PROPOSE. GUARDRAIL DECIDES.</span>
        </div>

        {/* Right: Sync Time, Latency & Reset Demo Button */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div className="hidden sm:flex items-center gap-1 text-[#666]">
            <span>LAST SYNC:</span>
            <span className="text-white font-bold">{lastSyncTime}</span>
          </div>

          <div className="flex items-center gap-1 text-[#00FF41]">
            <Activity className="w-3 h-3 text-[#00FF41]" />
            <span>1.22ms</span>
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1 px-2 py-0.5 bg-[#141414] border border-[#333] hover:border-[#FFA000] text-[#FFA000] hover:text-white transition"
            title="Reset simulation to canonical starting state"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span className="hidden sm:inline">RESET STATE</span>
            <span className="sm:hidden">RESET</span>
          </button>
        </div>
      </footer>

      {/* Reset Confirmation Dialog */}
      <ConfirmationModal
        isOpen={showResetConfirm}
        title="RESET SIMULATION STATE?"
        message="This will restore all 12 agent runtimes, transactions, policies, supervisor queues, and failure lab states back to the canonical starting baseline."
        confirmText="RESTORE BASELINE"
        variant="warning"
        onConfirm={() => {
          resetDemoState();
          setShowResetConfirm(false);
        }}
        onCancel={() => setShowResetConfirm(false)}
      />
    </>
  );
};

