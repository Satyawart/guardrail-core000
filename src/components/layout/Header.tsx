import React, { useState } from 'react';
import { useGuardrail } from '../../context/GuardrailContext';
import { useAuth } from '../../context/AuthContext';
import { DemoController } from '../ui/DemoController';
import { NotificationCenter } from '../ui/NotificationCenter';
import { AccountSwitcher } from './AccountSwitcher';
import { NavItem } from '../../types';
import { 
  ShieldCheck, 
  Cpu, 
  Search, 
  Terminal, 
  Play, 
  Sparkles, 
  Wifi, 
  WifiOff, 
  Menu, 
  X,
  Activity,
  Bot,
  CheckSquare,
  TrendingUp,
  Flame,
  Award,
  Lock,
  Server,
  Scale,
  Gauge
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activeScenarioId, 
    triggerScenario, 
    isTestMode, 
    toggleTestMode, 
    setIsCommandPaletteOpen,
    setIsPitchModeOpen,
    currentNav,
    setCurrentNav,
    approvals,
    policies,
    isLiveLoading
  } = useGuardrail();
  const { user } = useAuth();
  const operatorEmail = user?.email || 'AUTHENTICATED';

  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const pendingApprovalsCount = approvals.filter(a => a.status === 'PENDING').length;

  const navItems: { id: NavItem; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'OVERVIEW', label: 'COMMAND CENTER', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'AGENTS', label: 'AGENT RUNTIMES', icon: <Bot className="w-3.5 h-3.5" /> },
    { id: 'TRANSACTIONS', label: 'EVENT STREAM', icon: <Terminal className="w-3.5 h-3.5" /> },
    { id: 'POLICIES', label: 'POLICY REPOSITORY', icon: <ShieldCheck className="w-3.5 h-3.5" />, badge: `${policies.length} Active` },
    { 
      id: 'APPROVALS', 
      label: 'SUPERVISOR QUEUE', 
      icon: <CheckSquare className="w-3.5 h-3.5" />, 
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} DUE` : undefined 
    },
    { id: 'RISK', label: 'RISK ENGINE', icon: <Gauge className="w-3.5 h-3.5" /> },
    { id: 'FAILURE_LAB', label: 'FAILURE LAB', icon: <Flame className="w-3.5 h-3.5" /> },
    { id: 'EVALUATION', label: 'BENCHMARK SUITE', icon: <Award className="w-3.5 h-3.5" />, badge: '1k Tests' },
    { id: 'REVENUE', label: 'REVENUE MATRIX', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'AUDIT', label: 'AUDIT LEDGER', icon: <Lock className="w-3.5 h-3.5" /> },
    { id: 'SYSTEM', label: 'SYSTEM TELEMETRY', icon: <Server className="w-3.5 h-3.5" /> },
    { id: 'BEFORE_AFTER', label: 'COMPARISON MATRIX', icon: <Scale className="w-3.5 h-3.5" /> }
  ];

  return (
    <header className="h-12 bg-[#0E0E0E] border-b border-[#222] px-3 sm:px-4 flex items-center justify-between z-30 select-none relative">
      {/* Left: Brand & Mobile Hamburger */}
      <div className="flex items-center gap-2.5 sm:gap-6">
        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="md:hidden p-1 bg-[#141414] border border-[#333] hover:border-[#00FF41] text-white transition flex items-center justify-center"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileNavOpen ? <X className="w-4 h-4 text-[#00FF41]" /> : <Menu className="w-4 h-4" />}
        </button>

        <div 
          onClick={() => {
            setCurrentNav('OVERVIEW');
            setIsMobileNavOpen(false);
          }} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-3.5 h-3.5 bg-[#FF3D00] flex items-center justify-center text-black font-black text-[9px] group-hover:bg-[#00FF41] transition" />
          <span className="font-bold tracking-wider text-xs mono text-white truncate">GUARDRAIL</span>
          <span className="hidden sm:inline-block text-[10px] mono px-1.5 py-0.2 bg-[#1A1A1A] border border-[#333] text-[#00FF41]">
            v4.2.0
          </span>
        </div>

        {/* Global Command Palette Trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-[#141414] border border-[#333] hover:border-[#555] text-[11px] mono text-[#888] hover:text-white transition"
          title="Open Command Palette (CMD+K / Ctrl+K)"
        >
          <Search className="w-3 h-3" />
          <span>SEARCH & COMMANDS</span>
          <kbd className="px-1 py-0.2 bg-[#0A0A0A] border border-[#333] text-[9px] text-[#666]">⌘K</kbd>
        </button>
      </div>

      {/* Right: Live Telemetry, Gateway Mode, Pitch Tour & Demo Controls */}
      <div className="flex items-center gap-2 sm:gap-3 text-xs mono">
        {/* Real-time System Metrics */}
        <div className="hidden lg:flex items-center gap-3 text-[#888] text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isLiveLoading ? 'bg-[#FFA000] animate-pulse' : 'bg-[#00FF41]'}`} />
            <span className={isLiveLoading ? 'text-[#FFA000]' : 'text-[#00FF41]'}>
              {isLiveLoading ? 'SYNCING...' : 'LIVE'}
            </span>
          </div>
          <div className="h-3 w-px bg-[#222]" />
          <div>ENGINE: <span className="text-white font-bold">DETERMINISTIC</span></div>
          <div className="h-3 w-px bg-[#222]" />
          <AccountSwitcher />
        </div>

        {/* 90-Second Pitch Walkthrough Button */}
        <button
          onClick={() => setIsPitchModeOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-[#1A1A1A] border border-[#00FF41]/60 hover:border-[#00FF41] text-[#00FF41] text-[10px] mono transition shadow-sm"
          title="Launch 90-second Pitch Walkthrough Tour"
        >
          <Sparkles className="w-3 h-3" />
          <span>PITCH TOUR</span>
        </button>

        {/* Razorpay Gateway Switcher */}
        <button
          type="button"
          onClick={toggleTestMode}
          className={`hidden xs:flex items-center gap-1.5 px-2 py-1 border text-[10px] mono transition ${
            isTestMode
              ? 'bg-[#1A1A1A] border-[#00FF41] text-[#00FF41]'
              : 'bg-[#0E0E0E] border-[#333] text-[#888]'
          }`}
          title="Toggle Razorpay Test / Production Mock Gateway"
        >
          <span className={`w-1.5 h-1.5 ${isTestMode ? 'bg-[#00FF41]' : 'bg-[#666]'}`} />
          <span>{isTestMode ? 'TESTNET' : 'SIM'}</span>
        </button>

        {/* Notification Center */}
        <NotificationCenter />

        {/* 5-Min Pitch Demo Controller */}
        <DemoController
          activeScenarioId={activeScenarioId}
          onSelectScenario={(id) => {
            triggerScenario(id);
            setIsDemoOpen(false);
          }}
          isOpen={isDemoOpen}
          onToggle={() => setIsDemoOpen(!isDemoOpen)}
        />
      </div>

      {/* Mobile Navigation Slide-out Drawer */}
      {isMobileNavOpen && (
        <>
          <div 
            className="fixed inset-0 top-12 bg-black/70 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileNavOpen(false)}
          />
          <div className="absolute top-12 left-0 w-72 bg-[#0E0E0E] border-r border-b border-[#333] shadow-2xl z-50 md:hidden max-h-[calc(100vh-3rem)] overflow-y-auto p-2 space-y-1 animate-in slide-in-from-left duration-200">
            <div className="p-2 border-b border-[#222] flex items-center justify-between text-[10px] mono text-[#888]">
              <span className="tracking-widest">NAVIGATION CONSOLE</span>
              <span className="text-[#00FF41]">[ONLINE]</span>
            </div>
            {navItems.map((item) => {
              const isActive = currentNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentNav(item.id);
                    setIsMobileNavOpen(false);
                  }}
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
          </div>
        </>
      )}
    </header>
  );
};
