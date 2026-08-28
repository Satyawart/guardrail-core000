import React from 'react';
import { AuthorizationRing } from '../ui/AuthorizationRing';
import { formatINR } from '../../utils/formatters';
import { Scale, Lock, ShieldCheck, AlertCircle } from 'lucide-react';

interface AgentAuthorityPanelProps {
  authority: {
    agentId: string;
    merchant: string;
    status: string;
    spendLimit: number;
    usedSpend: number;
    remainingSpend: number;
    utilizationPercent: number;
    discountAuthorityMaxPercent: number;
    refundAuthorityMax: number;
    validUntil: string;
  };
}

export const AgentAuthorityPanel: React.FC<AgentAuthorityPanelProps> = ({ authority }) => {
  return (
    <div className="bg-[#0E0E0E] border border-[#222] p-4 flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#222]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#00FF41]" />
            <h3 className="text-xs font-bold mono text-white tracking-wider">
              AGENT AUTHORITY BOUNDS
            </h3>
          </div>
          <span className="text-[10px] mono px-1.5 py-0.2 bg-[#00FF41]/10 border border-[#00FF41]/40 text-[#00FF41]">
            [BOUNDED]
          </span>
        </div>

        {/* Ring & Primary Utilization Display */}
        <div className="flex items-center justify-center my-3">
          <AuthorizationRing
            percentage={authority.utilizationPercent}
            size={124}
            strokeWidth={6}
            label="SPEND CEILING"
            sublabel="UTILIZED"
          />
        </div>

        {/* Financial Authority Grid */}
        <div className="space-y-2 text-[10px] mono">
          <div className="p-2 bg-[#0A0A0A] border border-[#222]">
            <div className="flex justify-between text-[#888] mb-1">
              <span>ALLOCATED SPEND CAP:</span>
              <span className="text-white font-bold">{formatINR(authority.spendLimit)}</span>
            </div>
            <div className="flex justify-between text-[#888]">
              <span>REMAINING AUTHORITY:</span>
              <span className="text-[#00FF41] font-bold">{formatINR(authority.remainingSpend)}</span>
            </div>
            {/* Linear meter */}
            <div className="w-full bg-[#222] h-1.5 mt-2">
              <div
                className="bg-[#00FF41] h-1.5 transition-all duration-500"
                style={{ width: `${authority.utilizationPercent}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-[#0A0A0A] border border-[#222]">
              <span className="text-[#666] block">MAX DISCOUNT:</span>
              <span className="text-white font-bold">{authority.discountAuthorityMaxPercent}.0%</span>
              <span className="text-[9px] text-[#888] block mt-0.5">Floor: 15.0%</span>
            </div>
            <div className="p-2 bg-[#0A0A0A] border border-[#222]">
              <span className="text-[#666] block">AUTO REFUND:</span>
              <span className="text-white font-bold">{formatINR(authority.refundAuthorityMax)}</span>
              <span className="text-[9px] text-[#888] block mt-0.5">&gt; Requires 2FA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-3 pt-2.5 border-t border-[#222] flex items-center justify-between text-[9px] mono text-[#888]">
        <span>IMMUTABLE HARD BOUND</span>
        <span className="text-[#00FF41]">[ZERO OVERRUN]</span>
      </div>
    </div>
  );
};
