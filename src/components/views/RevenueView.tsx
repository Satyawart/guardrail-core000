import React from 'react';
import { useGuardrail } from '../../context/GuardrailContext';
import { TrendingUp, ShieldCheck, DollarSign, ArrowUpRight, BarChart3, Lock } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

export const RevenueView: React.FC = () => {
  const { revenueData } = useGuardrail();

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="p-4 bg-[#0E0E0E] border border-[#222] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#00FF41]" />
            <h1 className="text-base font-bold mono text-white tracking-wider">REVENUE INTELLIGENCE & MARGIN PRESERVATION MATRIX</h1>
            <span className="text-[10px] mono px-2 py-0.5 bg-[#1A1A1A] border border-[#00FF41] text-[#00FF41]">
              +{revenueData.revenueUpliftPercent}% UPLIFT
            </span>
          </div>
          <p className="text-xs mono text-[#888] mt-1">
            "Guardrail did not just block risk. Guardrail unlocked ₹48.2M in safe, governed autonomous revenue."
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mono text-xs">
        <div className="p-4 bg-[#0E0E0E] border border-[#222]">
          <span className="text-[10px] text-[#888] block mb-1">
            <Tooltip term="Governed Volume" content="Total transaction volume safely executed through Guardrail bounds." />
          </span>
          <span className="text-white font-black text-xl">₹{(revenueData.totalRevenue / 1000000).toFixed(1)}M</span>
          <span className="text-[10px] text-[#00FF41] block mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +24.6% vs unmanaged
          </span>
        </div>

        <div className="p-4 bg-[#0E0E0E] border border-[#222]">
          <span className="text-[10px] text-[#888] block mb-1">
            <Tooltip term="Margin Protected" content="Net financial profits preserved by deterministic margin floor blocks." />
          </span>
          <span className="text-[#00FF41] font-black text-xl">₹{(revenueData.marginProtected / 100000).toFixed(1)}L</span>
          <span className="text-[10px] text-[#888] block mt-1">15.0% Guaranteed Floor</span>
        </div>

        <div className="p-4 bg-[#0E0E0E] border border-[#222]">
          <span className="text-[10px] text-[#888] block mb-1">
            <Tooltip term="Blocked Leakage" content="Prevented unauthorized agent discounts and fraudulent refunds." />
          </span>
          <span className="text-[#FF3D00] font-black text-xl">₹{(revenueData.blockedValue / 100000).toFixed(1)}L</span>
          <span className="text-[10px] text-[#888] block mt-1">0% Leakage Rate</span>
        </div>

        <div className="p-4 bg-[#0E0E0E] border border-[#222]">
          <span className="text-[10px] text-[#888] block mb-1">
            <Tooltip term="Conversion Rate" content="Percentage of autonomous customer proposals successfully converted to paid orders." />
          </span>
          <span className="text-white font-black text-xl">{revenueData.conversionRate}%</span>
          <span className="text-[10px] text-[#00FF41] block mt-1">+12.4% Lift</span>
        </div>
      </div>

      {/* Historical Trend Chart (SVG/CSS) */}
      <div className="p-5 bg-[#0E0E0E] border border-[#222] space-y-4 mono text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#00FF41]" />
            WEEKLY GOVERNED REVENUE TRAJECTORY (WITH VS WITHOUT GUARDRAIL)
          </span>
          <div className="flex items-center gap-4 text-[10px]">
            <span className="flex items-center gap-1 text-[#00FF41]">
              <span className="w-2 h-2 bg-[#00FF41]" /> Governed (With Guardrail)
            </span>
            <span className="flex items-center gap-1 text-[#666]">
              <span className="w-2 h-2 bg-[#444]" /> Unmanaged Baseline
            </span>
          </div>
        </div>

        {/* CSS/SVG Bar Visualizer */}
        <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-[#222]">
          {revenueData.historicalTrend.map((d, i) => {
            const maxVal = 10000000;
            const governedHeight = (d.revenue / maxVal) * 100;
            const baseHeight = (d.unprotectedBaseline / maxVal) * 100;

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1.5 h-full">
                  {/* Baseline Bar */}
                  <div 
                    className="w-1/2 bg-[#333] transition-all hover:bg-[#555]"
                    style={{ height: `${baseHeight}%` }}
                    title={`Baseline: ₹${(d.unprotectedBaseline / 100000).toFixed(1)}L`}
                  />
                  {/* Governed Bar */}
                  <div 
                    className="w-1/2 bg-[#00FF41] transition-all hover:bg-[#00E53A]"
                    style={{ height: `${governedHeight}%` }}
                    title={`Governed: ₹${(d.revenue / 100000).toFixed(1)}L`}
                  />
                </div>
                <span className="text-[10px] text-[#888]">{d.date}</span>
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-[#0A0A0A] border border-[#1A1A1A] text-[11px] text-[#AAA] leading-relaxed">
          <span className="text-[#00FF41] font-bold">INSIGHT: </span>
          Autonomous pricing with dynamic volume discount rules lifted conversion velocity by 24.6% without a single breach of the 15.0% merchant margin floor.
        </div>
      </div>
    </div>
  );
};
