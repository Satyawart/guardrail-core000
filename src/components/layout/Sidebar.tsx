import React from 'react';
import { useGuardrail } from '../../context/GuardrailContext';
import { NavItem } from '../../types';
import { 
  Activity, 
  ShieldCheck, 
  Bot, 
  CheckSquare, 
  TrendingUp, 
  Flame, 
  Award,
  Terminal,
  Clock,
  Lock,
  Server,
  Scale,
  Gauge
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentNav, setCurrentNav, approvals, policies } = useGuardrail();

  const pendingApprovalsCount = approvals.length;

  const navItems: { id: NavItem; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'OVERVIEW', label: 'COMMAND CENTER', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'AGENTS', label: 'AGENT RUNTIMES', icon: <Bot className="w-3.5 h-3.5" />, badge: '12 Live' },
    { id: 'TRANSACTIONS', label: 'EVENT STREAM', icon: <Terminal className="w-3.5 h-3.5" /> },
    { id: 'POLICIES', label: 'POLICY REPOSITORY', icon: <ShieldCheck className="w-3.5 h-3.5" />, badge: `${policies.length} Active` },
    { 
      id: 'APPROVALS', 
      label: 'SUPERVISOR QUEUE', 
      icon: <CheckSquare className="w-3.5 h-3.5" />, 
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} DUE` : undefined 
    },
    { id: 'RISK', label: 'RISK ENGINE', icon: <Gauge className="w-3.5 h-3.5" />, badge: '0.06' },
    { id: 'FAILURE_LAB', label: 'FAILURE LAB', icon: <Flame className="w-3.5 h-3.5" /> },
    { id: 'EVALUATION', label: 'BENCHMARK SUITE', icon: <Award className="w-3.5 h-3.5" />, badge: '1k Tests' },
    { id: 'REVENUE', label: 'REVENUE MATRIX', icon: <TrendingUp className="w-3.5 h-3.5" />, badge: '+24.6%' },
    { id: 'AUDIT', label: 'AUDIT LEDGER', icon: <Lock className="w-3.5 h-3.5" /> },
    { id: 'SYSTEM', label: 'SYSTEM TELEMETRY', icon: <Server className="w-3.5 h-3.5" /> },
    { id: 'BEFORE_AFTER', label: 'COMPARISON MATRIX', icon: <Scale className="w-3.5 h-3.5" /> }
  ];

  return (
    <aside className="w-64 bg-[#0E0E0E] border-r border-[#222] flex flex-col justify-between select-none z-20 shrink-0 hidden md:flex">
      {/* Top Section */}
      <div className="overflow-y-auto">
        {/* Subheader */}
        <div className="p-3 border-b border-[#222] flex items-center justify-between text-[10px] mono text-[#888]">
          <span className="tracking-widest">NAVIGATION CONSOLE</span>
          <span className="text-[#00FF41]">[ONLINE]</span>
        </div>

        {/* Nav Links */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = currentNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentNav(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-left mono text-xs transition border ${
                  isActive
                    ? 'bg-[#1A1A1A] border-[#333] text-white'
                    : 'bg-transparent border-transparent text-[#888] hover:text-[#CCC] hover:bg-[#141414]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-1 h-3.5 ${isActive ? 'bg-[#FF3D00]' : 'bg-transparent'}`} />
                  <span className={isActive ? 'text-white font-bold' : ''}>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 border ${
                    item.id === 'APPROVALS' && pendingApprovalsCount > 0
                      ? 'bg-[#FF3D00]/10 border-[#FF3D00]/40 text-[#FF3D00] font-bold'
                      : 'bg-[#111] border-[#222] text-[#888]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Live Autonomy Stream Mini-Widget */}
        <div className="p-3 mx-2 my-2 bg-[#0A0A0A] border border-[#222] text-[10px] mono">
          <div className="flex items-center justify-between text-[#888] mb-2 pb-1 border-b border-[#222]">
            <span>SYSTEM BOUNDARIES</span>
            <span className="text-[#00FF41]">100% BOUND</span>
          </div>
          <div className="space-y-1.5 text-[#AAA]">
            <div className="flex justify-between">
              <span>MARGIN FLOOR:</span>
              <span className="text-white font-bold">15.0%</span>
            </div>
            <div className="flex justify-between">
              <span>MAX SPEND CAP:</span>
              <span className="text-white font-bold">₹5,00,000</span>
            </div>
            <div className="flex justify-between">
              <span>MAX DISCOUNT:</span>
              <span className="text-white font-bold">10.0%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Node Status */}
      <div className="p-3 border-t border-[#222] bg-[#0A0A0A] text-[10px] mono text-[#888]">
        <div className="flex items-center justify-between mb-1">
          <span>AI AGENT RUNTIMES</span>
          <span className="text-white font-bold">12 ACTIVE</span>
        </div>
        <div className="w-full bg-[#222] h-1">
          <div className="bg-[#00FF41] h-1 w-[64%]" />
        </div>
        <div className="flex justify-between mt-1 text-[9px] text-[#666]">
          <span>64% CAPITAL UTILIZED</span>
          <span>₹1.8L REMAINING</span>
        </div>
      </div>
    </aside>
  );
};
export type { NavItem };
