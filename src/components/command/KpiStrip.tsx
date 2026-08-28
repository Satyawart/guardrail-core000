import React from 'react';
import { KpiMetric } from '../../types';
import { 
  Users, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  TrendingUp, 
  ShieldCheck 
} from 'lucide-react';

interface KpiStripProps {
  metrics: KpiMetric[];
  onKpiClick?: (type: string) => void;
}

export const KpiStrip: React.FC<KpiStripProps> = ({ metrics, onKpiClick }) => {
  const getKpiConfig = (type: KpiMetric['type']) => {
    switch (type) {
      case 'agents':
        return {
          icon: <Users className="w-3.5 h-3.5 text-[#FF3D00]" />,
          accentBar: 'bg-[#FF3D00]',
          renderVisual: () => (
            <div className="flex items-center gap-1.5 mt-2">
              <span className="w-1.5 h-1.5 bg-[#00FF41]" />
              <span className="text-[9px] mono text-[#888]">12 Live Runtimes</span>
            </div>
          )
        };
      case 'authorized':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF41]" />,
          accentBar: 'bg-[#00FF41]',
          renderVisual: () => (
            <div className="flex items-center gap-1.5 mt-2">
              <div className="h-1 flex-1 bg-[#222]">
                <div className="h-full bg-[#00FF41] w-[99%]" />
              </div>
              <span className="text-[9px] mono text-[#00FF41]">99.98%</span>
            </div>
          )
        };
      case 'blocked':
        return {
          icon: <ShieldAlert className="w-3.5 h-3.5 text-[#FF3D00]" />,
          accentBar: 'bg-[#FF3D00]',
          renderVisual: () => (
            <div className="flex items-center justify-between text-[9px] mono mt-2 text-[#FF3D00]">
              <span>0% LEAKAGE</span>
              <span className="text-[#888]">AUTO-BLOCKED</span>
            </div>
          )
        };
      case 'approvals':
        return {
          icon: <Clock className="w-3.5 h-3.5 text-[#FFB52E]" />,
          accentBar: 'bg-[#FFB52E]',
          renderVisual: () => (
            <div className="flex items-center gap-1.5 mt-2">
              <span className="w-1.5 h-1.5 bg-[#FFB52E] animate-pulse" />
              <span className="text-[9px] mono text-[#FFB52E]">Supervisor Active</span>
            </div>
          )
        };
      case 'volume':
        return {
          icon: <TrendingUp className="w-3.5 h-3.5 text-white" />,
          accentBar: 'bg-white',
          renderVisual: () => (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-[9px] mono text-[#00FF41]">+0.12% CURRENT_DELTA</span>
            </div>
          )
        };
      case 'violations':
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5 text-[#00FF41]" />,
          accentBar: 'bg-[#00FF41]',
          renderVisual: () => (
            <div className="flex items-center justify-between text-[9px] mono mt-2 text-[#888]">
              <span>RISK SHIELD</span>
              <span className="text-[#00FF41]">₹84.5k SAVED</span>
            </div>
          )
        };
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 w-full">
      {metrics.map((kpi) => {
        const config = getKpiConfig(kpi.type);

        return (
          <div
            key={kpi.id}
            onClick={() => onKpiClick && onKpiClick(kpi.type)}
            className="group bg-[#0E0E0E] p-3.5 border border-[#222] hover:border-[#444] transition-all cursor-pointer relative overflow-hidden"
          >
            {/* Left Accent Bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${config.accentBar}`} />

            <div className="flex items-center justify-between mb-1.5">
              <div className="p-1 bg-[#141414] border border-[#222]">
                {config.icon}
              </div>
              <span className="text-[9px] mono px-1.5 py-0.2 bg-[#141414] border border-[#222] text-[#888]">
                {kpi.change}
              </span>
            </div>

            <div className="text-[10px] mono uppercase text-[#888] truncate mt-1">
              {kpi.title}
            </div>

            <div className="text-xl font-bold mono text-white tracking-tight mt-0.5">
              {kpi.value}
            </div>

            {config.renderVisual()}
          </div>
        );
      })}
    </div>
  );
};
