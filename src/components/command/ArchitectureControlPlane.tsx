import React, { useState } from 'react';
import { Bot, Terminal, ShieldCheck, UserCheck, CreditCard, Key, Lock, Activity, ArrowRight, RefreshCw, CheckCircle } from 'lucide-react';

export interface SubsystemInfo {
  id: string;
  name: string;
  category: 'AGENT' | 'INGESTION' | 'GUARDRAIL' | 'ESCALATION' | 'RAILS' | 'LEDGER';
  status: 'NOMINAL' | 'ACTIVE' | 'DEGRADED' | 'STANDBY';
  latencyMs: number;
  lastEvent: string;
  failureCount: number;
  policyVersion?: string;
  verificationState: string;
  description: string;
  rulesLoaded?: string[];
  metrics: { label: string; value: string }[];
}

export const SUBSYSTEMS_DATA: SubsystemInfo[] = [
  {
    id: 'AGENT_RUNTIME',
    name: 'AUTONOMOUS AGENT RUNTIME',
    category: 'AGENT',
    status: 'ACTIVE',
    latencyMs: 12,
    lastEvent: 'AI Buyer #17 dispatched purchase proposal',
    failureCount: 0,
    policyVersion: 'v4.2.0',
    verificationState: 'BOUND_SANDBOX',
    description: '12 enterprise autonomous agents generating continuous commerce intents via tool-use schemas.',
    metrics: [
      { label: 'Active Runtimes', value: '12 / 12' },
      { label: 'Total Allocated Cap', value: '₹16,00,000' },
      { label: 'Sandbox Isolation', value: 'STRICT' }
    ]
  },
  {
    id: 'INTENT_PARSER',
    name: 'INTENT PARSER & NORMALIZER',
    category: 'INGESTION',
    status: 'NOMINAL',
    latencyMs: 8,
    lastEvent: 'Schema validation completed for ORD-94812',
    failureCount: 0,
    policyVersion: 'v4.2.0',
    verificationState: 'SCHEMA_VALID',
    description: 'Translates unconstrained LLM outputs into deterministic typed financial intent objects.',
    metrics: [
      { label: 'Schema Compliance', value: '100.0%' },
      { label: 'Avg Ingest Latency', value: '8.4ms' },
      { label: 'Type Stripping', value: 'ENABLED' }
    ]
  },
  {
    id: 'POLICY_ENGINE',
    name: 'GUARDRAIL POLICY ENGINE',
    category: 'GUARDRAIL',
    status: 'NOMINAL',
    latencyMs: 4,
    lastEvent: 'Evaluated POL-001 (Margin floor 15%)',
    failureCount: 0,
    policyVersion: 'v4.2.0-STABLE',
    verificationState: 'DETERMINISTIC_AST',
    description: 'Compiles natural language rules into deterministic Abstract Syntax Tree expressions. Evaluates in <5ms.',
    rulesLoaded: ['POL-001 Margin Floor 15%', 'POL-002 Spend Cap Tier-1', 'POL-003 Anomaly Boundary'],
    metrics: [
      { label: 'Rules Loaded', value: '14 Active' },
      { label: 'Determinism Rate', value: '100.0%' },
      { label: 'Violations Blocked', value: '142' }
    ]
  },
  {
    id: 'AUTHORITY_SERVICE',
    name: 'AGENT AUTHORITY SERVICE',
    category: 'GUARDRAIL',
    status: 'NOMINAL',
    latencyMs: 3,
    lastEvent: 'Checked single-tx cap: ₹3,20,000 <= ₹5,00,000',
    failureCount: 0,
    policyVersion: 'v4.2.0',
    verificationState: 'CAPS_ENFORCED',
    description: 'Maintains hard real-time spend ceilings, discount caps, and velocity throttles per agent identity.',
    metrics: [
      { label: 'Spend Governed', value: '₹48.2M' },
      { label: 'Enforcement Rate', value: '100%' },
      { label: 'Escrow Lock', value: 'INSTANT' }
    ]
  },
  {
    id: 'RISK_ENGINE',
    name: 'MULTI-DIMENSIONAL RISK ENGINE',
    category: 'GUARDRAIL',
    status: 'NOMINAL',
    latencyMs: 6,
    lastEvent: 'Risk matrix computed score: 0.04 (Low)',
    failureCount: 0,
    policyVersion: 'v4.2.0',
    verificationState: 'ANOMALY_PASS',
    description: 'Real-time composite scoring across velocity, merchant category deviation, and semantic prompt drift.',
    metrics: [
      { label: 'Current System Tier', value: '0.06 LOW' },
      { label: 'Threshold Ceiling', value: '0.70' },
      { label: 'Headroom', value: '0.64' }
    ]
  },
  {
    id: 'SUPERVISOR_RELAY',
    name: 'SUPERVISOR ESCALATION RELAY',
    category: 'ESCALATION',
    status: 'STANDBY',
    latencyMs: 14,
    lastEvent: 'Escrow held for Support Agent #09 (₹14,500 refund)',
    failureCount: 0,
    policyVersion: 'v4.2.0',
    verificationState: 'HUMAN_OVERSIGHT_ACTIVE',
    description: 'Human-in-the-loop fallback queue. Intercepts threshold exceptions without stalling autonomous traffic.',
    metrics: [
      { label: 'Pending Reviews', value: '1 Active' },
      { label: 'Avg Decision Time', value: '42s' },
      { label: 'Autonomy Ratio', value: '99.2%' }
    ]
  },
  {
    id: 'RAZORPAY_TESTNET',
    name: 'RAZORPAY TESTNET RAILS',
    category: 'RAILS',
    status: 'NOMINAL',
    latencyMs: 28,
    lastEvent: 'Payment capture order_NYz8923h confirmed',
    failureCount: 0,
    policyVersion: 'v4.2.0',
    verificationState: 'HMAC_SHA256_VERIFIED',
    description: 'Direct payment gateway adapter with testnet token settlement and webhook signature verification.',
    metrics: [
      { label: 'API Uptime', value: '99.99%' },
      { label: 'Gateway Latency', value: '28ms' },
      { label: 'Signature Proof', value: 'HMAC-SHA256' }
    ]
  },
  {
    id: 'IDEMPOTENCY_LEDGER',
    name: 'DISTRIBUTED IDEMPOTENCY LAYER',
    category: 'LEDGER',
    status: 'NOMINAL',
    latencyMs: 5,
    lastEvent: 'Deduplicated event evt_9918 (0 extra charges)',
    failureCount: 0,
    policyVersion: 'v4.2.0',
    verificationState: 'ZERO_DUPLICATES',
    description: 'Atomic lock mechanism preventing double-debits from network retries, race conditions, or duplicate webhooks.',
    metrics: [
      { label: 'Duplicate Attempts Blocked', value: '38' },
      { label: 'Double Debits', value: '0' },
      { label: 'Key TTL', value: '86400s' }
    ]
  },
  {
    id: 'AUDIT_LEDGER',
    name: 'IMMUTABLE CRYPTOGRAPHIC AUDIT',
    category: 'LEDGER',
    status: 'NOMINAL',
    latencyMs: 4,
    lastEvent: 'Block #84912 committed with SHA-256 root',
    failureCount: 0,
    policyVersion: 'v4.2.0',
    verificationState: 'MERKLE_PROVED',
    description: 'Cryptographically hashed ledger recording every decision, policy check, and state transition.',
    metrics: [
      { label: 'Audit Records', value: '1,492' },
      { label: 'Hash Verification', value: '100% VALID' },
      { label: 'Replay Accuracy', value: '100.0%' }
    ]
  }
];

export const ArchitectureControlPlane: React.FC = () => {
  const [selectedSubsystem, setSelectedSubsystem] = useState<SubsystemInfo>(SUBSYSTEMS_DATA[2]);

  return (
    <div className="p-4 bg-[#0E0E0E] border border-[#222] space-y-4 mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#222] gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#00FF41]" />
          <h2 className="font-bold text-white tracking-wider text-sm">
            CONTROL PLANE ARCHITECTURE & SUBSYSTEM TOPOLOGY
          </h2>
        </div>
        <span className="text-[10px] text-[#888] bg-[#141414] px-2 py-0.5 border border-[#333]">
          [CONTROL PLANE NOT JUST DASHBOARD]
        </span>
      </div>

      {/* Top Architecture Flow Graphic */}
      <div className="p-3 bg-[#0A0A0A] border border-[#222] space-y-3">
        <div className="text-[10px] text-[#888] flex items-center justify-between">
          <span>END-TO-END GOVERNANCE PIPELINE FLOW</span>
          <span className="text-[#00FF41]">[CLICK ANY SUBSYSTEM FOR TELEMETRY]</span>
        </div>

        {/* Subsystem Cards Rail */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
          {SUBSYSTEMS_DATA.map((sub, idx) => {
            const isSelected = selectedSubsystem.id === sub.id;
            return (
              <div
                key={sub.id}
                onClick={() => setSelectedSubsystem(sub)}
                className={`p-3 border transition cursor-pointer select-none flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#181818] border-[#00FF41] text-white ring-1 ring-[#00FF41]/40'
                    : 'bg-[#0E0E0E] border-[#222] text-[#AAA] hover:border-[#444] hover:text-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[9px] text-[#666] mb-1">
                    <span>NODE 0{idx + 1}</span>
                    <span className="text-[#00FF41] font-bold">[{sub.status}]</span>
                  </div>
                  <div className="font-bold text-[11px] text-white truncate">{sub.name}</div>
                </div>

                <div className="mt-2 pt-2 border-t border-[#1A1A1A] flex items-center justify-between text-[10px]">
                  <span className="text-[#888]">{sub.latencyMs}ms</span>
                  <span className="text-[#00FF41] text-[9px] truncate max-w-[90px]">{sub.verificationState}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Subsystem Inspector Card */}
      <div className="p-4 bg-[#141414] border border-[#333] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#222] gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#00FF41]" />
            <span className="font-bold text-white text-sm">{selectedSubsystem.name}</span>
            <span className="text-[10px] mono px-2 py-0.2 bg-[#00FF41]/10 border border-[#00FF41] text-[#00FF41]">
              [{selectedSubsystem.status}]
            </span>
          </div>

          <div className="flex items-center gap-3 text-[10px] text-[#888]">
            <span>LATENCY: <strong className="text-white">{selectedSubsystem.latencyMs}ms</strong></span>
            <span>VERIFICATION: <strong className="text-[#00FF41]">{selectedSubsystem.verificationState}</strong></span>
          </div>
        </div>

        <p className="text-xs text-[#CCC] leading-relaxed">
          {selectedSubsystem.description}
        </p>

        {/* Subsystem Metrics & Telemetry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          {selectedSubsystem.metrics.map((m, idx) => (
            <div key={idx} className="p-2.5 bg-[#0A0A0A] border border-[#222]">
              <span className="text-[9px] text-[#888] block mb-0.5">{m.label}:</span>
              <span className="text-white font-bold text-sm">{m.value}</span>
            </div>
          ))}
        </div>

        <div className="p-2 bg-[#0A0A0A] border border-[#222] text-[11px] flex items-center justify-between">
          <span className="text-[#888]">LAST EVENT TELEMETRY:</span>
          <span className="text-white font-bold truncate max-w-md">{selectedSubsystem.lastEvent}</span>
        </div>
      </div>
    </div>
  );
};
