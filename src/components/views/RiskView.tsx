import React, { useState } from 'react';
import { useGuardrail } from '../../context/GuardrailContext';
import { Activity, ShieldAlert, AlertTriangle, CheckCircle, TrendingUp, Cpu, Gauge, HelpCircle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';
import { RiskComponent } from '../../types';

export const RiskView: React.FC = () => {
  const { transactions, setSelectedTransaction, setIsTransactionDrawerOpen, riskData, isLiveLoading } = useGuardrail();
  const [showWhyModal, setShowWhyModal] = useState<boolean>(false);
  const [expandedSignalIndex, setExpandedSignalIndex] = useState<number | null>(null);

  const threshold = 0.70;
  
  // Use live risk intelligence data
  const displayScore = riskData?.averageScore ?? 0;
  const headroom = (threshold - displayScore).toFixed(2);
  const riskComponents = riskData?.components ?? [];
  const compositeScore = displayScore.toFixed(2);

  if (isLiveLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-[#00FF41] mono animate-pulse">
        [INITIALIZING RISK VECTORS...]
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="p-4 bg-[#0E0E0E] border border-[#222] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#00FF41]" />
            <h1 className="text-base font-bold mono text-white tracking-wider">MULTI-DIMENSIONAL RISK ENGINE</h1>
            <span className="text-[10px] mono px-2 py-0.5 bg-[#1A1A1A] border border-[#00FF41] text-[#00FF41]">
              RISK SCORE {compositeScore} {displayScore > 0.5 ? 'HIGH' : displayScore > 0.2 ? 'MEDIUM' : 'LOW'}
            </span>
          </div>
          <p className="text-xs mono text-[#888] mt-1">
            Continuous multi-factor vector analysis combining velocity, semantic intent drift, amount anomaly, and payment ledger security.
          </p>
        </div>

        <div className="flex items-center gap-2 mono text-xs">
          <button
            onClick={() => setShowWhyModal(!showWhyModal)}
            className="px-3 py-1.5 bg-[#1A1A1A] border border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41] hover:text-black font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>[WHY THIS SCORE?]</span>
          </button>
        </div>
      </div>

      {/* Primary Score & Headroom Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mono text-xs">
        <div className="p-4 bg-[#0E0E0E] border border-[#222] space-y-1">
          <span className="text-[10px] text-[#888] block uppercase">COMPOSITE RISK SCORE</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#00FF41]">{compositeScore}</span>
            <span className="text-xs px-2 py-0.5 bg-[#00FF41]/10 border border-[#00FF41] text-[#00FF41] font-bold">LOW</span>
          </div>
          <span className="text-[10px] text-[#666] block">Autonomous permit range: &lt; 0.20</span>
        </div>

        <div className="p-4 bg-[#0E0E0E] border border-[#222] space-y-1">
          <span className="text-[10px] text-[#888] block uppercase">ENFORCEMENT THRESHOLD</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">0.70</span>
            <span className="text-xs px-2 py-0.5 bg-[#1A1A1A] border border-[#333] text-[#AAA] font-bold">CEILING</span>
          </div>
          <span className="text-[10px] text-[#666] block">Triggers immediate deterministic block</span>
        </div>

        <div className="p-4 bg-[#0E0E0E] border border-[#222] space-y-1">
          <span className="text-[10px] text-[#888] block uppercase">SAFETY HEADROOM</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#00FF41]">{headroom}</span>
            <span className="text-xs px-2 py-0.5 bg-[#00FF41]/10 border border-[#00FF41] text-[#00FF41] font-bold">
              {Number(headroom) > 0.4 ? 'NOMINAL' : Number(headroom) > 0.2 ? 'MODERATE' : 'CRITICAL'}
            </span>
          </div>
          <span className="text-[10px] text-[#666] block">{(Number(headroom) * 100).toFixed(0)}% buffer before supervisor escalation</span>
        </div>
      </div>

      {/* Dynamic Gauge Component */}
      <div className="p-5 bg-[#0E0E0E] border border-[#222] space-y-4 mono text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white flex items-center gap-2">
            <Gauge className="w-4 h-4 text-[#00FF41]" />
            REAL-TIME RISK TRAJECTORY GAUGE
          </span>
          <span className="text-[10px] text-[#888]">
            CURRENT EVALUATION: {compositeScore} ({displayScore > 0.5 ? 'HIGH' : displayScore > 0.2 ? 'MEDIUM' : 'LOW'}) | THRESHOLD: {threshold.toFixed(2)}
          </span>
        </div>

        <div className="relative pt-6 pb-2">
          {/* Active Score Pointer */}
          <div 
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500 z-10"
            style={{ left: `${displayScore * 100}%` }}
          >
            <span className="text-[10px] bg-[#00FF41] text-black font-black px-1.5 py-0.2 mb-0.5">
              {compositeScore} {displayScore > 0.5 ? 'HIGH' : displayScore > 0.2 ? 'MEDIUM' : 'LOW'}
            </span>
            <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-[#00FF41]" />
          </div>

          {/* Bar Background Gradient */}
          <div className="h-4 w-full bg-gradient-to-r from-[#00FF41] via-[#FFA000] to-[#FF3D00] border border-[#333] relative">
            <div className="absolute inset-0 flex justify-between px-2 text-[8px] text-black font-black opacity-80 pointer-events-none items-center">
              <span>0.00 LOW</span>
              <span>0.25 NOMINAL</span>
              <span>0.50 REVIEW</span>
              <span>0.70 THRESHOLD</span>
              <span>1.00 CRITICAL</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between text-[10px] text-[#888]">
          <span>&lt; 0.20: AUTONOMOUS PERMIT</span>
          <span>0.20 - 0.70: SUPERVISOR ESCALATION</span>
          <span>&gt; 0.70: INSTANT HARD BLOCK</span>
        </div>
      </div>

      {/* Component Breakdown Card: Item 10 */}
      <div className="p-4 bg-[#0E0E0E] border border-[#222] space-y-3 mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#222]">
          <span className="font-bold text-white">RISK COMPONENT DECOMPOSITION</span>
          <span className="text-[#00FF41]">[5 SUB-SIGNALS]</span>
        </div>

        <div className="space-y-2">
          {riskComponents.map((comp: RiskComponent, idx: number) => (
            <div 
              key={idx}
              className="p-3 bg-[#0A0A0A] border border-[#222] hover:border-[#333] transition"
            >
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedSignalIndex(expandedSignalIndex === idx ? null : idx)}
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-[#00FF41]" />
                  <span className="font-bold text-white">{comp.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-[#111] border border-[#333] text-[#AAA]">
                    [{comp.status}]
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-white font-bold">{comp.score.toFixed(2)}</span>
                  <span className="text-[#666] text-[10px]">(Max: {comp.max.toFixed(2)})</span>
                  {expandedSignalIndex === idx ? <ChevronUp className="w-3.5 h-3.5 text-[#888]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#888]" />}
                </div>
              </div>

              {expandedSignalIndex === idx && (
                <div className="mt-2.5 pt-2.5 border-t border-[#1A1A1A] text-[11px] text-[#CCC] leading-relaxed">
                  {comp.details}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* "WHY THIS SCORE?" Modal / Expanded Breakdown */}
      {showWhyModal && (
        <div className="p-4 bg-[#0E1A11] border border-[#00FF41] space-y-3 mono text-xs animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-[#00FF41]/30 pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00FF41]" />
              <span className="font-bold text-white text-sm">WHY IS THIS SCORE {compositeScore} ({displayScore > 0.5 ? 'HIGH' : displayScore > 0.2 ? 'MEDIUM' : 'LOW'})?</span>
            </div>
            <button
              onClick={() => setShowWhyModal(false)}
              className="text-[#00FF41] hover:underline"
            >
              [CLOSE EXPLANATION]
            </button>
          </div>

          <p className="text-[#CCC] leading-relaxed">
            The Guardrail Risk Engine calculates a weighted composite vector across five deterministic telemetry sources:
          </p>

          <ul className="space-y-1.5 text-[11px] text-[#AAA] list-disc list-inside">
            {riskComponents.map((comp: RiskComponent, idx: number) => (
              <li key={idx}>
                <strong className="text-white">{comp.name} ({comp.score.toFixed(2)}):</strong> {comp.details}
              </li>
            ))}
          </ul>

          <div className="p-2.5 bg-[#0A0A0A] border border-[#00FF41]/40 flex items-center justify-between text-[11px]">
            <span className="text-[#00FF41] font-bold">TOTAL SCORE: {compositeScore}</span>
            <span className="text-[#888]">THRESHOLD: {threshold.toFixed(2)} | HEADROOM: {headroom} (SAFE)</span>
          </div>
        </div>
      )}

      {/* Evaluated Transaction Risk Stream */}
      <div className="p-4 bg-[#0E0E0E] border border-[#222] space-y-3 mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#222]">
          <span className="font-bold text-white">RECENT RISK ASSESSMENTS</span>
          <span className="text-[#888]">CLICK TO INSPECT DECISION</span>
        </div>

        <div className="space-y-2">
          {transactions.map((tx) => (
            <div 
              key={tx.id}
              onClick={() => {
                setSelectedTransaction(tx);
                setIsTransactionDrawerOpen(true);
              }}
              className="p-2.5 bg-[#0A0A0A] border border-[#222] hover:border-[#00FF41] cursor-pointer flex items-center justify-between transition"
            >
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 ${tx.riskScore > 0.2 ? 'bg-[#FF3D00]' : 'bg-[#00FF41]'}`} />
                <span className="text-white font-bold">{tx.id}</span>
                <span className="text-[#888]">{tx.actor}</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-[#AAA]">₹{tx.amount.toLocaleString('en-IN')}</span>
                <span className={`font-bold ${tx.riskScore > 0.2 ? 'text-[#FF3D00]' : 'text-[#00FF41]'}`}>
                  Score: {tx.riskScore.toFixed(2)} [{tx.riskLevel}]
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

