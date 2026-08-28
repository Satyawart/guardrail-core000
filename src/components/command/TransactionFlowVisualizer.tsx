import React from 'react';
import { LifecycleStep } from '../../types';
import { CheckCircle, AlertTriangle, XCircle, Clock, ChevronDown, ChevronUp, ShieldCheck, Zap } from 'lucide-react';

interface TransactionFlowVisualizerProps {
  steps: LifecycleStep[];
  replayingIndex?: number | null;
  interactive?: boolean;
  onStepClick?: (step: LifecycleStep) => void;
}

export const TransactionFlowVisualizer: React.FC<TransactionFlowVisualizerProps> = ({
  steps,
  replayingIndex = null,
  interactive = true,
  onStepClick
}) => {
  const [expandedStepId, setExpandedStepId] = React.useState<string | null>(null);

  const toggleExpand = (id: string) => {
    if (!interactive) return;
    setExpandedStepId(prev => prev === id ? null : id);
  };

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS':
        return <CheckCircle className="w-3.5 h-3.5 text-[#00FF41]" />;
      case 'BLOCK':
        return <XCircle className="w-3.5 h-3.5 text-[#FF3D00]" />;
      case 'REVIEW':
        return <AlertTriangle className="w-3.5 h-3.5 text-[#FFA000]" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-[#888]" />;
    }
  };

  return (
    <div className="space-y-2">
      {/* 10-Step Timeline Rail */}
      <div className="relative border-l border-[#222] ml-3.5 my-2 space-y-3">
        {steps.map((step, idx) => {
          const isReplayingActive = replayingIndex !== null && idx <= replayingIndex;
          const isCurrentActive = replayingIndex !== null && idx === replayingIndex;
          const isExpanded = expandedStepId === step.id;

          const isPass = step.status === 'PASS';
          const isBlock = step.status === 'BLOCK';
          const isReview = step.status === 'REVIEW';

          return (
            <div 
              key={step.id} 
              className={`relative pl-6 transition-all duration-300 ${
                isCurrentActive ? 'scale-[1.01]' : ''
              }`}
            >
              {/* Timeline Bullet Node */}
              <div 
                className={`absolute -left-[9px] top-1.5 w-4 h-4 border flex items-center justify-center transition-all ${
                  isBlock
                    ? 'bg-[#FF3D00] border-[#FF3D00] text-black ring-4 ring-[#FF3D00]/20'
                    : isReview
                    ? 'bg-[#FFA000] border-[#FFA000] text-black ring-4 ring-[#FFA000]/20'
                    : isPass
                    ? 'bg-[#00FF41] border-[#00FF41] text-black'
                    : 'bg-[#111] border-[#444] text-[#888]'
                }`}
              >
                <span className="text-[8px] font-black mono">{step.stepNumber}</span>
              </div>

              {/* Step Card */}
              <div
                onClick={() => {
                  toggleExpand(step.id);
                  onStepClick?.(step);
                }}
                className={`p-2.5 border transition cursor-pointer ${
                  isBlock 
                    ? 'bg-[#1E0E0C] border-[#FF3D00]/60 text-white shadow-sm'
                    : isReview
                    ? 'bg-[#1E190C] border-[#FFA000]/60 text-white'
                    : isExpanded
                    ? 'bg-[#181818] border-[#444] text-white'
                    : 'bg-[#0E0E0E] border-[#222] hover:border-[#333] text-[#CCC]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[10px] mono font-bold text-[#888]">{`STEP 0${step.stepNumber}:`}</span>
                    <span className="text-xs mono font-bold truncate text-white">{step.name}</span>
                    <span className={`text-[9px] mono px-1.5 py-0.2 border ${
                      isBlock 
                        ? 'bg-[#FF3D00]/10 border-[#FF3D00] text-[#FF3D00]' 
                        : isReview 
                        ? 'bg-[#FFA000]/10 border-[#FFA000] text-[#FFA000]' 
                        : 'bg-[#00FF41]/10 border-[#00FF41]/40 text-[#00FF41]'
                    }`}>
                      [{step.status}]
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] mono text-[#888] shrink-0">
                    <span>{step.latencyMs}ms</span>
                    <span>{step.timestamp}</span>
                    {interactive && (
                      isExpanded ? <ChevronUp className="w-3 h-3 text-[#AAA]" /> : <ChevronDown className="w-3 h-3 text-[#AAA]" />
                    )}
                  </div>
                </div>

                {/* Subtitle / Action summary */}
                <p className="text-[11px] mono text-[#AAA] mt-1 leading-normal">
                  {step.title}
                </p>

                {/* Expandable Technical Trace Details */}
                {isExpanded && (
                  <div className="mt-2.5 pt-2.5 border-t border-[#222] text-[10px] mono space-y-1.5 bg-[#0A0A0A] p-2">
                    {step.ruleEvaluated && (
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[#888] shrink-0">RULE / AST:</span>
                        <span className="text-[#00FF41] text-right font-bold">{step.ruleEvaluated}</span>
                      </div>
                    )}
                    {step.input && (
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[#888] shrink-0">INPUT CONTEXT:</span>
                        <span className="text-[#DDD] text-right truncate max-w-xs">{step.input}</span>
                      </div>
                    )}
                    {step.output && (
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[#888] shrink-0">OUTPUT / DECISION:</span>
                        <span className={`text-right font-bold ${isBlock ? 'text-[#FF3D00]' : 'text-white'}`}>{step.output}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
