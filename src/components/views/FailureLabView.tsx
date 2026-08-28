import React, { useState } from 'react';
import { useGuardrail } from '../../context/GuardrailContext';
import { FAILURE_SCENARIOS } from '../../data/mockData';
import { FailureScenario } from '../../types';
import { IncidentSummaryModal } from '../modals/IncidentSummaryModal';
import { Flame, Play, CheckCircle, AlertTriangle, ShieldCheck, Cpu, RotateCcw, Activity, Lock, RefreshCw, FileText, TrendingDown } from 'lucide-react';

type FaultState = 'IDLE' | 'FAULT_INJECTED' | 'DETECTED' | 'CONTAINED' | 'RECOVERING' | 'VERIFIED';

interface TimelineTrace {
  timeLabel: string;
  action: string;
  state: 'NORMAL' | 'FAULT' | 'CONTAINED' | 'RECOVERED' | 'VERIFIED';
}

export const FailureLabView: React.FC = () => {
  const { addToast } = useGuardrail();
  const [selectedScenario, setSelectedScenario] = useState<FailureScenario>(FAILURE_SCENARIOS[0]);
  const [faultState, setFaultState] = useState<FaultState>('IDLE');
  const [timelineTraces, setTimelineTraces] = useState<TimelineTrace[]>([]);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);

  const runFaultSimulation = (sc: FailureScenario) => {
    setSelectedScenario(sc);
    setFaultState('FAULT_INJECTED');
    setTimelineTraces([
      { timeLabel: 'T+00ms', action: `Payment request initiated by autonomous agent (${sc.title})`, state: 'NORMAL' },
      { timeLabel: 'T+1000ms', action: `CHAOS INJECTION: ${sc.faultType} detected on payment rails`, state: 'FAULT' }
    ]);

    setTimeout(() => {
      setFaultState('DETECTED');
      setTimelineTraces(prev => [
        ...prev, 
        { timeLabel: 'T+1100ms', action: 'Perimeter alert tripped: Transaction frozen. Token execution suspended.', state: 'FAULT' }
      ]);
    }, 700);

    setTimeout(() => {
      setFaultState('CONTAINED');
      setTimelineTraces(prev => [
        ...prev, 
        { timeLabel: 'T+1200ms', action: 'Containment active: Atomic idempotency lock engaged. Zero downstream leakage.', state: 'CONTAINED' },
        { timeLabel: 'T+1300ms', action: 'Idempotency ledger checked: Duplicate retry prevention confirmed.', state: 'CONTAINED' }
      ]);
    }, 1400);

    setTimeout(() => {
      setFaultState('RECOVERING');
      setTimelineTraces(prev => [
        ...prev, 
        { timeLabel: 'T+1600ms', action: `Executing deterministic recovery: ${sc.recoveryAction}`, state: 'RECOVERED' }
      ]);
    }, 2100);

    setTimeout(() => {
      setFaultState('VERIFIED');
      setTimelineTraces(prev => [
        ...prev, 
        { timeLabel: 'T+1700ms', action: `Verification completed: ${sc.verificationProof}`, state: 'VERIFIED' },
        { timeLabel: 'T+1750ms', action: 'Cryptographic audit proof written to Merkle ledger #84912 [SHA-256 MATCH]', state: 'VERIFIED' }
      ]);

      addToast({
        title: 'Chaos Test Completed & Verified',
        message: `${sc.title} recovered safely with zero leakage.`,
        type: 'success'
      });
    }, 2800);
  };

  const resetSimulation = () => {
    setFaultState('IDLE');
    setTimelineTraces([]);
  };

  const states: { key: FaultState; label: string }[] = [
    { key: 'FAULT_INJECTED', label: '1. FAULT' },
    { key: 'DETECTED', label: '2. DETECTED' },
    { key: 'CONTAINED', label: '3. CONTAINED' },
    { key: 'RECOVERING', label: '4. RECOVERING' },
    { key: 'VERIFIED', label: '5. VERIFIED' }
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Incident Post-Mortem Modal */}
      <IncidentSummaryModal
        isOpen={isIncidentModalOpen}
        onClose={() => setIsIncidentModalOpen(false)}
        onRunFailureLab={() => runFaultSimulation(FAILURE_SCENARIOS[0])}
      />

      {/* Top Header */}
      <div className="p-4 bg-[#0E0E0E] border border-[#222] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#FF3D00]" />
            <h1 className="text-base font-bold mono text-white tracking-wider">FAILURE LAB & CHAOS RESILIENCE</h1>
            <span className="text-[10px] mono px-2 py-0.5 bg-[#1A1A1A] border border-[#333] text-[#FF3D00]">
              RESILIENCE VERIFICATION
            </span>
          </div>
          <p className="text-xs mono text-[#888] mt-1">
            Simulate payment gateway timeouts, duplicate webhook race conditions, and rogue AI spend breaches to verify automated containment.
          </p>
        </div>

        <button
          onClick={() => setIsIncidentModalOpen(true)}
          className="px-3 py-1.5 bg-[#141414] border border-[#333] hover:border-[#FF3D00] text-xs mono text-white flex items-center gap-1.5 transition self-start md:self-auto"
        >
          <FileText className="w-3.5 h-3.5 text-[#FF3D00]" />
          <span>VIEW INCIDENT #INC-0042</span>
        </button>
      </div>

      {/* Interactive 5-Step State Machine Pipeline */}
      <div className="p-5 bg-[#0E0E0E] border border-[#222] space-y-4 mono text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#00FF41]" />
            AUTOMATED CONTAINMENT LIFECYCLE (5-STAGE STATE MACHINE)
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#888]">STATUS:</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 border ${
              faultState === 'VERIFIED' 
                ? 'bg-[#00FF41]/10 border-[#00FF41] text-[#00FF41]'
                : faultState !== 'IDLE' 
                ? 'bg-[#FF3D00]/10 border-[#FF3D00] text-[#FF3D00]'
                : 'bg-[#141414] border-[#333] text-[#888]'
            }`}>
              [{faultState}]
            </span>
          </div>
        </div>

        {/* State Pipeline Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {states.map((st, idx) => {
            const isActive = faultState === st.key;
            const isPassed = 
              (faultState === 'DETECTED' && idx === 0) ||
              (faultState === 'CONTAINED' && idx <= 1) ||
              (faultState === 'RECOVERING' && idx <= 2) ||
              (faultState === 'VERIFIED' && idx <= 4);

            return (
              <div 
                key={st.key}
                className={`p-3 border text-center transition-all duration-300 select-none ${
                  isActive
                    ? 'bg-[#FF3D00] border-[#FF3D00] text-black font-black scale-[1.02] shadow-lg'
                    : isPassed
                    ? 'bg-[#00FF41]/20 border-[#00FF41] text-[#00FF41]'
                    : 'bg-[#111] border-[#222] text-[#666]'
                }`}
              >
                <div className="text-[11px] font-bold">{st.label}</div>
              </div>
            );
          })}
        </div>

        {/* Post-Recovery Verified Impact Metrics */}
        {faultState === 'VERIFIED' && (
          <div className="p-3.5 bg-[#0E1A11] border border-[#00FF41]/40 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in fade-in duration-200">
            <div>
              <span className="text-[9px] text-[#888] block">LOSS PREVENTED:</span>
              <span className="text-[#00FF41] font-bold text-sm">₹3,20,000</span>
            </div>
            <div>
              <span className="text-[9px] text-[#888] block">DUPLICATE PAYMENTS:</span>
              <span className="text-white font-bold text-sm">0 (ZERO)</span>
            </div>
            <div>
              <span className="text-[9px] text-[#888] block">UNSAFE RETRY:</span>
              <span className="text-[#00FF41] font-bold text-sm">BLOCKED</span>
            </div>
            <div>
              <span className="text-[9px] text-[#888] block">AUDIT INTEGRITY:</span>
              <span className="text-[#00FF41] font-bold text-sm">VERIFIED (SHA-256)</span>
            </div>
          </div>
        )}
      </div>

      {/* Fault Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mono text-xs">
        {FAILURE_SCENARIOS.map((sc) => {
          const isSelected = selectedScenario.id === sc.id;
          return (
            <div
              key={sc.id}
              className={`p-4 bg-[#0E0E0E] border transition flex flex-col justify-between space-y-3 ${
                isSelected ? 'border-[#FF3D00] shadow-md' : 'border-[#222] hover:border-[#333]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-sm">{sc.title}</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-[#FF3D00]/10 border border-[#FF3D00] text-[#FF3D00] font-bold">
                    {sc.faultType}
                  </span>
                </div>
                <p className="text-[11px] text-[#888] leading-relaxed mt-1">{sc.description}</p>
              </div>

              <div className="p-2.5 bg-[#0A0A0A] border border-[#1A1A1A] text-[10px] space-y-1 text-[#AAA]">
                <div><span className="text-[#888]">EXPECTED RESPONSE: </span>{sc.expectedBehavior}</div>
                <div><span className="text-[#00FF41]">SAFE OUTCOME: </span>{sc.recoveryAction}</div>
              </div>

              <div className="pt-2 border-t border-[#1A1A1A] flex items-center justify-between">
                <span className="text-[10px] text-[#666]">{sc.verificationProof}</span>
                <button
                  onClick={() => runFaultSimulation(sc)}
                  disabled={faultState !== 'IDLE' && faultState !== 'VERIFIED'}
                  className="px-4 py-1.5 bg-[#1A1A1A] border border-[#FF3D00] text-[#FF3D00] hover:bg-[#FF3D00] hover:text-black transition font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>INJECT FAULT</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-Time Millisecond Lifecycle Timeline */}
      {timelineTraces.length > 0 && (
        <div className="p-4 bg-[#0E0E0E] border border-[#222] space-y-2 mono text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-[#222]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#00FF41]" />
              <span className="font-bold text-white">MILLISECOND CONTAINMENT & RECOVERY TRACE</span>
            </div>
            <button
              onClick={resetSimulation}
              className="text-[#888] hover:text-white text-[10px]"
            >
              RESET
            </button>
          </div>
          
          <div className="p-3 bg-[#0A0A0A] border border-[#1A1A1A] space-y-2 max-h-56 overflow-y-auto">
            {timelineTraces.map((tr, i) => (
              <div key={i} className="flex items-start gap-3 text-[11px] leading-relaxed">
                <span className="text-[#888] font-bold shrink-0">{tr.timeLabel}</span>
                <span className={`font-mono ${
                  tr.state === 'FAULT' 
                    ? 'text-[#FF3D00]' 
                    : tr.state === 'CONTAINED' 
                    ? 'text-[#FFA000]' 
                    : tr.state === 'RECOVERED' || tr.state === 'VERIFIED'
                    ? 'text-[#00FF41]'
                    : 'text-[#CCC]'
                }`}>
                  {tr.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
