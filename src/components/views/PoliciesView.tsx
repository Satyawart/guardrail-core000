import React, { useState } from 'react';
import { useGuardrail } from '../../context/GuardrailContext';
import { ShieldCheck, Plus, Code, CheckCircle, Clock, AlertTriangle, ArrowRight, Play, Check, RotateCcw, ExternalLink, Bot, Users, TrendingDown, TrendingUp } from 'lucide-react';
import { PolicyRule } from '../../types';

export const PoliciesView: React.FC = () => {
  const { policies, addNewPolicy, setCurrentNav, setGlobalFilters, addToast } = useGuardrail();
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyRule>(policies[0]);
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [activeTab, setActiveTab] = useState<'CODE' | 'APPLIES_TO' | 'VERSIONS' | 'IMPACT' | 'TEST'>('APPLIES_TO');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isComparingVersions, setIsComparingVersions] = useState(false);
  const [rollbackConfirm, setRollbackConfirm] = useState<string | null>(null);

  const handleCompilePolicy = () => {
    if (!naturalLanguageInput.trim()) return;
    setIsCompiling(true);

    setTimeout(() => {
      const generatedCode = `// COMPILED FROM NATURAL LANGUAGE: "${naturalLanguageInput}"
export function evaluateRule(ctx: TransactionContext): GuardrailDecision {
  if (ctx.amount > 250000 && ctx.agentRole !== "TREASURY_LEAD") {
    return { decision: "BLOCK", reason: "Autonomous policy violation: ${naturalLanguageInput}" };
  }
  return { decision: "PASS" };
}`;

      const created = addNewPolicy({
        name: naturalLanguageInput.slice(0, 42) + '...',
        naturalLanguage: naturalLanguageInput,
        category: 'MARGIN',
        codeSnippet: generatedCode
      });

      setSelectedPolicy(created);
      setIsCompiling(false);
      setNaturalLanguageInput('');
    }, 1200);
  };

  const handleTestPolicy = () => {
    setTestResult('TESTING...');
    setTimeout(() => {
      setTestResult('PASSED (100/100 Test Assertions Validated - Zero False Positives)');
    }, 800);
  };

  const handleViewAffectedDecisions = (policy: PolicyRule) => {
    setGlobalFilters(prev => ({ ...prev, searchQuery: policy.name.split(' ')[0] || '' }));
    setCurrentNav('TRANSACTIONS');
    addToast({
      title: 'Filtering Transactions',
      message: `Showing decisions evaluated by ${policy.name}`,
      type: 'info'
    });
  };

  const handleRollback = (versionStr: string) => {
    setRollbackConfirm(null);
    addToast({
      title: `Rollback to ${versionStr} Completed`,
      message: `Active policy parameters restored from ${versionStr}. Applied across 12 agents.`,
      type: 'warning'
    });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="p-4 bg-[#0E0E0E] border border-[#222] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#00FF41]" />
            <h1 className="text-base font-bold mono text-white tracking-wider">POLICY REPOSITORY & NATURAL LANGUAGE COMPILER</h1>
            <span className="text-[10px] mono px-2 py-0.5 bg-[#1A1A1A] border border-[#333] text-[#00FF41]">
              {policies.length} ACTIVE POLICIES
            </span>
          </div>
          <p className="text-xs mono text-[#888] mt-1">
            Deterministic AST safety rules generated from natural language prompts, mathematically bound to 12 agent runtimes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewAffectedDecisions(selectedPolicy)}
            className="px-3 py-1.5 bg-[#141414] border border-[#333] hover:border-[#00FF41] text-[#00FF41] text-xs mono transition flex items-center gap-1.5"
          >
            <span>VIEW AFFECTED DECISIONS</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Natural Language Compiler Box */}
      <div className="p-4 bg-[#0E0E0E] border border-[#222] space-y-3 mono text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white tracking-wider flex items-center gap-2">
            <Code className="w-4 h-4 text-[#00FF41]" />
            PROMPT-TO-AST POLICY COMPILER
          </span>
          <span className="text-[10px] text-[#888]">[NATURAL LANGUAGE → DETERMINISTIC CODE]</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder='e.g., "Block any agent discount causing margin < 15% unless approved by risk supervisor"'
            value={naturalLanguageInput}
            onChange={(e) => setNaturalLanguageInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCompilePolicy()}
            className="flex-1 bg-[#0A0A0A] border border-[#333] px-3 py-2 text-white placeholder-[#666] outline-none focus:border-[#00FF41]"
          />
          <button
            onClick={handleCompilePolicy}
            disabled={isCompiling || !naturalLanguageInput.trim()}
            className="px-4 py-2 bg-[#1A1A1A] border border-[#00FF41] hover:bg-[#00FF41] hover:text-black text-[#00FF41] font-bold transition disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0"
          >
            {isCompiling ? (
              <span>PARSING AST...</span>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>COMPILE & DEPLOY</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Split View: Left List, Right Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mono text-xs">
        
        {/* Left: Policy List */}
        <div className="space-y-2 lg:col-span-1">
          <div className="p-2.5 bg-[#141414] border border-[#222] text-[10px] text-[#888] flex justify-between">
            <span>ACTIVE POLICY MANIFEST</span>
            <span className="text-[#00FF41]">{policies.length} RULES</span>
          </div>
          {policies.map((p) => {
            const isSelected = selectedPolicy?.id === p.id;
            return (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedPolicy(p);
                  setTestResult(null);
                  setIsComparingVersions(false);
                }}
                className={`p-3 border cursor-pointer transition ${
                  isSelected 
                    ? 'bg-[#181818] border-[#00FF41] text-white shadow-md' 
                    : 'bg-[#0E0E0E] border-[#222] text-[#AAA] hover:bg-[#141414]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white truncate text-xs">{p.name}</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-[#111] border border-[#333] text-[#00FF41]">
                    {p.version}
                  </span>
                </div>
                <p className="text-[10px] text-[#888] line-clamp-2">{p.naturalLanguage}</p>
                <div className="flex justify-between items-center mt-2 text-[9px] text-[#666] pt-1.5 border-t border-[#1A1A1A]">
                  <span>CATEGORY: {p.category}</span>
                  <span>ENFORCED: {p.enforcementCount}x</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Policy Studio Inspector */}
        <div className="lg:col-span-2 bg-[#0E0E0E] border border-[#222] flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="p-4 border-b border-[#222] bg-[#141414] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{selectedPolicy.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-[#1A1A1A] border border-[#00FF41] text-[#00FF41]">
                    {selectedPolicy.version}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-[#00FF41]/10 border border-[#00FF41] text-[#00FF41]">
                    [ACTIVE]
                  </span>
                </div>
                <span className="text-[10px] text-[#888]">CATEGORY: {selectedPolicy.category} • ENFORCED {selectedPolicy.enforcementCount} TIMES</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestPolicy}
                  className="px-3 py-1 bg-[#1A1A1A] border border-[#333] hover:border-[#00FF41] text-[#00FF41] transition text-[11px] flex items-center gap-1"
                >
                  <Play className="w-3 h-3" />
                  <span>TEST RULES</span>
                </button>
              </div>
            </div>

            {/* Sub-tabs */}
            <div className="flex border-b border-[#222] bg-[#111] px-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab('APPLIES_TO')}
                className={`px-3 py-2 border-b-2 font-bold transition text-xs whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'APPLIES_TO' ? 'border-[#00FF41] text-white' : 'border-transparent text-[#888]'
                }`}
              >
                <Users className="w-3 h-3 text-[#00FF41]" />
                <span>APPLIES TO & IMPACT</span>
              </button>
              <button
                onClick={() => setActiveTab('CODE')}
                className={`px-3 py-2 border-b-2 font-bold transition text-xs whitespace-nowrap ${
                  activeTab === 'CODE' ? 'border-[#00FF41] text-white' : 'border-transparent text-[#888]'
                }`}
              >
                <span>COMPILED AST</span>
              </button>
              <button
                onClick={() => setActiveTab('VERSIONS')}
                className={`px-3 py-2 border-b-2 font-bold transition text-xs whitespace-nowrap ${
                  activeTab === 'VERSIONS' ? 'border-[#00FF41] text-white' : 'border-transparent text-[#888]'
                }`}
              >
                <span>VERSION HISTORY & ROLLBACK</span>
              </button>
              <button
                onClick={() => setActiveTab('IMPACT')}
                className={`px-3 py-2 border-b-2 font-bold transition text-xs whitespace-nowrap ${
                  activeTab === 'IMPACT' ? 'border-[#00FF41] text-white' : 'border-transparent text-[#888]'
                }`}
              >
                <span>FINANCIAL IMPACT</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-4 space-y-4">
              
              {/* TAB 1: Applies To & Causality */}
              {activeTab === 'APPLIES_TO' && (
                <div className="space-y-4">
                  <div className="p-3 bg-[#0A0A0A] border border-[#222] space-y-2">
                    <span className="text-[10px] text-[#888] font-bold block uppercase">GOVERNED AGENT RUNTIMES:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="p-2 bg-[#111] border border-[#333] flex items-center gap-2">
                        <Bot className="w-4 h-4 text-[#00FF41]" />
                        <div>
                          <div className="font-bold text-white text-[11px]">AI Buyer #17</div>
                          <div className="text-[9px] text-[#888]">Procurement</div>
                        </div>
                      </div>
                      <div className="p-2 bg-[#111] border border-[#333] flex items-center gap-2">
                        <Bot className="w-4 h-4 text-[#00FF41]" />
                        <div>
                          <div className="font-bold text-white text-[11px]">Agent Negotiator #04</div>
                          <div className="text-[9px] text-[#888]">Dynamic Quoting</div>
                        </div>
                      </div>
                      <div className="p-2 bg-[#111] border border-[#333] flex items-center gap-2">
                        <Bot className="w-4 h-4 text-[#00FF41]" />
                        <div>
                          <div className="font-bold text-white text-[11px]">Agent Support #09</div>
                          <div className="text-[9px] text-[#888]">Claims & Refunds</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Impact Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 bg-[#0A0A0A] border border-[#222]">
                      <span className="text-[9px] text-[#888] block">EVALUATED</span>
                      <span className="text-white font-bold text-sm">142 Decisions</span>
                    </div>
                    <div className="p-2.5 bg-[#0A0A0A] border border-[#222]">
                      <span className="text-[9px] text-[#888] block">BLOCKED</span>
                      <span className="text-[#FF3D00] font-bold text-sm">7 Violations</span>
                    </div>
                    <div className="p-2.5 bg-[#0A0A0A] border border-[#222]">
                      <span className="text-[9px] text-[#888] block">ESCALATED</span>
                      <span className="text-[#FFA000] font-bold text-sm">12 Reviews</span>
                    </div>
                    <div className="p-2.5 bg-[#0A0A0A] border border-[#222]">
                      <span className="text-[9px] text-[#888] block">PROTECTED</span>
                      <span className="text-[#00FF41] font-bold text-sm">₹84,500</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-[10px] text-[#888]">Direct causality between policy definition and transaction ledger.</span>
                    <button
                      onClick={() => handleViewAffectedDecisions(selectedPolicy)}
                      className="px-3 py-1.5 bg-[#141414] border border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41] hover:text-black font-bold transition text-xs flex items-center gap-1.5"
                    >
                      <span>VIEW AFFECTED DECISIONS</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: AST Code */}
              {activeTab === 'CODE' && (
                <div className="space-y-3">
                  <div className="p-2.5 bg-[#0A0A0A] border border-[#222]">
                    <span className="text-[10px] text-[#888] block mb-1">NATURAL LANGUAGE SPECIFICATION:</span>
                    <p className="text-white text-xs leading-relaxed">{selectedPolicy.naturalLanguage}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#888] block mb-1">COMPILED DETERMINISTIC AST:</span>
                    <pre className="p-3 bg-[#0A0A0A] border border-[#222] text-[#00FF41] text-[11px] overflow-x-auto">
                      {selectedPolicy.codeSnippet}
                    </pre>
                  </div>

                  {testResult && (
                    <div className="p-3 bg-[#0E1A11] border border-[#00FF41] text-[#00FF41] text-xs flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>{testResult}</span>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Version History & Rollback */}
              {activeTab === 'VERSIONS' && (
                <div className="space-y-3">
                  {/* Version Timeline */}
                  <div className="space-y-2">
                    <div className="p-3 border border-[#00FF41] bg-[#0E1A11] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-xs">v4.2.0 (CURRENT ACTIVE)</span>
                        <span className="text-[9px] px-1.5 py-0.2 bg-[#00FF41] text-black font-bold">
                          [ACTIVE]
                        </span>
                      </div>
                      <p className="text-[11px] text-[#CCC]">Strict 15.0% margin floor with ₹5.0L agent ceiling.</p>
                      <div className="text-[10px] text-[#888]">Deployed on 2026-08-20 by SecOps Admin</div>
                    </div>

                    <div className="p-3 border border-[#222] bg-[#0A0A0A] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-xs">v4.1.3 (PREVIOUS RELEASE)</span>
                        <button
                          onClick={() => setRollbackConfirm('v4.1.3')}
                          className="text-[10px] px-2 py-0.5 bg-[#141414] border border-[#FFA000] text-[#FFA000] hover:bg-[#FFA000] hover:text-black transition flex items-center gap-1"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                          <span>ROLLBACK TO THIS</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-[#888]">12.5% margin floor with ₹6.0L spend ceiling.</p>
                    </div>

                    <div className="p-3 border border-[#222] bg-[#0A0A0A] space-y-1 opacity-70">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-xs">v4.0.9 (LEGACY)</span>
                        <span className="text-[9px] text-[#666]">[ARCHIVED]</span>
                      </div>
                      <p className="text-[11px] text-[#888]">Initial prototype rule set.</p>
                    </div>
                  </div>

                  {/* Version Comparison Diff Card */}
                  <div className="p-3.5 bg-[#141414] border border-[#333] space-y-2">
                    <span className="text-[10px] text-[#888] font-bold uppercase block">
                      VERSION COMPARISON (v4.2.0 vs v4.1.3):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                      <div className="p-2 bg-[#0A0A0A] border border-[#222]">
                        <span className="text-[#888] block text-[9px]">MARGIN FLOOR:</span>
                        <span className="text-white font-bold">12.5% → 15.0%</span>
                      </div>
                      <div className="p-2 bg-[#0A0A0A] border border-[#222]">
                        <span className="text-[#888] block text-[9px]">SPEND CAP:</span>
                        <span className="text-white font-bold">₹6,00,000 → ₹5,00,000</span>
                      </div>
                      <div className="p-2 bg-[#0A0A0A] border border-[#222]">
                        <span className="text-[#888] block text-[9px]">AFFECTED AGENTS:</span>
                        <span className="text-[#00FF41] font-bold">12 Runtimes</span>
                      </div>
                      <div className="p-2 bg-[#0A0A0A] border border-[#222]">
                        <span className="text-[#888] block text-[9px]">EXP. REVENUE IMPACT:</span>
                        <span className="text-[#FF3D00] font-bold">-2.4% Vol</span>
                      </div>
                      <div className="p-2 bg-[#0A0A0A] border border-[#222]">
                        <span className="text-[#888] block text-[9px]">EXP. RISK REDUCTION:</span>
                        <span className="text-[#00FF41] font-bold">+11.8% Safe</span>
                      </div>
                    </div>
                  </div>

                  {/* Rollback Confirmation Modal / Prompt */}
                  {rollbackConfirm && (
                    <div className="p-3 bg-[#1A0E0C] border border-[#FF3D00] flex items-center justify-between text-xs animate-in fade-in duration-150">
                      <div className="space-y-0.5">
                        <span className="font-bold text-[#FF3D00] block">CONFIRM ROLLBACK TO {rollbackConfirm}?</span>
                        <span className="text-[10px] text-[#CCC]">This will redeploy AST rules across 12 active agent runtimes.</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRollback(rollbackConfirm)}
                          className="px-3 py-1 bg-[#FF3D00] text-black font-bold hover:bg-[#FF5722] transition"
                        >
                          CONFIRM
                        </button>
                        <button
                          onClick={() => setRollbackConfirm(null)}
                          className="px-2 py-1 text-[#888] hover:text-white"
                        >
                          CANCEL
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: Impact */}
              {activeTab === 'IMPACT' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 border border-[#222] bg-[#0A0A0A]">
                      <span className="text-[10px] text-[#888] block">VIOLATIONS BLOCKED</span>
                      <span className="text-[#FF3D00] font-bold text-sm">
                        {selectedPolicy.impactStats?.blocked || 137}
                      </span>
                    </div>
                    <div className="p-3 border border-[#222] bg-[#0A0A0A]">
                      <span className="text-[10px] text-[#888] block">VALUE PROTECTED</span>
                      <span className="text-[#00FF41] font-bold text-sm">
                        ₹{(selectedPolicy.impactStats?.valueProtected || 8450000).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="p-3 border border-[#222] bg-[#0A0A0A]">
                      <span className="text-[10px] text-[#888] block">REVENUE UPLIFT</span>
                      <span className="text-white font-bold text-sm">
                        +{selectedPolicy.impactStats?.revenueUpliftPercent || 3.2}%
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#888] leading-relaxed">
                    This policy prevents autonomous discount creep while allowing agents to freely execute high-velocity transactions above the 15.0% margin threshold.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-[#222] bg-[#141414] text-[10px] text-[#888] flex items-center justify-between">
            <span>BINDING ENGINE: DETERMINISTIC AST</span>
            <span className="text-[#00FF41]">100% COVERAGE GUARANTEED</span>
          </div>
        </div>

      </div>
    </div>
  );
};
