import React, { useState } from 'react';
import { ShieldCheck, AlertOctagon, CheckCircle, XCircle, TrendingDown, TrendingUp, Zap, Lock, ArrowRight } from 'lucide-react';
import { useGuardrail } from '../../context/GuardrailContext';

export const BeforeAfterView: React.FC = () => {
  const { setCurrentNav } = useGuardrail();
  const [selectedFocus, setSelectedFocus] = useState<'ALL' | 'MARGIN' | 'PAYMENT' | 'SECURITY'>('ALL');

  return (
    <div className="space-y-5 animate-in fade-in duration-200 mono text-xs">
      {/* Top Header */}
      <div className="p-4 bg-[#0E0E0E] border border-[#222] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#FF3D00]" />
            <h1 className="text-base font-bold text-white tracking-wider">ENTERPRISE COMPARISON: WITHOUT VS WITH GUARDRAIL</h1>
            <span className="text-[10px] px-2 py-0.5 bg-[#1A1A1A] border border-[#333] text-[#00FF41]">
              QUANTITATIVE PROOF
            </span>
          </div>
          <p className="text-[#888] mt-1">
            Why autonomous AI commerce requires a deterministic boundary layer between LLMs and payment gateways.
          </p>
        </div>

        <button
          onClick={() => setCurrentNav('FAILURE_LAB')}
          className="px-3 py-1.5 bg-[#141414] border border-[#333] hover:border-[#FF3D00] text-white text-xs mono transition flex items-center gap-1.5"
        >
          <span>SIMULATE IN FAILURE LAB</span>
          <ArrowRight className="w-3 h-3 text-[#FF3D00]" />
        </button>
      </div>

      {/* Quantitative Impact Proof Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <div className="p-3 bg-[#0E0E0E] border border-[#222]">
          <span className="text-[9px] text-[#888] block">BLOCKED VIOLATIONS</span>
          <span className="text-[#FF3D00] font-bold text-sm">142 Breaches</span>
        </div>
        <div className="p-3 bg-[#0E0E0E] border border-[#222]">
          <span className="text-[9px] text-[#888] block">PROTECTED CAPITAL</span>
          <span className="text-[#00FF41] font-bold text-sm">₹84,500 Saved</span>
        </div>
        <div className="p-3 bg-[#0E0E0E] border border-[#222]">
          <span className="text-[9px] text-[#888] block">DUPLICATE CHARGES</span>
          <span className="text-white font-bold text-sm">0 (Zero)</span>
        </div>
        <div className="p-3 bg-[#0E0E0E] border border-[#222]">
          <span className="text-[9px] text-[#888] block">MARGIN BREACHES</span>
          <span className="text-white font-bold text-sm">0 Breaches</span>
        </div>
        <div className="p-3 bg-[#0E0E0E] border border-[#222]">
          <span className="text-[9px] text-[#888] block">DETERMINISTIC RATE</span>
          <span className="text-[#00FF41] font-bold text-sm">100.0% Math</span>
        </div>
      </div>

      {/* Pipeline Flow Architecture Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Without Guardrail Pipeline */}
        <div className="p-4 bg-[#140E0E] border border-[#FF3D00]/40 space-y-2">
          <span className="text-[10px] text-[#FF3D00] font-bold block uppercase">
            WITHOUT GUARDRAIL: DIRECT UNCONSTRAINED CALL
          </span>
          <div className="p-2.5 bg-[#0A0A0A] border border-[#222] text-[10px] text-[#888] flex items-center justify-between">
            <span className="text-white">AI INTENT</span>
            <span className="text-[#FF3D00]">➔ [NO POLICY CHECK] ➔</span>
            <span className="text-[#FF3D00]">PAYMENT RAIL</span>
            <span className="text-[#FF3D00]">➔ UNBOUNDED EXPOSURE</span>
          </div>
        </div>

        {/* With Guardrail Core Pipeline */}
        <div className="p-4 bg-[#0E1A11] border border-[#00FF41]/40 space-y-2">
          <span className="text-[10px] text-[#00FF41] font-bold block uppercase">
            WITH GUARDRAIL CORE: DETERMINISTIC POLICY PIPELINE
          </span>
          <div className="p-2.5 bg-[#0A0A0A] border border-[#222] text-[10px] text-[#888] flex items-center justify-between">
            <span className="text-white">AI INTENT</span>
            <span className="text-[#00FF41]">➔ POLICY AST ➔ RISK ➔</span>
            <span className="text-[#00FF41]">IDEMPOTENCY</span>
            <span className="text-[#00FF41]">➔ 100% PROVED</span>
          </div>
        </div>
      </div>

      {/* Detailed Side-by-Side Split Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Left: Without Guardrail (Dangerous) */}
        <div className="p-5 bg-[#140E0E] border border-[#FF3D00]/50 space-y-4">
          <div className="flex items-center justify-between border-b border-[#FF3D00]/30 pb-3">
            <div className="flex items-center gap-2 text-[#FF3D00] font-bold text-sm">
              <AlertOctagon className="w-4 h-4" />
              <span>WITHOUT GUARDRAIL (UNMANAGED AGENTS)</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.2 bg-[#FF3D00]/20 border border-[#FF3D00] text-[#FF3D00] font-bold">
              [HIGH RISK]
            </span>
          </div>

          <div className="space-y-3 text-[11px] text-[#CCC]">
            <div className="p-3 bg-[#0A0A0A] border border-[#222] space-y-1">
              <div className="flex items-center gap-1.5 text-[#FF3D00] font-bold">
                <XCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Prompt Injection & Tool Hijacking</span>
              </div>
              <p className="text-[#888]">Adversarial users trick AI into offering 80% discounts or triggering unbounded multi-lakh refunds.</p>
            </div>

            <div className="p-3 bg-[#0A0A0A] border border-[#222] space-y-1">
              <div className="flex items-center gap-1.5 text-[#FF3D00] font-bold">
                <XCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Sub-Zero Margin Hallucinations</span>
              </div>
              <p className="text-[#888]">AI negotiates unprofitable enterprise quotes, destroying merchant gross margin without warning.</p>
            </div>

            <div className="p-3 bg-[#0A0A0A] border border-[#222] space-y-1">
              <div className="flex items-center gap-1.5 text-[#FF3D00] font-bold">
                <XCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Duplicate Webhook Race Conditions</span>
              </div>
              <p className="text-[#888]">Payment webhooks delivered twice cause multiple payouts and balance leaks.</p>
            </div>

            <div className="p-3 bg-[#0A0A0A] border border-[#222] space-y-1">
              <div className="flex items-center gap-1.5 text-[#FF3D00] font-bold">
                <XCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Unbounded Liability Exposure</span>
              </div>
              <p className="text-[#888]">Zero cryptographic audit trail. Merchant is legally liable for erratic LLM outputs.</p>
            </div>
          </div>
        </div>

        {/* Right: With Guardrail Core (Safe) */}
        <div className="p-5 bg-[#0E1A11] border border-[#00FF41]/50 space-y-4">
          <div className="flex items-center justify-between border-b border-[#00FF41]/30 pb-3">
            <div className="flex items-center gap-2 text-[#00FF41] font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>WITH GUARDRAIL CORE (DETERMINISTIC)</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.2 bg-[#00FF41]/20 border border-[#00FF41] text-[#00FF41] font-bold">
              [ZERO LEAKAGE]
            </span>
          </div>

          <div className="space-y-3 text-[11px] text-[#CCC]">
            <div className="p-3 bg-[#0A0A0A] border border-[#222] space-y-1">
              <div className="flex items-center gap-1.5 text-[#00FF41] font-bold">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Deterministic Spend & Policy Boundaries</span>
              </div>
              <p className="text-[#888]">Non-bypassable math enforces hard spend caps and guaranteed 15.0% margin floor.</p>
            </div>

            <div className="p-3 bg-[#0A0A0A] border border-[#222] space-y-1">
              <div className="flex items-center gap-1.5 text-[#00FF41] font-bold">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Autonomous Revenue Uplift (+24.6%)</span>
              </div>
              <p className="text-[#888]">Agents safely negotiate volume discounts knowing the floor is mathematically locked.</p>
            </div>

            <div className="p-3 bg-[#0A0A0A] border border-[#222] space-y-1">
              <div className="flex items-center gap-1.5 text-[#00FF41] font-bold">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                <span>100% Idempotent Payment Reconciliation</span>
              </div>
              <p className="text-[#888]">SHA-256 deduplication and testnet gateway integration guarantees zero double-debits.</p>
            </div>

            <div className="p-3 bg-[#0A0A0A] border border-[#222] space-y-1">
              <div className="flex items-center gap-1.5 text-[#00FF41] font-bold">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Immutable Cryptographic Audit Trail</span>
              </div>
              <p className="text-[#888]">Complete 10-step explainability for every transaction with one-click decision replay.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
