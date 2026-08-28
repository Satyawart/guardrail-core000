import React from 'react';
import { 
  PlusCircle, 
  Bot, 
  Flame, 
  Award, 
  ArrowRight
} from 'lucide-react';

interface QuickActionsProps {
  onOpenPolicyStudio: () => void;
  onOpenAgentActivity: () => void;
  onOpenFailureLab: () => void;
  onOpenEvaluation: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onOpenPolicyStudio,
  onOpenAgentActivity,
  onOpenFailureLab,
  onOpenEvaluation
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 w-full">
      {/* 1. Policy Studio */}
      <button
        onClick={onOpenPolicyStudio}
        className="group bg-[#0E0E0E] p-3.5 border border-[#222] hover:border-[#444] hover:bg-[#141414] transition text-left flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#141414] border border-[#222] text-[#00FF41]">
            <PlusCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs mono text-white">
              CREATE POLICY
            </div>
            <div className="text-[10px] text-[#888] mono">
              Natural Language Rule Studio
            </div>
          </div>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-[#666] group-hover:text-white transition" />
      </button>

      {/* 2. Agent Runtimes */}
      <button
        onClick={onOpenAgentActivity}
        className="group bg-[#0E0E0E] p-3.5 border border-[#222] hover:border-[#444] hover:bg-[#141414] transition text-left flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#141414] border border-[#222] text-white">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs mono text-white">
              AGENT ACTIVITY
            </div>
            <div className="text-[10px] text-[#888] mono">
              12 Active Runtimes &amp; Caps
            </div>
          </div>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-[#666] group-hover:text-white transition" />
      </button>

      {/* 3. Simulate Failure (Highlighted with Orange) */}
      <button
        onClick={onOpenFailureLab}
        className="group bg-[#1A1A1A] p-3.5 border border-[#FF3D00]/50 hover:border-[#FF3D00] transition text-left flex items-center justify-between relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 px-1.5 py-0.2 bg-[#FF3D00] text-black text-[9px] mono font-bold">
          SIGNATURE
        </div>

        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#FF3D00]/20 border border-[#FF3D00]/40 text-[#FF3D00]">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs mono text-white flex items-center gap-1.5">
              SIMULATE FAILURE
              <span className="w-1.5 h-1.5 bg-[#FF3D00] animate-pulse" />
            </div>
            <div className="text-[10px] text-[#AAA] mono">
              Inject Fault &amp; Observe Recovery
            </div>
          </div>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-[#FF3D00] group-hover:translate-x-1 transition-transform" />
      </button>

      {/* 4. Run Evaluation */}
      <button
        onClick={onOpenEvaluation}
        className="group bg-[#0E0E0E] p-3.5 border border-[#222] hover:border-[#444] hover:bg-[#141414] transition text-left flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#141414] border border-[#222] text-[#00FF41]">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs mono text-white">
              RUN EVALUATION
            </div>
            <div className="text-[10px] text-[#888] mono">
              1,000 Deterministic Benchmarks
            </div>
          </div>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-[#666] group-hover:text-white transition" />
      </button>
    </div>
  );
};
