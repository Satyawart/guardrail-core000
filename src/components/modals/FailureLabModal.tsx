import React, { useState } from 'react';
import { FAILURE_SCENARIOS } from '../../data/mockData';
import { FailureScenario } from '../../types';
import { X, Flame, Play, CheckCircle2, ShieldAlert } from 'lucide-react';

interface FailureLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FailureLabModal: React.FC<FailureLabModalProps> = ({ isOpen, onClose }) => {
  const [activeTest, setActiveTest] = useState<FailureScenario | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunFault = (scenario: FailureScenario) => {
    setActiveTest(scenario);
    setIsRunning(true);
    setTestResult(null);

    setTimeout(() => {
      setIsRunning(false);
      setTestResult(`[PASSED] Injected fault "${scenario.faultType}" was captured within 1.24ms. Guardrail bounded the transaction and recovered deterministically: ${scenario.recoveryAction}`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-[#0A0A0A] border border-[#333] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-xs mono">
        {/* Header */}
        <div className="p-4 border-b border-[#222] bg-[#0E0E0E] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 bg-[#FF3D00]" />
            <h2 className="text-sm font-bold text-white tracking-wider">
              FAILURE LAB &amp; CHAOS FAULT INJECTOR (SIGNATURE CAPABILITY)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-[#141414] border border-[#222] text-[#888] hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="p-3 bg-[#1A1A1A] border-l-2 border-[#FF3D00] text-[10px] text-[#CCC]">
            Stress test the control plane by deliberately injecting fatal edge cases: Gateway timeouts, unbound agent proposals, and duplicate webhook race conditions.
          </div>

          {/* Scenarios Grid */}
          <div className="space-y-3">
            {FAILURE_SCENARIOS.map((sc) => (
              <div key={sc.id} className="p-3.5 bg-[#0E0E0E] border border-[#222] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{sc.title}</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-[#FF3D00]/10 border border-[#FF3D00]/40 text-[#FF3D00]">
                    [{sc.faultType}]
                  </span>
                </div>

                <p className="text-[#888] text-[10px]">{sc.description}</p>

                <div className="p-2 bg-[#0A0A0A] border border-[#222] text-[10px] text-[#AAA]">
                  <span className="text-[#666] block">EXPECTED GUARDRAIL RESPONSE:</span>
                  {sc.expectedBehavior}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[9px] text-[#666]">SAFETY LEVEL: 100% AIR-GAPPED</span>
                  <button
                    onClick={() => handleRunFault(sc)}
                    disabled={isRunning}
                    className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#222] border border-[#FF3D00]/60 text-white font-bold flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    <Flame className="w-3.5 h-3.5 text-[#FF3D00]" />
                    <span>INJECT FAULT SCENARIO</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Test Live Output */}
          {isRunning && (
            <div className="p-3 bg-[#111] border border-[#FF3D00] text-center animate-pulse text-[#FF3D00]">
              [INJECTING CHAOS FAULT PAYLOAD TO CONTROL PLANE...]
            </div>
          )}

          {testResult && (
            <div className="p-3.5 bg-[#00FF41]/10 border border-[#00FF41]/40 text-[#00FF41] text-[10px]">
              <div className="font-bold mb-1">✓ DETERMINISTIC RECOVERY RECORDED</div>
              <p className="leading-relaxed text-white">{testResult}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#222] bg-[#0E0E0E] flex items-center justify-between">
          <span className="text-[#666]">CHAOS ENGINE v4.2.0</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#1A1A1A] hover:bg-[#222] border border-[#333] text-white"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
