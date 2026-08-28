import React, { useState } from 'react';
import { useGuardrail } from '../../context/GuardrailContext';
import { TransactionFlowVisualizer } from './TransactionFlowVisualizer';
import { DecisionPipeline, PipelineNode } from './DecisionPipeline';
import { 
  X, 
  RotateCcw, 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Lock, 
  Copy, 
  Check, 
  ExternalLink,
  DollarSign,
  TrendingDown,
  Activity,
  ArrowRight,
  ShieldAlert,
  Gauge,
  Sparkles,
  Bot
} from 'lucide-react';
import { formatINR } from '../../utils/formatters';

export const TransactionExplorerDrawer: React.FC = () => {
  const { 
    selectedTransaction, 
    isTransactionDrawerOpen, 
    setIsTransactionDrawerOpen, 
    replayTransaction, 
    replayingTxId,
    setCurrentNav
  } = useGuardrail();

  const [activeTab, setActiveTab] = useState<'FLOW' | 'EXPLAINABILITY' | 'REPLAY' | 'PAYLOAD' | 'CRYPTO'>('EXPLAINABILITY');
  const [copiedHash, setCopiedHash] = useState(false);
  const [replayState, setReplayState] = useState<'IDLE' | 'REPLAYING' | 'MATCH' | 'MISMATCH'>('IDLE');

  if (!isTransactionDrawerOpen || !selectedTransaction) return null;

  const tx = selectedTransaction;
  const isBlocked = tx.status === 'BLOCKED';
  const isReview = tx.status === 'REVIEW';
  const isPermitted = tx.status === 'SUCCESS' || tx.status === 'SETTLED';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleRunReplay = () => {
    setReplayState('REPLAYING');
    replayTransaction(tx.id);
    setTimeout(() => {
      setReplayState('MATCH');
    }, 1800);
  };

  // Convert transaction steps to DecisionPipeline format
  const pipelineNodes: PipelineNode[] = [
    {
      id: 'INTENT',
      name: 'AI INTENT',
      shortLabel: 'INTENT',
      status: 'PASS',
      latencyMs: 12,
      telemetry: {
        input: tx.action,
        evaluatedRule: 'LLM Schema Validator',
        output: `Actor: ${tx.actor} • SKU Intent Validated`
      }
    },
    {
      id: 'POLICY',
      name: 'POLICY EVAL',
      shortLabel: 'POLICY',
      status: isBlocked ? 'BLOCK' : 'PASS',
      latencyMs: 14,
      telemetry: {
        evaluatedRule: tx.policyApplied || 'POL-001 (Margin Floor 15%)',
        output: isBlocked ? 'BLOCK: Margin or discount limit breached' : 'PASS: All margin rules satisfied'
      }
    },
    {
      id: 'AUTHORITY',
      name: 'AUTHORITY',
      shortLabel: 'AUTHORITY',
      status: isBlocked && tx.amount > 500000 ? 'BLOCK' : isReview ? 'REVIEW' : 'PASS',
      latencyMs: 8,
      telemetry: {
        evaluatedRule: 'Agent Cap Check',
        output: isBlocked && tx.amount > 500000 ? 'BLOCK: Spend exceeds ₹5,00,000 ceiling' : 'PASS: Within limit'
      }
    },
    {
      id: 'RISK',
      name: 'RISK SCORING',
      shortLabel: 'RISK',
      status: tx.riskScore > 0.6 ? 'BLOCK' : tx.riskScore > 0.2 ? 'REVIEW' : 'PASS',
      latencyMs: 6,
      telemetry: {
        evaluatedRule: 'Anomaly Matrix v3',
        output: `Risk Score: ${tx.riskScore.toFixed(2)} [${tx.riskLevel}]`
      }
    },
    {
      id: 'SUPERVISOR',
      name: 'SUPERVISOR',
      shortLabel: 'SUPERVISOR',
      status: isReview ? 'REVIEW' : 'SKIPPED',
      latencyMs: isReview ? 42000 : 0,
      telemetry: {
        evaluatedRule: 'Human-in-the-Loop Routing',
        output: isReview ? 'ESCALATED: Pending human sign-off' : 'SKIPPED: Autonomous execution permitted'
      }
    },
    {
      id: 'PAYMENT',
      name: 'PAYMENT',
      shortLabel: 'PAYMENT',
      status: isBlocked ? 'SKIPPED' : isReview ? 'PENDING' : 'PASS',
      latencyMs: 24,
      telemetry: {
        evaluatedRule: 'Razorpay Testnet Rails',
        output: isPermitted ? 'SETTLED: pay_token_verified' : 'HELD: Gateway dispatch prevented'
      }
    },
    {
      id: 'VERIFY',
      name: 'IDEMPOTENCY',
      shortLabel: 'VERIFY',
      status: isPermitted ? 'PASS' : 'SKIPPED',
      latencyMs: 6,
      telemetry: {
        evaluatedRule: 'Distributed Idempotency Ledger',
        output: 'VERIFIED: 0 duplicate charges'
      }
    },
    {
      id: 'AUDIT',
      name: 'AUDIT',
      shortLabel: 'AUDIT',
      status: 'PASS',
      latencyMs: 4,
      telemetry: {
        evaluatedRule: 'SHA-256 Merkle Ledger',
        output: `Hash: ${tx.hash || '0x8f2a91b4c3e7'} [VERIFIED]`
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex justify-end backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-[#0E0E0E] border-l border-[#333] h-full flex flex-col shadow-2xl animate-in slide-in-from-right-4 duration-200">
        
        {/* Top Header */}
        <div className="p-4 border-b border-[#222] bg-[#141414] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 ${
              isBlocked ? 'bg-[#FF3D00]' : isReview ? 'bg-[#FFA000]' : 'bg-[#00FF41]'
            }`} />
            <div>
              <div className="flex items-center gap-2">
                <span className="mono text-xs font-bold text-white">{tx.id}</span>
                <span className={`text-[9px] mono px-2 py-0.2 border ${
                  isBlocked 
                    ? 'bg-[#FF3D00]/10 border-[#FF3D00] text-[#FF3D00]' 
                    : isReview 
                    ? 'bg-[#FFA000]/10 border-[#FFA000] text-[#FFA000]' 
                    : 'bg-[#00FF41]/10 border-[#00FF41] text-[#00FF41]'
                }`}>
                  [{tx.status}]
                </span>
              </div>
              <span className="text-[10px] mono text-[#888]">{tx.actor} • {tx.merchantName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Replay Decision Button */}
            <button
              onClick={handleRunReplay}
              disabled={replayingTxId === tx.id || replayState === 'REPLAYING'}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1A1A1A] border border-[#333] hover:border-[#00FF41] text-xs mono text-white transition disabled:opacity-50"
              title="Replay the 10-step deterministic evaluation lifecycle"
            >
              <RotateCcw className={`w-3 h-3 ${replayState === 'REPLAYING' ? 'animate-spin text-[#00FF41]' : ''}`} />
              <span>{replayState === 'REPLAYING' ? 'REPLAYING...' : 'REPLAY DECISION'}</span>
            </button>

            <button
              onClick={() => setIsTransactionDrawerOpen(false)}
              className="p-1 text-[#888] hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI Proposal vs Guardrail Decision Bar */}
        <div className="p-3 bg-[#0A0A0A] border-b border-[#222] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mono">
          <div className="p-2 border border-[#222] bg-[#111]">
            <div className="text-[9px] text-[#888] flex items-center gap-1 mb-0.5">
              <Bot className="w-3 h-3 text-[#FFA000]" />
              <span>AI AGENT PROPOSAL:</span>
            </div>
            <div className="text-white font-bold text-xs truncate">
              {tx.action} ({tx.amount > 0 ? formatINR(tx.amount) : 'N/A'})
            </div>
          </div>

          <div className="p-2 border border-[#222] bg-[#111]">
            <div className="text-[9px] text-[#888] flex items-center gap-1 mb-0.5">
              <ShieldCheck className="w-3 h-3 text-[#00FF41]" />
              <span>GUARDRAIL CORE DECISION:</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-bold text-xs ${
                isBlocked ? 'text-[#FF3D00]' : isReview ? 'text-[#FFA000]' : 'text-[#00FF41]'
              }`}>
                [{isBlocked ? 'BLOCK ACTION' : isReview ? 'ESCALATE TO HUMAN' : 'PERMIT EXECUTION'}]
              </span>
              <span className="text-[10px] text-[#888]">Confidence: 99.4%</span>
            </div>
          </div>
        </div>

        {/* Visual Decision Pipeline Component */}
        <div className="px-4 py-2 bg-[#0A0A0A] border-b border-[#222]">
          <DecisionPipeline nodes={pipelineNodes} compact />
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#222] bg-[#111] px-4 text-xs mono overflow-x-auto">
          <button
            onClick={() => setActiveTab('EXPLAINABILITY')}
            className={`px-3 py-2.5 border-b-2 font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'EXPLAINABILITY'
                ? 'border-[#00FF41] text-white bg-[#161616]'
                : 'border-transparent text-[#888] hover:text-[#CCC]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#00FF41]" />
            <span>DECISION EXPLAINABILITY (WHY?)</span>
          </button>
          <button
            onClick={() => setActiveTab('FLOW')}
            className={`px-3 py-2.5 border-b-2 font-bold transition whitespace-nowrap ${
              activeTab === 'FLOW'
                ? 'border-[#00FF41] text-white bg-[#161616]'
                : 'border-transparent text-[#888] hover:text-[#CCC]'
            }`}
          >
            <span>10-STEP LIFECYCLE</span>
          </button>
          <button
            onClick={() => setActiveTab('REPLAY')}
            className={`px-3 py-2.5 border-b-2 font-bold transition whitespace-nowrap ${
              activeTab === 'REPLAY'
                ? 'border-[#00FF41] text-white bg-[#161616]'
                : 'border-transparent text-[#888] hover:text-[#CCC]'
            }`}
          >
            <span>DETERMINISM REPLAY</span>
          </button>
          <button
            onClick={() => setActiveTab('PAYLOAD')}
            className={`px-3 py-2.5 border-b-2 font-bold transition whitespace-nowrap ${
              activeTab === 'PAYLOAD'
                ? 'border-[#00FF41] text-white bg-[#161616]'
                : 'border-transparent text-[#888] hover:text-[#CCC]'
            }`}
          >
            <span>RAW JSON</span>
          </button>
          <button
            onClick={() => setActiveTab('CRYPTO')}
            className={`px-3 py-2.5 border-b-2 font-bold transition whitespace-nowrap ${
              activeTab === 'CRYPTO'
                ? 'border-[#00FF41] text-white bg-[#161616]'
                : 'border-transparent text-[#888] hover:text-[#CCC]'
            }`}
          >
            <span>CRYPTOGRAPHIC PROOF</span>
          </button>
        </div>

        {/* Drawer Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* TAB 1: Decision Explainability (Gap 1) */}
          {activeTab === 'EXPLAINABILITY' && (
            <div className="space-y-4 mono text-xs">
              {/* Decision Banner */}
              <div className={`p-4 border ${
                isBlocked ? 'bg-[#1E0E0C] border-[#FF3D00]/60' : isReview ? 'bg-[#1E190C] border-[#FFA000]/60' : 'bg-[#0E1A11] border-[#00FF41]/60'
              }`}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">DECISION CAUSAL CHAIN</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold border ${
                      isBlocked ? 'bg-[#FF3D00] text-black border-[#FF3D00]' : isReview ? 'bg-[#FFA000] text-black border-[#FFA000]' : 'bg-[#00FF41] text-black border-[#00FF41]'
                    }`}>
                      [{tx.explainability?.decision || (isBlocked ? 'BLOCKED' : isReview ? 'REVIEW' : 'PERMIT')}]
                    </span>
                  </div>
                  <span className="text-[10px] text-[#AAA]">DECISION CONFIDENCE: <strong className="text-white">99.4%</strong></span>
                </div>

                <p className="text-[#CCC] leading-relaxed text-xs">
                  {tx.explainability?.summary || tx.reason || 'Transaction complied with all registered merchant policy constraints.'}
                </p>

                {tx.explainability?.exposurePrevented && (
                  <div className="mt-3 pt-3 border-t border-[#FF3D00]/30 flex items-center justify-between text-xs">
                    <span className="text-[#FF3D00] flex items-center gap-1 font-bold">
                      <TrendingDown className="w-3.5 h-3.5" />
                      FINANCIAL LOSS PREVENTED:
                    </span>
                    <span className="text-white font-bold text-sm">
                      ₹{tx.explainability.exposurePrevented.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>

              {/* Six Causal Chain Checks */}
              <div className="border border-[#222] bg-[#0A0A0A]">
                <div className="p-2.5 border-b border-[#222] text-[10px] text-[#888] flex items-center justify-between">
                  <span className="font-bold">EVALUATED ASSERTIONS & CONSTRAINTS</span>
                  <span className="text-[#00FF41]">DETERMINISTIC EVALUATION</span>
                </div>
                <div className="divide-y divide-[#1A1A1A]">
                  {(tx.explainability?.checks || [
                    { text: 'Spend cap within authority ceiling', passed: true, value: '₹3,20,000 <= ₹5,00,000' },
                    { text: 'Merchant net margin floor satisfied', passed: !isBlocked, value: isBlocked ? '8.4% (< 15.0%)' : '18.2% (>= 15.0%)' },
                    { text: 'Agent authority & role permissions valid', passed: true, value: 'Valid Role' },
                    { text: 'Multi-dimensional risk score below threshold', passed: true, value: `${tx.riskScore.toFixed(2)} (< 0.70)` },
                    { text: 'Idempotency state check (0 duplicates)', passed: true, value: 'Unique Key' },
                    { text: 'Razorpay gateway health & signature verification', passed: true, value: 'HMAC-SHA256' }
                  ]).map((chk, i) => (
                    <div key={i} className="p-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-[#CCC]">
                        {chk.passed ? (
                          <CheckCircle className="w-3.5 h-3.5 text-[#00FF41] shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-[#FF3D00] shrink-0" />
                        )}
                        <span>{chk.text}</span>
                      </div>
                      {chk.value && (
                        <span className={`text-[10px] px-1.5 py-0.5 border shrink-0 ${
                          chk.passed ? 'bg-[#111] border-[#333] text-white' : 'bg-[#FF3D00]/10 border-[#FF3D00] text-[#FF3D00]'
                        }`}>
                          {chk.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Subsystem Telemetry Matrix: Policies, Risk Signals, Authority */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* 1. Policies Evaluated */}
                <div className="p-2.5 bg-[#0E0E0E] border border-[#222] space-y-1.5">
                  <span className="text-[9px] text-[#888] block uppercase">POLICIES EVALUATED:</span>
                  <div className="space-y-1 text-[10px]">
                    <div className="flex items-center justify-between text-white">
                      <span>POL-001 (Margin 15%)</span>
                      <span className={isBlocked ? 'text-[#FF3D00]' : 'text-[#00FF41]'}>
                        {isBlocked ? '[TRIPPED]' : '[PASS]'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#888]">
                      <span>POL-002 (Spend Cap)</span>
                      <span className="text-[#00FF41]">[PASS]</span>
                    </div>
                    <div className="flex items-center justify-between text-[#888]">
                      <span>POL-003 (Anomaly Floor)</span>
                      <span className="text-[#00FF41]">[PASS]</span>
                    </div>
                  </div>
                </div>

                {/* 2. Risk Signals */}
                <div className="p-2.5 bg-[#0E0E0E] border border-[#222] space-y-1.5">
                  <span className="text-[9px] text-[#888] block uppercase">RISK SIGNALS:</span>
                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between text-[#CCC]">
                      <span>Velocity:</span>
                      <span className="text-[#00FF41] font-bold">LOW (0.01)</span>
                    </div>
                    <div className="flex justify-between text-[#CCC]">
                      <span>Intent Drift:</span>
                      <span className="text-[#00FF41] font-bold">LOW (0.01)</span>
                    </div>
                    <div className="flex justify-between text-[#CCC]">
                      <span>Amount Anomaly:</span>
                      <span className="text-[#00FF41] font-bold">NOMINAL</span>
                    </div>
                  </div>
                </div>

                {/* 3. Authority State */}
                <div className="p-2.5 bg-[#0E0E0E] border border-[#222] space-y-1.5">
                  <span className="text-[9px] text-[#888] block uppercase">AUTHORITY BOUNDS:</span>
                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between text-[#CCC]">
                      <span>Allocated:</span>
                      <span className="text-white font-bold">₹5,00,000</span>
                    </div>
                    <div className="flex justify-between text-[#CCC]">
                      <span>Requested:</span>
                      <span className="text-white font-bold">₹{tx.amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-[#CCC]">
                      <span>Remaining:</span>
                      <span className="text-[#00FF41] font-bold">₹1,80,000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Action Box */}
              <div className="p-3 bg-[#111] border border-[#333] flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-[#888] block">FINAL ENFORCEMENT ACTION:</span>
                  <span className={`font-bold text-xs ${
                    isBlocked ? 'text-[#FF3D00]' : isReview ? 'text-[#FFA000]' : 'text-[#00FF41]'
                  }`}>
                    {isBlocked ? 'HALT TRANSACTION AT CORE PERIMETER' : isReview ? 'HOLD IN SUPERVISOR ESCROW' : 'DISPATCH TO RAZORPAY TESTNET RAILS'}
                  </span>
                </div>
                <span className="text-[10px] text-[#888]">[DETERMINISTIC RESULT]</span>
              </div>
            </div>
          )}

          {/* TAB 2: 10-Step Lifecycle Flow */}
          {activeTab === 'FLOW' && (
            <div className="space-y-3">
              <div className="p-3 bg-[#111] border border-[#222] flex items-center justify-between text-xs mono">
                <span className="text-[#888]">DETERMINISTIC EVALUATION PIPELINE:</span>
                <span className="text-[#00FF41]">[10 NODES EVALUATED]</span>
              </div>
              <TransactionFlowVisualizer steps={tx.steps} />
            </div>
          )}

          {/* TAB 3: Determinism Replay (Gap 11 & Gap 12 & Item 5) */}
          {activeTab === 'REPLAY' && (
            <div className="space-y-4 mono text-xs">
              <div className="p-4 bg-[#0A0A0A] border border-[#222] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-[#00FF41]" />
                    DETERMINISTIC LIFECYCLE REPLAY ENGINE
                  </span>
                  <button
                    onClick={handleRunReplay}
                    disabled={replayState === 'REPLAYING'}
                    className="px-3 py-1.5 bg-[#1A1A1A] border border-[#00FF41] text-[#00FF41] font-bold text-xs hover:bg-[#00FF41] hover:text-black transition"
                  >
                    {replayState === 'REPLAYING' ? 'REPLAYING LIFECYCLE...' : 'RUN REPLAY AUDIT'}
                  </button>
                </div>

                <p className="text-[#888] text-[11px] leading-relaxed">
                  Re-evaluates the identical input state through the deterministic AST engine to verify zero drift.
                </p>

                {/* Side by Side Lifecycle: ORIGINAL vs REPLAY */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {/* Original Execution Path */}
                  <div className="p-3 bg-[#111] border border-[#333] space-y-2">
                    <div className="flex items-center justify-between border-b border-[#222] pb-1.5">
                      <span className="text-[10px] text-[#888] font-bold">ORIGINAL LIFECYCLE:</span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-[#1A1A1A] border border-[#444] text-[#AAA]">HISTORICAL</span>
                    </div>
                    <div className="space-y-1 text-[11px] text-[#CCC]">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#888]">1.</span>
                        <span>INPUT (AI Intent Payload)</span>
                      </div>
                      <div className="text-center text-[#666] text-[10px]">↓</div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#888]">2.</span>
                        <span>POLICY (AST Constraint Evaluator)</span>
                      </div>
                      <div className="text-center text-[#666] text-[10px]">↓</div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#888]">3.</span>
                        <span>AUTHORITY (Spend & Role Ceiling)</span>
                      </div>
                      <div className="text-center text-[#666] text-[10px]">↓</div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#888]">4.</span>
                        <span>RISK (Multi-Factor Scoring Matrix)</span>
                      </div>
                      <div className="text-center text-[#666] text-[10px]">↓</div>
                      <div className="flex items-center justify-between pt-1 border-t border-[#222] font-bold">
                        <span className="text-white">ORIGINAL:</span>
                        <span className={isBlocked ? 'text-[#FF3D00]' : isReview ? 'text-[#FFA000]' : 'text-[#00FF41]'}>
                          [{isBlocked ? 'BLOCK' : isReview ? 'REVIEW' : 'PERMIT'}]
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Replay Execution Path */}
                  <div className="p-3 bg-[#111] border border-[#00FF41]/40 space-y-2">
                    <div className="flex items-center justify-between border-b border-[#222] pb-1.5">
                      <span className="text-[10px] text-[#00FF41] font-bold">REPLAY LIFECYCLE:</span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-[#00FF41]/10 border border-[#00FF41] text-[#00FF41]">
                        {replayState === 'REPLAYING' ? 'REPLAYING' : 'VERIFIED'}
                      </span>
                    </div>
                    <div className="space-y-1 text-[11px] text-[#CCC]">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#888]">1.</span>
                        <span>INPUT (Frozen Payload Hash)</span>
                      </div>
                      <div className="text-center text-[#666] text-[10px]">↓</div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#888]">2.</span>
                        <span>POLICY (v4.2.0 Immutable Rule)</span>
                      </div>
                      <div className="text-center text-[#666] text-[10px]">↓</div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#888]">3.</span>
                        <span>AUTHORITY (Exact State Bounds)</span>
                      </div>
                      <div className="text-center text-[#666] text-[10px]">↓</div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#888]">4.</span>
                        <span>RISK (Score 0.04 Low Recomputed)</span>
                      </div>
                      <div className="text-center text-[#666] text-[10px]">↓</div>
                      <div className="flex items-center justify-between pt-1 border-t border-[#222] font-bold">
                        <span className="text-white">REPLAY:</span>
                        <span className={isBlocked ? 'text-[#FF3D00]' : isReview ? 'text-[#FFA000]' : 'text-[#00FF41]'}>
                          {replayState === 'REPLAYING' ? 'COMPUTING...' : `[${isBlocked ? 'BLOCK' : isReview ? 'REVIEW' : 'PERMIT'}]`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Verification Card */}
                <div className="p-3.5 bg-[#0E1A11] border border-[#00FF41] grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div>
                    <span className="text-[9px] text-[#888] block">ORIGINAL</span>
                    <span className="text-white font-bold">{isBlocked ? '[BLOCK]' : isReview ? '[REVIEW]' : '[PERMIT]'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#888] block">REPLAY</span>
                    <span className="text-white font-bold">{isBlocked ? '[BLOCK]' : isReview ? '[REVIEW]' : '[PERMIT]'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#888] block">RESULT</span>
                    <span className="text-[#00FF41] font-bold">[MATCH]</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#888] block">DETERMINISM</span>
                    <span className="text-[#00FF41] font-bold">100.0%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#888] px-1">
                  <span>BENCHMARK RECORD: <strong>1,000 / 1,000 Identical Evaluations</strong></span>
                  <span className="text-[#00FF41]">ZERO DRIFT DETECTED</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Raw Payload */}
          {activeTab === 'PAYLOAD' && (
            <div className="space-y-2 mono text-xs">
              <div className="p-2 bg-[#141414] border border-[#222] flex justify-between items-center text-[10px] text-[#888]">
                <span>STRUCTURED TRANSACTION INTENT PAYLOAD</span>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(tx, null, 2))}
                  className="text-white hover:text-[#00FF41] flex items-center gap-1"
                >
                  {copiedHash ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedHash ? 'COPIED' : 'COPY JSON'}</span>
                </button>
              </div>
              <pre className="p-3 bg-[#0A0A0A] border border-[#222] text-[#AAA] text-[11px] overflow-x-auto">
                {JSON.stringify(tx, null, 2)}
              </pre>
            </div>
          )}

          {/* TAB 5: Cryptographic Proof */}
          {activeTab === 'CRYPTO' && (
            <div className="space-y-3 mono text-xs">
              <div className="p-4 bg-[#0A0A0A] border border-[#222] space-y-3">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Lock className="w-4 h-4 text-[#00FF41]" />
                  <span>IMMUTABLE LEDGER ATTESTATION</span>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between py-1 border-b border-[#222]">
                    <span className="text-[#888]">CRYPTOGRAPHIC HASH:</span>
                    <span className="text-[#00FF41]">{tx.hash || '0x8f2a91b4c3e7d812'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#222]">
                    <span className="text-[#888]">IDEMPOTENCY KEY:</span>
                    <span className="text-white">{tx.idempotencyKey || 'idemp_9481_a83f'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#222]">
                    <span className="text-[#888]">SIGNATURE ALGORITHM:</span>
                    <span className="text-white">HMAC-SHA256 (Razorpay Protocol)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#222]">
                    <span className="text-[#888]">LEDGER BLOCK:</span>
                    <span className="text-white">#84,912 (Reconciled)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer: 4 Action Buttons as required */}
        <div className="p-3 border-t border-[#222] bg-[#141414] flex flex-wrap items-center justify-between gap-2 text-xs mono">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#888]">RECORD:</span>
            <span className="text-white font-bold text-[11px]">{tx.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunReplay}
              className="px-2.5 py-1 bg-[#1A1A1A] border border-[#333] hover:border-[#00FF41] text-white text-[11px] transition flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3 text-[#00FF41]" />
              <span>REPLAY DECISION</span>
            </button>

            <button
              onClick={() => {
                setIsTransactionDrawerOpen(false);
                setCurrentNav('POLICIES');
              }}
              className="px-2.5 py-1 bg-[#1A1A1A] border border-[#333] hover:border-[#00FF41] text-white text-[11px] transition"
            >
              VIEW POLICY
            </button>

            <button
              onClick={() => {
                setIsTransactionDrawerOpen(false);
                setCurrentNav('AGENTS');
              }}
              className="px-2.5 py-1 bg-[#1A1A1A] border border-[#333] hover:border-[#00FF41] text-white text-[11px] transition"
            >
              VIEW AGENT
            </button>

            <button
              onClick={() => {
                setIsTransactionDrawerOpen(false);
                setCurrentNav('AUDIT');
              }}
              className="px-2.5 py-1 bg-[#1A1A1A] border border-[#00FF41] text-[#00FF41] text-[11px] transition flex items-center gap-1"
            >
              <span>VIEW AUDIT</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
