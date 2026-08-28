import React, { useState, useEffect, useRef } from 'react';
import { useGuardrail } from '../../context/GuardrailContext';
import { Search, Terminal, ArrowRight, ShieldCheck, ShieldAlert, Cpu, CheckSquare, Activity, Flame, Award, TrendingUp, Lock, X } from 'lucide-react';
import { NavItem, DemoScenarioId } from '../../types';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    setCurrentNav, 
    triggerScenario, 
    transactions, 
    policies, 
    agents,
    setSelectedTransaction,
    setIsTransactionDrawerOpen,
    setIsPitchModeOpen,
    toggleAgentStatus,
    resetDemoState
  } = useGuardrail();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Build command suggestions
  const navCommands = [
    { label: 'Open Dashboard (Overview)', category: 'Navigation', icon: <Activity className="w-3.5 h-3.5 text-[#00FF41]" />, action: () => setCurrentNav('OVERVIEW') },
    { label: 'Open Agents (Authority Console)', category: 'Navigation', icon: <Activity className="w-3.5 h-3.5 text-[#00FF41]" />, action: () => setCurrentNav('AGENTS') },
    { label: 'Open Policies (Repository & Compiler)', category: 'Navigation', icon: <ShieldCheck className="w-3.5 h-3.5 text-[#00FF41]" />, action: () => setCurrentNav('POLICIES') },
    { label: 'Open Supervisor Queue (Human-in-the-Loop)', category: 'Navigation', icon: <CheckSquare className="w-3.5 h-3.5 text-[#FFA000]" />, action: () => setCurrentNav('APPROVALS') },
    { label: 'Open Risk Engine (Anomaly Matrix)', category: 'Navigation', icon: <ShieldAlert className="w-3.5 h-3.5 text-[#FF3D00]" />, action: () => setCurrentNav('RISK') },
    { label: 'Open Failure Lab (Chaos & Recovery)', category: 'Navigation', icon: <Flame className="w-3.5 h-3.5 text-[#FF3D00]" />, action: () => setCurrentNav('FAILURE_LAB') },
    { label: 'Open Revenue Matrix (Uplift & Floor)', category: 'Navigation', icon: <TrendingUp className="w-3.5 h-3.5 text-[#00FF41]" />, action: () => setCurrentNav('REVENUE') },
    { label: 'Open Audit (SHA-256 Merkle Ledger)', category: 'Navigation', icon: <Lock className="w-3.5 h-3.5 text-white" />, action: () => setCurrentNav('AUDIT') },
    { label: 'Open Benchmarks (1,000-Test Suite)', category: 'Navigation', icon: <Award className="w-3.5 h-3.5 text-[#00FF41]" />, action: () => setCurrentNav('EVALUATION') },
    { label: 'Open System (Control Plane Topology)', category: 'Navigation', icon: <Cpu className="w-3.5 h-3.5 text-[#AAA]" />, action: () => setCurrentNav('SYSTEM') },
    { label: 'Open Before vs After (Comparative Impact)', category: 'Navigation', icon: <Activity className="w-3.5 h-3.5 text-[#00FF41]" />, action: () => setCurrentNav('BEFORE_AFTER') }
  ];

  const directActionCommands = [
    { 
      label: 'Action: Pause Agent (AI Procurement #17)', 
      category: 'Action', 
      icon: <Terminal className="w-3.5 h-3.5 text-[#FFA000]" />, 
      action: () => {
        toggleAgentStatus('agent_1', 'PAUSED');
        setCurrentNav('AGENTS');
      } 
    },
    { 
      label: 'Action: Resume Agent (AI Procurement #17)', 
      category: 'Action', 
      icon: <Terminal className="w-3.5 h-3.5 text-[#00FF41]" />, 
      action: () => {
        toggleAgentStatus('agent_1', 'ACTIVE');
        setCurrentNav('AGENTS');
      } 
    },
    { 
      label: 'Action: Create Policy (Open Compiler Prompt)', 
      category: 'Action', 
      icon: <ShieldCheck className="w-3.5 h-3.5 text-[#00FF41]" />, 
      action: () => setCurrentNav('POLICIES') 
    },
    { 
      label: 'Action: Run Benchmark (1,000 Deterministic Tests)', 
      category: 'Action', 
      icon: <Award className="w-3.5 h-3.5 text-[#00FF41]" />, 
      action: () => setCurrentNav('EVALUATION') 
    },
    { 
      label: 'Action: Inject Failure (Gateway Latency / Duplicate Webhook)', 
      category: 'Action', 
      icon: <Flame className="w-3.5 h-3.5 text-[#FF3D00]" />, 
      action: () => setCurrentNav('FAILURE_LAB') 
    },
    { 
      label: 'Action: Replay Transaction (Deterministic Trace)', 
      category: 'Action', 
      icon: <Terminal className="w-3.5 h-3.5 text-[#00FF41]" />, 
      action: () => {
        if (transactions[0]) {
          setSelectedTransaction(transactions[0]);
          setIsTransactionDrawerOpen(true);
        }
      } 
    },
    { 
      label: 'Action: Start Demo (Pitch Walkthrough)', 
      category: 'Action', 
      icon: <Terminal className="w-3.5 h-3.5 text-[#00FF41]" />, 
      action: () => setIsPitchModeOpen(true) 
    },
    { 
      label: 'Action: Reset Demo (Restore Canonical Baseline)', 
      category: 'Action', 
      icon: <Terminal className="w-3.5 h-3.5 text-[#FFA000]" />, 
      action: () => resetDemoState() 
    }
  ];

  const scenarioCommands = [
    { label: 'Scenario: 01 Safe Autonomous Purchase (Permit)', category: 'Simulation', icon: <Terminal className="w-3.5 h-3.5 text-[#00FF41]" />, action: () => triggerScenario('SCENARIO_1_SUCCESS') },
    { label: 'Scenario: 02 Margin Floor Breach 25% Discount (Block)', category: 'Simulation', icon: <Terminal className="w-3.5 h-3.5 text-[#FF3D00]" />, action: () => triggerScenario('SCENARIO_2_DISCOUNT_BLOCK') },
    { label: 'Scenario: 03 Refund Cap Exceeded Escalation (Review)', category: 'Simulation', icon: <Terminal className="w-3.5 h-3.5 text-[#FFA000]" />, action: () => triggerScenario('SCENARIO_3_APPROVAL_REQUIRED') },
    { label: 'Scenario: 04 Duplicate Webhook Deduplication (Idempotency)', category: 'Simulation', icon: <Terminal className="w-3.5 h-3.5 text-[#00FF41]" />, action: () => triggerScenario('SCENARIO_4_DUPLICATE_WEBHOOK') },
    { label: 'Scenario: 05 Razorpay Gateway Latency Recovery', category: 'Simulation', icon: <Terminal className="w-3.5 h-3.5 text-[#00FF41]" />, action: () => triggerScenario('SCENARIO_5_PAYMENT_VERIFICATION') },
    { label: 'Scenario: 06 Revenue Uplift Simulation (+24.6%)', category: 'Simulation', icon: <Terminal className="w-3.5 h-3.5 text-[#00FF41]" />, action: () => triggerScenario('SCENARIO_6_REVENUE_OPTIMIZATION') }
  ];

  const transactionCommands = transactions.map(t => ({
    label: `Inspect Transaction ${t.id} - ${t.actor} [${t.status}] - ₹${t.amount.toLocaleString('en-IN')}`,
    category: 'Transactions',
    icon: <Terminal className="w-3.5 h-3.5" />,
    action: () => {
      setSelectedTransaction(t);
      setIsTransactionDrawerOpen(true);
    }
  }));

  const policyCommands = policies.map(p => ({
    label: `Inspect Policy: ${p.name} (${p.category})`,
    category: 'Policies',
    icon: <ShieldCheck className="w-3.5 h-3.5" />,
    action: () => {
      setCurrentNav('POLICIES');
    }
  }));

  const allItems = [...navCommands, ...directActionCommands, ...scenarioCommands, ...transactionCommands, ...policyCommands];

  const filtered = query.trim() === '' 
    ? allItems 
    : allItems.filter(item => item.label.toLowerCase().includes(query.toLowerCase()) || item.category.toLowerCase().includes(query.toLowerCase()));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsCommandPaletteOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        setIsCommandPaletteOpen(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center pt-16 px-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-[#0E0E0E] border border-[#333] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Search Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#222] bg-[#141414]">
          <Search className="w-4 h-4 text-[#888] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, scenario, policy name, transaction ID, or agent..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm mono text-white placeholder-[#666] outline-none"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="text-[#666] hover:text-white p-1 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs mono text-[#666]">
              No commands matching "{query}"
            </div>
          ) : (
            filtered.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={index}
                  onClick={() => {
                    item.action();
                    setIsCommandPaletteOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-2.5 cursor-pointer mono text-xs transition border ${
                    isSelected
                      ? 'bg-[#1A1A1A] border-[#FF3D00] text-white'
                      : 'bg-[#0A0A0A] border-transparent text-[#AAA] hover:bg-[#141414]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-[9px] px-1.5 py-0.5 bg-[#111] border border-[#222] text-[#888]">
                      {item.category}
                    </span>
                    {isSelected && <ArrowRight className="w-3 h-3 text-[#FF3D00]" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-[#222] bg-[#0A0A0A] flex items-center justify-between text-[10px] mono text-[#666]">
          <div className="flex items-center gap-3">
            <span>[↑↓] Navigate</span>
            <span>[ENTER] Execute</span>
            <span>[ESC] Close</span>
          </div>
          <span>GUARDRAIL CORE CLI</span>
        </div>
      </div>
    </div>
  );
};
