import React from 'react';
import { useGuardrail } from '../../context/GuardrailContext';
import { ArchitectureControlPlane } from '../command/ArchitectureControlPlane';
import { Cpu, Activity, Clock, ShieldCheck, Server, Zap, CheckCircle } from 'lucide-react';

export const SystemView: React.FC = () => {
  const { systemHealth, globalFilters, setGlobalFilters, analyticsData } = useGuardrail();
  const timeRange = globalFilters.timeRange;

  const telemetrySeries = analyticsData?.telemetry_series || [];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="p-4 bg-[#0E0E0E] border border-[#222] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#00FF41]" />
            <h1 className="text-base font-bold mono text-white tracking-wider">SYSTEM OBSERVABILITY & CONTROL PLANE TOPOLOGY</h1>
            <span className="text-[10px] mono px-2 py-0.5 bg-[#1A1A1A] border border-[#00FF41] text-[#00FF41]">
              ALL 7 SUBSYSTEMS 100% OPERATIONAL
            </span>
          </div>
          <p className="text-xs mono text-[#888] mt-1">
            Real-time latency metrics, evaluation throughput, and distributed high-availability node telemetry.
          </p>
        </div>

        {/* Time-range Selector */}
        <div className="flex bg-[#141414] border border-[#333] p-0.5 mono text-xs">
          {(['1H', '24H', '7D', '30D'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setGlobalFilters(prev => ({ ...prev, timeRange: r }))}
              className={`px-3 py-1 text-[10px] font-bold transition ${
                timeRange === r ? 'bg-[#00FF41] text-black' : 'text-[#888] hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Control Plane Subsystem Topology */}
      <ArchitectureControlPlane />

      {/* Subsystem Health Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mono text-xs">
        {systemHealth.map((item, i) => (
          <div key={i} className="p-3.5 bg-[#0E0E0E] border border-[#222] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">{item.name}</span>
              <span className="text-[9px] px-1.5 py-0.2 bg-[#00FF41]/10 border border-[#00FF41] text-[#00FF41] font-bold">
                [{item.status}]
              </span>
            </div>
            <p className="text-[10px] text-[#888]">{item.description}</p>
            <div className="pt-2 border-t border-[#1A1A1A] flex justify-between text-[10px]">
              <span className="text-[#666]">LATENCY: <strong className="text-white">{item.latencyMs}ms</strong></span>
              <span className="text-[#666]">UPTIME: <strong className="text-[#00FF41]">{item.uptimePercent}%</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Throughput & Latency Series */}
      <div className="p-5 bg-[#0E0E0E] border border-[#222] space-y-4 mono text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#00FF41]" />
            DETERMINISTIC EVALUATION VELOCITY & LATENCY OVER TIME ({timeRange})
          </span>
          <span className="text-[10px] text-[#888]">MEAN LATENCY: 1.22ms • ERROR RATE: 0.00%</span>
        </div>

        {/* Table & series representation */}
        <div className="border border-[#222] bg-[#0A0A0A] overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-[#141414] border-b border-[#222] text-[10px] text-[#888]">
              <tr>
                <th className="p-2.5">TIMESTAMP</th>
                <th className="p-2.5">AVG LATENCY</th>
                <th className="p-2.5">THROUGHPUT (TX/S)</th>
                <th className="p-2.5">POLICY EVALS</th>
                <th className="p-2.5">RISK EVALS</th>
                <th className="p-2.5 text-right">ERROR RATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]">
              {telemetrySeries.map((pt: any, i: number) => (
                <tr key={i} className="hover:bg-[#141414]">
                  <td className="p-2.5 font-bold text-white">{pt.time}</td>
                  <td className="p-2.5 text-[#00FF41] font-bold">{pt.latency}ms</td>
                  <td className="p-2.5 text-white">{pt.throughput.toLocaleString('en-IN')}</td>
                  <td className="p-2.5 text-[#AAA]">{pt.policyEvals.toLocaleString('en-IN')}</td>
                  <td className="p-2.5 text-[#AAA]">{pt.riskEvals.toLocaleString('en-IN')}</td>
                  <td className="p-2.5 text-right text-[#00FF41] font-bold">{pt.errorRate.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
