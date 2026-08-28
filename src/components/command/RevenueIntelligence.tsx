import React from 'react';
import { RevenueMetric } from '../../types';
import { formatINR } from '../../utils/formatters';
import { TrendingUp, ShieldCheck, Sparkles } from 'lucide-react';

interface RevenueIntelligenceProps {
  data: RevenueMetric;
}

export const RevenueIntelligence: React.FC<RevenueIntelligenceProps> = ({ data }) => {
  const maxRev = Math.max(...data.historicalTrend.map((d) => d.revenue));

  return (
    <div className="bg-[#0E0E0E] p-4 border border-[#222] flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#222] mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#00FF41]" />
            <h3 className="text-xs font-bold mono text-white tracking-wider">
              REVENUE INTELLIGENCE &amp; CONSTRAINTS
            </h3>
          </div>
          <span className="text-[10px] mono px-1.5 py-0.2 bg-[#00FF41]/10 border border-[#00FF41]/40 text-[#00FF41]">
            +{data.revenueUpliftPercent}% UPLIFT
          </span>
        </div>

        {/* Micro KPI Row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="p-2.5 bg-[#0A0A0A] border border-[#222]">
            <div className="text-[9px] mono uppercase text-[#888]">TOTAL GOVERNED</div>
            <div className="text-sm font-bold mono text-white mt-0.5">
              {formatINR(data.totalRevenue)}
            </div>
          </div>

          <div className="p-2.5 bg-[#0A0A0A] border border-[#222]">
            <div className="text-[9px] mono uppercase text-[#888]">PROTECTED MARGIN</div>
            <div className="text-sm font-bold mono text-[#00FF41] mt-0.5">
              {formatINR(data.marginProtected)}
            </div>
          </div>

          <div className="p-2.5 bg-[#0A0A0A] border border-[#222]">
            <div className="text-[9px] mono uppercase text-[#888]">CONVERSION</div>
            <div className="text-sm font-bold mono text-white mt-0.5">
              {data.conversionRate}%
            </div>
          </div>
        </div>

        {/* Trajectory Bar Chart */}
        <div className="p-3 bg-[#0A0A0A] border border-[#222] mb-3">
          <div className="flex items-center justify-between text-[10px] mono mb-2 text-[#888]">
            <span>7-DAY GOVERNED VOLUME VS BASELINE</span>
            <div className="flex items-center gap-3 text-[9px]">
              <span className="text-[#00FF41]">■ GOVERNED</span>
              <span className="text-[#666]">■ UNBOUND</span>
            </div>
          </div>

          <div className="h-24 flex items-end justify-between gap-2 pt-2">
            {data.historicalTrend.map((pt, idx) => {
              const heightPercent = (pt.revenue / maxRev) * 100;
              const baselinePercent = (pt.unprotectedBaseline / maxRev) * 100;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="relative w-full h-20 flex items-end justify-center">
                    {/* Baseline */}
                    <div 
                      className="absolute bottom-0 w-full bg-[#222] transition-all" 
                      style={{ height: `${baselinePercent}%` }}
                    />
                    {/* Governed */}
                    <div 
                      className="absolute bottom-0 w-full bg-[#00FF41]/80 hover:bg-[#00FF41] transition-all" 
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[9px] mono text-[#666] group-hover:text-white">
                    {pt.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Recommendation Box */}
        <div className="p-2.5 bg-[#141414] border-l-2 border-[#00FF41] text-[11px] mono">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[#00FF41] font-bold text-[10px]">
              COMMERCE ALIGNMENT RECOMMENDATION
            </span>
            <span className="text-[9px] text-[#888]">[PREDICTED]</span>
          </div>

          <p className="text-[#CCC] leading-relaxed text-[10px]">
            "{data.aiRecommendation.description}"
          </p>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-1.5 border-t border-[#222] text-[10px]">
            <div>
              <span className="text-[#666] block">PREDICTED LIFT:</span>
              <span className="text-[#00FF41] font-bold">{data.aiRecommendation.predictedUplift}</span>
            </div>
            <div>
              <span className="text-[#666] block">SAFETY INTEGRITY:</span>
              <span className="text-white font-bold">{data.aiRecommendation.measuredImpact}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2.5 border-t border-[#222] flex items-center justify-between text-[9px] mono text-[#888]">
        <span>DYNAMIC PRICING ENGINE</span>
        <span className="text-[#00FF41]">[MARGIN FLOOR 15.0% ACTIVE]</span>
      </div>
    </div>
  );
};
