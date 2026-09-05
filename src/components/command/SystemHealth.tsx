import React from 'react';
import { SystemHealthItem } from '../../types';
import { SYSTEM_HEALTH_ITEMS } from '../../data/mockData';

interface SystemHealthProps {
  items?: SystemHealthItem[];
}

export const SystemHealth: React.FC<SystemHealthProps> = ({ items = SYSTEM_HEALTH_ITEMS }) => {
  return (
    <div className="bg-[#0E0E0E] p-4 border border-[#222]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-[#222]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-[#00FF41]" />
          <div>
            <h3 className="font-bold text-xs mono text-white flex items-center gap-2 tracking-wider">
              INFRASTRUCTURE &amp; TELEMETRY NODES
              <span className="text-[9px] mono px-1.5 py-0.2 bg-[#00FF41]/10 border border-[#00FF41]/40 text-[#00FF41]">
                [ALL SYSTEMS NOMINAL]
              </span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[10px] mono text-[#888]">
          <span>GLOBAL LATENCY: <strong className="text-[#00FF41]">NOT TRACKED</strong></span>
          <span>•</span>
          <span>UPTIME: <strong className="text-white">NOT TRACKED</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {items.map((sys, idx) => (
          <div
            key={idx}
            className="p-2.5 bg-[#0A0A0A] border border-[#222] hover:border-[#444] transition"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold mono text-white truncate">{sys.name}</span>
              <span className="w-1.5 h-1.5 bg-[#00FF41]" />
            </div>

            <div className="flex items-center justify-between text-[9px] mono text-[#888] mt-2">
              <span>LATENCY</span>
              <span className="text-[#00FF41]">{sys.latencyMs}ms</span>
            </div>

            <div className="flex items-center justify-between text-[9px] mono text-[#888] mt-0.5">
              <span>UPTIME</span>
              <span className="text-white">{sys.uptimePercent}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
