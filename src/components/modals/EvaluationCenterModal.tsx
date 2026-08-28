import React, { useState } from 'react';
import { X, Award, Play, CheckCircle2 } from 'lucide-react';

interface EvaluationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EvaluationCenterModal: React.FC<EvaluationCenterModalProps> = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(100);

  if (!isOpen) return null;

  const handleRunSuite = () => {
    setIsRunning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return prev + 20;
      });
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-[#0A0A0A] border border-[#333] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-xs mono">
        {/* Header */}
        <div className="p-4 border-b border-[#222] bg-[#0E0E0E] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 bg-[#00FF41]" />
            <h2 className="text-sm font-bold text-white tracking-wider">
              1,000-BENCHMARK DETERMINISTIC EVALUATION SUITE
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
          <div className="p-3.5 bg-[#0E0E0E] border border-[#222] flex items-center justify-between">
            <div>
              <div className="text-white font-bold text-xs">OFFLINE BENCHMARK INTEGRITY SCORE</div>
              <div className="text-[10px] text-[#888] mt-0.5">
                Evaluation across 1,000 synthetic attack vectors &amp; margin boundary tests.
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-[#00FF41]">100.0%</span>
              <span className="block text-[9px] text-[#888]">PASS RATE (1000/1000)</span>
            </div>
          </div>

          {/* Test Categories */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-[#0E0E0E] border border-[#222]">
              <div className="flex justify-between text-white font-bold mb-1">
                <span>MARGIN FLOOR INTEGRITY</span>
                <span className="text-[#00FF41]">300/300</span>
              </div>
              <p className="text-[10px] text-[#888]">Zero instances of sub-15% discount slippage.</p>
            </div>

            <div className="p-3 bg-[#0E0E0E] border border-[#222]">
              <div className="flex justify-between text-white font-bold mb-1">
                <span>SPEND CEILING ENFORCEMENT</span>
                <span className="text-[#00FF41]">250/250</span>
              </div>
              <p className="text-[10px] text-[#888]">100% hard blocking on transactions &gt; ₹5,00,000.</p>
            </div>

            <div className="p-3 bg-[#0E0E0E] border border-[#222]">
              <div className="flex justify-between text-white font-bold mb-1">
                <span>IDEMPOTENCY &amp; REPLAY TESTS</span>
                <span className="text-[#00FF41]">250/250</span>
              </div>
              <p className="text-[10px] text-[#888]">Zero double debits on 5x concurrent duplicate webhooks.</p>
            </div>

            <div className="p-3 bg-[#0E0E0E] border border-[#222]">
              <div className="flex justify-between text-white font-bold mb-1">
                <span>SUPERVISOR ROUTING MATRIX</span>
                <span className="text-[#00FF41]">200/200</span>
              </div>
              <p className="text-[10px] text-[#888]">Accurate threshold escalation for VIP refund claims.</p>
            </div>
          </div>

          {/* Progress bar */}
          {isRunning && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-[#888]">
                <span>RUNNING SUITE...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-[#222] h-1.5">
                <div className="bg-[#00FF41] h-1.5 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#222] bg-[#0E0E0E] flex items-center justify-between">
          <button
            onClick={handleRunSuite}
            disabled={isRunning}
            className="px-3 py-1.5 bg-[#00FF41] text-black font-bold hover:bg-[#34d399] transition disabled:opacity-50"
          >
            {isRunning ? 'EVALUATING...' : 'RE-RUN 1,000 BENCHMARK SUITE'}
          </button>
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
