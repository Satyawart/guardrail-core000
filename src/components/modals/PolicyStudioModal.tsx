import React, { useState } from 'react';
import { PolicyRule } from '../../types';
import { INITIAL_POLICIES } from '../../data/mockData';
import { X, Plus, ShieldCheck, Code, Sparkles, CheckCircle2 } from 'lucide-react';

interface PolicyStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPolicy?: (policy: PolicyRule) => void;
}

export const PolicyStudioModal: React.FC<PolicyStudioModalProps> = ({
  isOpen,
  onClose,
  onAddPolicy
}) => {
  const [policies, setPolicies] = useState<PolicyRule[]>(INITIAL_POLICIES);
  const [prompt, setPrompt] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [compiledRule, setCompiledRule] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCompile = () => {
    if (!prompt.trim()) return;
    setIsCompiling(true);
    setTimeout(() => {
      setIsCompiling(false);
      setCompiledRule(`// DETERMINISTIC COMPILED GUARDRAIL RULE\nexport function enforcePolicy(context: TransactionContext): Decision {\n  if (context.proposedDiscount > 0.12 && context.netMargin < 0.15) {\n    return { decision: "BLOCK", code: "MARGIN_FLOOR_VIOLATION" };\n  }\n  return { decision: "PASS" };\n}`);
    }, 600);
  };

  const handleSavePolicy = () => {
    if (!prompt.trim()) return;
    const newPol: PolicyRule = {
      id: `pol_custom_${Date.now()}`,
      name: prompt.slice(0, 40) + '...',
      naturalLanguage: prompt,
      category: 'MARGIN',
      status: 'ACTIVE',
      version: 'v4.2.1',
      enforcementCount: 0,
      codeSnippet: compiledRule || 'if (margin < 0.15) return BLOCK()'
    };
    setPolicies([newPol, ...policies]);
    if (onAddPolicy) onAddPolicy(newPol);
    setPrompt('');
    setCompiledRule(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-[#0A0A0A] border border-[#333] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-xs mono">
        {/* Header */}
        <div className="p-4 border-b border-[#222] bg-[#0E0E0E] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 bg-[#00FF41]" />
            <h2 className="text-sm font-bold text-white tracking-wider">
              POLICY STUDIO &amp; DETERMINISTIC COMPILER
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-[#141414] border border-[#222] text-[#888] hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Natural Language Input */}
          <div className="p-3.5 bg-[#0E0E0E] border border-[#222] space-y-2">
            <div className="flex items-center justify-between text-[#888]">
              <span className="font-bold text-white">WRITE NATURAL LANGUAGE MERCHANT POLICY:</span>
              <span className="text-[#00FF41]">[LLM COMPILER ACTIVE]</span>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Block all AI agent discount requests that reduce net margin below 15.0% or exceed ₹5,00,000 single transaction spend limit."
              className="w-full h-20 p-2.5 bg-[#0A0A0A] border border-[#222] text-white focus:outline-none focus:border-[#00FF41] resize-none"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-[#666]">
                Translates plain English merchant intent into verified code.
              </span>
              <button
                type="button"
                onClick={handleCompile}
                disabled={isCompiling || !prompt.trim()}
                className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#222] border border-[#333] hover:border-[#00FF41] text-white transition disabled:opacity-50"
              >
                {isCompiling ? 'COMPILING...' : 'COMPILE TO DETERMINISTIC CODE'}
              </button>
            </div>

            {/* Compiled Code Preview */}
            {compiledRule && (
              <div className="mt-3 p-3 bg-[#050505] border border-[#00FF41]/30">
                <div className="flex items-center justify-between text-[10px] text-[#00FF41] mb-1.5 font-bold">
                  <span>✓ COMPILED CODE READY</span>
                  <button
                    onClick={handleSavePolicy}
                    className="px-2 py-1 bg-[#00FF41] text-black font-bold hover:bg-[#34d399] transition"
                  >
                    DEPLOY TO LIVE GUARDRAILS
                  </button>
                </div>
                <pre className="text-[10px] text-[#AAA] overflow-x-auto p-2 bg-[#0A0A0A] border border-[#222]">
                  {compiledRule}
                </pre>
              </div>
            )}
          </div>

          {/* Active Policies List */}
          <div>
            <div className="flex items-center justify-between mb-2 text-[#888]">
              <span className="font-bold text-white tracking-wider">ACTIVE DETERMINISTIC POLICIES ({policies.length})</span>
              <span className="text-[#00FF41]">100% BOUND</span>
            </div>

            <div className="space-y-2">
              {policies.map((p) => (
                <div key={p.id} className="p-3 bg-[#0E0E0E] border border-[#222]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white">{p.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-[#00FF41]/10 border border-[#00FF41]/40 text-[#00FF41]">
                      [{p.category}]
                    </span>
                  </div>
                  <p className="text-[#888] text-[10px] mb-2">{p.naturalLanguage}</p>
                  <pre className="p-1.5 bg-[#0A0A0A] border border-[#222] text-[9px] text-[#666] overflow-x-auto">
                    {p.codeSnippet}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#222] bg-[#0E0E0E] flex items-center justify-between">
          <span className="text-[#666]">POLICY REPOSITORY v4.2.0</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#1A1A1A] hover:bg-[#222] border border-[#333] text-white"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
