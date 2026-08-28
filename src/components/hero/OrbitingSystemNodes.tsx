import React from 'react';
import { Brain, ShieldCheck, Scale, AlertTriangle, CreditCard, CheckCircle2 } from 'lucide-react';

export interface SystemNodeInfo {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  status: 'ACTIVE' | 'PROCESSING' | 'BLOCKED' | 'REVIEW' | 'VERIFIED' | 'IDLE';
  metric: string;
  tag: string;
}

interface OrbitingSystemNodesProps {
  activeNodeId?: string | null;
  onNodeClick?: (id: string) => void;
}

export const OrbitingSystemNodes: React.FC<OrbitingSystemNodesProps> = ({
  activeNodeId,
  onNodeClick
}) => {
  const nodes: SystemNodeInfo[] = [
    {
      id: 'AI_REASONING',
      name: 'AI REASONING',
      subtitle: 'Intent → Plan → Act',
      icon: <Brain className="w-3.5 h-3.5 text-[#FF3D00]" />,
      status: 'ACTIVE',
      metric: '0.12s Latency',
      tag: 'LLM Agent'
    },
    {
      id: 'POLICIES',
      name: 'MERCHANT POLICIES',
      subtitle: 'Deterministic Rules',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-[#00FF41]" />,
      status: 'ACTIVE',
      metric: '100% Bound',
      tag: 'Floor: 15%'
    },
    {
      id: 'AUTHORITY',
      name: 'AGENT AUTHORITY',
      subtitle: 'Spend & Margin Caps',
      icon: <Scale className="w-3.5 h-3.5 text-white" />,
      status: 'ACTIVE',
      metric: '₹5,00,000 Cap',
      tag: '64% Used'
    },
    {
      id: 'RISK_ENGINE',
      name: 'RISK ENGINE',
      subtitle: 'Fraud & Velocity Check',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-[#FFB52E]" />,
      status: 'ACTIVE',
      metric: 'Score: 0.04',
      tag: 'Safe'
    },
    {
      id: 'RAZORPAY',
      name: 'RAZORPAY',
      subtitle: 'Orders & Payments',
      icon: <CreditCard className="w-3.5 h-3.5 text-white" />,
      status: 'ACTIVE',
      metric: 'Test Gateway',
      tag: 'Settlement'
    },
    {
      id: 'VERIFICATION',
      name: 'VERIFICATION',
      subtitle: 'State Reconciliation',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF41]" />,
      status: 'ACTIVE',
      metric: 'Immutable',
      tag: '0 Duplicates'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 w-full">
      {nodes.map((node) => {
        const isActive = activeNodeId === node.id;
        return (
          <button
            key={node.id}
            type="button"
            onClick={() => onNodeClick && onNodeClick(node.id)}
            className={`text-left p-2.5 transition-all relative border overflow-hidden ${
              isActive
                ? 'bg-[#1A1A1A] border-[#FF3D00] text-white shadow-lg'
                : 'bg-[#0E0E0E] border-[#222] hover:border-[#444] hover:bg-[#141414]'
            }`}
          >
            {/* Top orange line indicator if active */}
            {isActive && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#FF3D00]" />
            )}

            <div className="flex items-center justify-between mb-1.5">
              <div className="p-1 bg-[#141414] border border-[#222]">
                {node.icon}
              </div>
              <span className="text-[9px] mono px-1 py-0.2 bg-[#141414] text-[#888] border border-[#222]">
                {node.tag}
              </span>
            </div>

            <div className="mono text-[11px] font-bold text-white truncate">
              {node.name}
            </div>
            <div className="text-[10px] mono text-[#888] truncate mt-0.5">
              {node.subtitle}
            </div>

            <div className="mt-2 pt-1.5 border-t border-[#222] flex items-center justify-between text-[9px] mono">
              <span className="text-[#666]">STATUS</span>
              <span className="text-[#00FF41] font-bold">{node.metric}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
