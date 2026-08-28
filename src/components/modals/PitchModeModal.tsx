import React, { useState, useEffect } from 'react';
import { useGuardrail } from '../../context/GuardrailContext';
import { Play, Pause, ChevronRight, ChevronLeft, X, ShieldCheck, CheckCircle, Terminal, TrendingUp, AlertTriangle } from 'lucide-react';

export const PitchModeModal: React.FC = () => {
  const { 
    isPitchModeOpen, 
    setIsPitchModeOpen, 
    setCurrentNav, 
    triggerScenario 
  } = useGuardrail();

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    {
      title: 'THE PROBLEM: AI AGENTS ARE TOUCHING MONEY UNBOUND',
      subtitle: 'LLMs hallucinate discounts, breach margin floors, and create financial liability.',
      content: 'As enterprises deploy autonomous AI agents for procurement, pricing negotiation, and customer care, agents directly interface with payment gateways like Razorpay. Without a deterministic control plane, single prompt injections can leak millions in unauthorized spend.',
      actionLabel: 'INSPECT AGENT BOUNDARIES',
      onAction: () => setCurrentNav('AGENTS')
    },
    {
      title: 'GUARDRAIL CORE: THE DETERMINISTIC FINANCIAL BOUNDARY',
      subtitle: 'Control the agent. Not the autonomy.',
      content: 'Guardrail acts as the non-bypassable intermediary between AI agent runtimes and payment rails. Every action passes through a 10-step lifecycle: Intent Parsing → Normalization → Authority Check → Margin Floor Policy → Risk Matrix → Autonomous Token Routing → Razorpay Execution → Reconciled Settlement.',
      actionLabel: 'VIEW 10-STEP LIFECYCLE',
      onAction: () => {
        triggerScenario('SCENARIO_1_SUCCESS');
        setCurrentNav('TRANSACTIONS');
      }
    },
    {
      title: 'SAFETY HALT: BLOCKING 25% DISCOUNT WITH 0% MARGIN SLIP',
      subtitle: 'Mathematical margin protection in 1.24ms.',
      content: 'When Autonomous Negotiator #04 attempts a 25% discount that drops net margin to 8.4% (below the merchant mandatory 15.0% floor), Guardrail halts token dispatch at Step 4, saving ₹14,200 in margin dilution.',
      actionLabel: 'SIMULATE MARGIN BLOCK',
      onAction: () => {
        triggerScenario('SCENARIO_2_DISCOUNT_BLOCK');
        setCurrentNav('TRANSACTIONS');
      }
    },
    {
      title: 'HUMAN SUPERVISOR: AUTONOMY FIRST, HUMAN WHEN REQUIRED',
      subtitle: '99.2% autonomous execution with smart escalation.',
      content: 'For edge cases exceeding autonomous authority—such as a ₹14,500 refund request above the ₹5,000 auto limit—Guardrail routes to the Supervisor Queue with complete risk scoring and recommendations for one-click human authorization.',
      actionLabel: 'OPEN SUPERVISOR QUEUE',
      onAction: () => {
        triggerScenario('SCENARIO_3_APPROVAL_REQUIRED');
        setCurrentNav('APPROVALS');
      }
    },
    {
      title: 'FAILURE RESILIENCE: 100% IDEMPOTENCY & GATEWAY RECOVERY',
      subtitle: 'Zero duplicate debits across distributed race conditions.',
      content: 'Guardrail ledger uses SHA-256 deduplication to catch duplicate webhooks and recovers from payment gateway timeouts with exponential backoff and cryptographic attestation.',
      actionLabel: 'OPEN FAILURE LAB',
      onAction: () => setCurrentNav('FAILURE_LAB')
    },
    {
      title: 'BUSINESS IMPACT: UNLOCKING SAFE AUTONOMOUS REVENUE',
      subtitle: '+24.6% revenue uplift and ₹8.45M protected margin.',
      content: 'Guardrail does not just block risk—it enables safe, aggressive autonomous commerce. Merchants capture 24.6% higher volume while guaranteeing zero margin floor violations.',
      actionLabel: 'VIEW REVENUE MATRIX',
      onAction: () => setCurrentNav('REVENUE')
    }
  ];

  useEffect(() => {
    let timer: any;
    if (isPlaying && isPitchModeOpen) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 10000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, isPitchModeOpen]);

  if (!isPitchModeOpen) return null;

  const current = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#0E0E0E] border border-[#00FF41] shadow-2xl p-6 mono text-xs space-y-5 animate-in zoom-in-95">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#222] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#FF3D00]" />
            <span className="font-bold text-sm text-white tracking-widest">GUARDRAIL PITCH WALKTHROUGH</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-[#1A1A1A] border border-[#333] text-[#00FF41]">
              STEP {currentStep + 1} OF {steps.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-2.5 py-1 bg-[#1A1A1A] border border-[#333] hover:border-[#00FF41] text-[#00FF41] text-[10px] flex items-center gap-1 transition"
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isPlaying ? 'PAUSE' : 'AUTO-PLAY'}</span>
            </button>
            <button
              onClick={() => setIsPitchModeOpen(false)}
              className="text-[#888] hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-3 min-h-[160px]">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white tracking-wide">{current.title}</h2>
            <div className="text-[#00FF41] font-bold text-xs">{current.subtitle}</div>
          </div>

          <p className="text-[#CCC] text-xs leading-relaxed">
            {current.content}
          </p>
        </div>

        {/* Action Trigger Button */}
        <div className="p-3 bg-[#141414] border border-[#222] flex items-center justify-between">
          <span className="text-[#888] text-[11px]">LIVE INTERACTIVE DEMONSTRATION:</span>
          <button
            onClick={() => {
              current.onAction();
              setIsPitchModeOpen(false);
            }}
            className="px-3 py-1.5 bg-[#00FF41] text-black font-bold hover:bg-[#00E53A] transition text-xs flex items-center gap-1.5"
          >
            <span>{current.actionLabel}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Navigation & Progress Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-[#222]">
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="px-3 py-1 bg-[#1A1A1A] border border-[#333] text-[#AAA] hover:text-white disabled:opacity-30 transition flex items-center gap-1"
          >
            <ChevronLeft className="w-3 h-3" />
            <span>PREV</span>
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <div 
                key={i} 
                onClick={() => setCurrentStep(i)}
                className={`w-2 h-2 cursor-pointer transition ${
                  i === currentStep ? 'bg-[#00FF41]' : 'bg-[#333] hover:bg-[#555]'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              if (currentStep < steps.length - 1) {
                setCurrentStep(prev => prev + 1);
              } else {
                setIsPitchModeOpen(false);
              }
            }}
            className="px-3 py-1 bg-[#1A1A1A] border border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41] hover:text-black transition flex items-center gap-1"
          >
            <span>{currentStep === steps.length - 1 ? 'FINISH' : 'NEXT'}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
};
