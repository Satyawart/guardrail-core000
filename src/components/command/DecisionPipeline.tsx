import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Clock, RefreshCw, ShieldCheck, ChevronRight } from 'lucide-react';

export type PipelineNodeStatus = 'PASS' | 'BLOCK' | 'REVIEW' | 'SKIPPED' | 'FAILED' | 'RECOVERED' | 'PENDING';

export interface PipelineNode {
  id: string;
  name: string;
  shortLabel: string;
  status: PipelineNodeStatus;
  latencyMs?: number;
  telemetry?: {
    evaluatedRule?: string;
    input?: string;
    output?: string;
    proof?: string;
    details?: string;
  };
}

interface DecisionPipelineProps {
  nodes?: PipelineNode[];
  activeNodeId?: string | null;
  onNodeClick?: (node: PipelineNode) => void;
  compact?: boolean;
  className?: string;
}

export const DEFAULT_PIPELINE_NODES: PipelineNode[] = [
  { 
    id: 'INTENT', 
    name: 'AI INTENT', 
    shortLabel: 'INTENT', 
    status: 'PASS', 
    latencyMs: 12,
    telemetry: {
      input: 'Customer prompt: "Procure 5 laptops under ₹3.5L"',
      evaluatedRule: 'LLM Intent Parser v2.4 (Strict Schema)',
      output: 'Normalized Order { SKU: "DELL-XPS-15", qty: 5, budget: 350000 }',
      details: 'Semantic intent parsed deterministically into structured execution payload.'
    }
  },
  { 
    id: 'POLICY', 
    name: 'POLICY ENGINE', 
    shortLabel: 'POLICY', 
    status: 'PASS', 
    latencyMs: 14,
    telemetry: {
      input: 'Proposed Margin: 18.2%, Discount: 6.5%',
      evaluatedRule: 'POL-001 (MARGIN_FLOOR_15 v4.2.0)',
      output: 'PASS: Margin 18.2% satisfies 15.0% floor (+3.2% headroom)',
      details: 'Deterministic AST evaluation completed with zero boundary violations.'
    }
  },
  { 
    id: 'AUTHORITY', 
    name: 'AUTHORITY BOUNDS', 
    shortLabel: 'AUTHORITY', 
    status: 'PASS', 
    latencyMs: 8,
    telemetry: {
      input: 'Requested: ₹3,20,000 | Agent Cap: ₹5,00,000',
      evaluatedRule: 'Agent Authority Matrix Rule #04',
      output: 'PASS: Spend within allocated budget (Remaining: ₹1,80,000)',
      details: 'Single-transaction and 24h rolling velocity verified within assigned limits.'
    }
  },
  { 
    id: 'RISK', 
    name: 'RISK SCORING', 
    shortLabel: 'RISK', 
    status: 'PASS', 
    latencyMs: 6,
    telemetry: {
      input: 'IP, Device, Merchant ID, Semantic Drift',
      evaluatedRule: 'ML Anomaly Matrix v3.1',
      output: 'Score: 0.04 (NOMINAL < 0.20 Threshold)',
      details: 'Velocity check, amount anomaly, and merchant deviation all evaluated low risk.'
    }
  },
  { 
    id: 'SUPERVISOR', 
    name: 'SUPERVISOR ESCALATION', 
    shortLabel: 'SUPERVISOR', 
    status: 'SKIPPED', 
    latencyMs: 0,
    telemetry: {
      input: 'Autonomous Execution Threshold: Met',
      evaluatedRule: 'Human-in-the-Loop Routing Rules',
      output: 'SKIPPED: Zero exception triggers. Autonomous permit granted.',
      details: 'No supervisor escalation required; transaction operates inside safe boundaries.'
    }
  },
  { 
    id: 'PAYMENT', 
    name: 'PAYMENT EXECUTION', 
    shortLabel: 'PAYMENT', 
    status: 'PASS', 
    latencyMs: 18,
    telemetry: {
      input: 'Payload: ₹3,20,000 to ACME_CORP (Order: ord_NYz8923h)',
      evaluatedRule: 'Razorpay Testnet API Adapter',
      output: 'State: PAYMENT_ORDER_CREATED (pay_9410_test)',
      details: 'Dispatched to Razorpay payment rails with secure HMAC-SHA256 signature.'
    }
  },
  { 
    id: 'VERIFY', 
    name: 'IDEMPOTENCY VERIFY', 
    shortLabel: 'VERIFY', 
    status: 'PASS', 
    latencyMs: 7,
    telemetry: {
      input: 'Idempotency Key: idemp_94812_8912',
      evaluatedRule: 'Distributed Idempotency Ledger',
      output: 'VERIFIED: Unique transaction token. 0 duplicate postings.',
      details: 'State machine verified single execution guarantee. Zero duplicate debits.'
    }
  },
  { 
    id: 'AUDIT', 
    name: 'CRYPTOGRAPHIC AUDIT', 
    shortLabel: 'AUDIT', 
    status: 'PASS', 
    latencyMs: 5,
    telemetry: {
      input: 'Lifecycle state snapshot #84912',
      evaluatedRule: 'SHA-256 Merkle Ledger',
      output: 'Hash: 0x8f2a91b4c3e7 [VERIFIED]',
      details: 'Immutable record committed to tamper-proof audit trail.'
    }
  }
];

export const DecisionPipeline: React.FC<DecisionPipelineProps> = ({
  nodes = DEFAULT_PIPELINE_NODES,
  activeNodeId = null,
  onNodeClick,
  compact = false,
  className = ''
}) => {
  const [selectedNode, setSelectedNode] = useState<PipelineNode | null>(null);

  const handleNodeSelect = (node: PipelineNode) => {
    setSelectedNode(prev => prev?.id === node.id ? null : node);
    onNodeClick?.(node);
  };

  const getStatusBadge = (status: PipelineNodeStatus) => {
    switch (status) {
      case 'PASS':
        return {
          bg: 'bg-[#00FF41]/10',
          border: 'border-[#00FF41]',
          text: 'text-[#00FF41]',
          dot: 'bg-[#00FF41]',
          label: '[PASS]'
        };
      case 'BLOCK':
        return {
          bg: 'bg-[#FF3D00]/10',
          border: 'border-[#FF3D00]',
          text: 'text-[#FF3D00]',
          dot: 'bg-[#FF3D00]',
          label: '[BLOCK]'
        };
      case 'REVIEW':
        return {
          bg: 'bg-[#FFA000]/10',
          border: 'border-[#FFA000]',
          text: 'text-[#FFA000]',
          dot: 'bg-[#FFA000]',
          label: '[REVIEW]'
        };
      case 'FAILED':
        return {
          bg: 'bg-[#FF3D00]/20',
          border: 'border-[#FF3D00]',
          text: 'text-[#FF3D00]',
          dot: 'bg-[#FF3D00]',
          label: '[FAILED]'
        };
      case 'RECOVERED':
        return {
          bg: 'bg-[#00FF41]/20',
          border: 'border-[#00FF41]',
          text: 'text-[#00FF41]',
          dot: 'bg-[#00FF41]',
          label: '[RECOVERED]'
        };
      case 'SKIPPED':
      default:
        return {
          bg: 'bg-[#141414]',
          border: 'border-[#333]',
          text: 'text-[#777]',
          dot: 'bg-[#555]',
          label: '[SKIPPED]'
        };
    }
  };

  return (
    <div className={`p-3 bg-[#0A0A0A] border border-[#222] ${className}`}>
      {/* Title Bar */}
      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#222] text-xs mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#00FF41]" />
          <span className="font-bold text-white tracking-wider">VISUAL DECISION PIPELINE</span>
          <span className="text-[10px] text-[#888] hidden sm:inline">[CLICK NODE FOR TELEMETRY]</span>
        </div>
        <span className="text-[10px] text-[#888]">
          DETERMINISTIC CONTROL LOOP
        </span>
      </div>

      {/* Nodes Rail */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 mono text-[10px]">
        {nodes.map((node, index) => {
          const style = getStatusBadge(node.status);
          const isSelected = selectedNode?.id === node.id || activeNodeId === node.id;

          return (
            <div
              key={node.id}
              onClick={() => handleNodeSelect(node)}
              className={`p-2 border transition cursor-pointer flex flex-col justify-between select-none ${
                isSelected
                  ? 'bg-[#181818] border-white text-white ring-1 ring-white/30'
                  : `${style.bg} ${style.border} ${style.text} hover:border-[#666]`
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[9px] text-[#888] font-bold">0{index + 1}</span>
                <span className={`w-1.5 h-1.5 ${style.dot}`} />
              </div>

              <div className="font-bold text-[10px] truncate text-white">
                {node.shortLabel}
              </div>

              <div className="flex items-center justify-between mt-1 pt-1 border-t border-[#222] text-[9px]">
                <span className={style.text}>{style.label}</span>
                {node.latencyMs !== undefined && node.latencyMs > 0 && (
                  <span className="text-[#888]">{node.latencyMs}ms</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Node Inspector Drawer / Panel */}
      {selectedNode && (
        <div className="mt-3 p-3 bg-[#111] border border-[#333] mono text-xs animate-in fade-in duration-150 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-[#222]">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 ${getStatusBadge(selectedNode.status).dot}`} />
              <span className="font-bold text-white">{selectedNode.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 border ${getStatusBadge(selectedNode.status).border} ${getStatusBadge(selectedNode.status).text}`}>
                [{selectedNode.status}]
              </span>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-[10px] text-[#888] hover:text-white"
            >
              [CLOSE]
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
            {selectedNode.telemetry?.evaluatedRule && (
              <div className="p-2 bg-[#0A0A0A] border border-[#222]">
                <span className="text-[9px] text-[#888] block">RULE EVALUATED:</span>
                <span className="text-white font-bold">{selectedNode.telemetry.evaluatedRule}</span>
              </div>
            )}
            {selectedNode.telemetry?.input && (
              <div className="p-2 bg-[#0A0A0A] border border-[#222]">
                <span className="text-[9px] text-[#888] block">INPUT STATE:</span>
                <span className="text-[#AAA] truncate block">{selectedNode.telemetry.input}</span>
              </div>
            )}
          </div>

          {selectedNode.telemetry?.output && (
            <div className="p-2 bg-[#0A0A0A] border border-[#222] text-[11px]">
              <span className="text-[9px] text-[#888] block">EXECUTION OUTPUT:</span>
              <span className="text-[#00FF41] font-bold block">{selectedNode.telemetry.output}</span>
            </div>
          )}

          {selectedNode.telemetry?.details && (
            <div className="text-[10px] text-[#888] leading-relaxed">
              {selectedNode.telemetry.details}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
