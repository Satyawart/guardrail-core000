import React, { useState } from 'react';
import { X, Bot, ShieldCheck, AlertOctagon } from 'lucide-react';
import { useGuardrail } from '../../context/GuardrailContext';

interface AgentProvisionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AgentProvisionModal: React.FC<AgentProvisionModalProps> = ({ isOpen, onClose }) => {
  const { provisionAgent, addToast } = useGuardrail();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Procurement',
    spendLimit: '50000',
    discountMaxPercent: '10',
    refundMax: '5000'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast({ title: 'Validation Error', message: 'Agent Name is required', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      await provisionAgent({
        name: formData.name,
        type: formData.type,
        spendLimit: parseFloat(formData.spendLimit),
        discountMaxPercent: parseFloat(formData.discountMaxPercent),
        refundMax: parseFloat(formData.refundMax)
      });
      onClose();
      // Reset form
      setFormData({
        name: '',
        type: 'Procurement',
        spendLimit: '50000',
        discountMaxPercent: '10',
        refundMax: '5000'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0E0E0E] border border-[#333] shadow-2xl shadow-[#00FF41]/10 w-[90%] max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#141414] border-b border-[#222]">
          <div className="flex items-center gap-2 text-white">
            <Bot className="w-5 h-5 text-[#00FF41]" />
            <h2 className="font-bold mono tracking-wider text-sm">PROVISION NEW AGENT RUNTIME</h2>
          </div>
          <button onClick={onClose} className="text-[#888] hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <p className="text-xs text-[#888] mb-6 leading-relaxed mono">
            Deploy a new autonomous AI agent. Define its operational boundaries to guarantee cryptographic isolation within your merchant tenant.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Identity */}
            <div className="space-y-3">
              <h3 className="text-[10px] text-[#00FF41] font-bold tracking-widest uppercase border-b border-[#222] pb-1 flex items-center gap-1.5">
                <Bot className="w-3 h-3" /> AGENT IDENTITY
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-[#888] mono uppercase">Agent Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-[#0A0A0A] border border-[#333] px-3 py-2 text-sm text-white placeholder-[#444] focus:border-[#00FF41] outline-none mono transition"
                    placeholder="e.g. Support Bot X"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-[#888] mono uppercase">Role Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full bg-[#0A0A0A] border border-[#333] px-3 py-2 text-sm text-white focus:border-[#00FF41] outline-none mono transition appearance-none"
                  >
                    <option value="Procurement">Procurement</option>
                    <option value="Support">Support / Service</option>
                    <option value="Dynamic Quoting">Dynamic Quoting</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Custom">Custom Logic</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Authority Boundaries */}
            <div className="space-y-3 pt-2">
              <h3 className="text-[10px] text-[#00FF41] font-bold tracking-widest uppercase border-b border-[#222] pb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3" /> DETERMINISTIC AUTHORITY LIMITS
              </h3>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-[10px] text-[#888] mono uppercase">Spend Ceiling Limit (₹)</label>
                    <span className="text-[9px] text-[#666]">Hard block above this</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.spendLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, spendLimit: e.target.value }))}
                    className="w-full bg-[#0A0A0A] border border-[#333] px-3 py-2 text-sm text-white placeholder-[#444] focus:border-[#00FF41] outline-none mono transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#888] mono uppercase">Max Discount (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      required
                      value={formData.discountMaxPercent}
                      onChange={(e) => setFormData(prev => ({ ...prev, discountMaxPercent: e.target.value }))}
                      className="w-full bg-[#0A0A0A] border border-[#333] px-3 py-2 text-sm text-white placeholder-[#444] focus:border-[#00FF41] outline-none mono transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#888] mono uppercase">Max Refund (₹)</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={formData.refundMax}
                      onChange={(e) => setFormData(prev => ({ ...prev, refundMax: e.target.value }))}
                      className="w-full bg-[#0A0A0A] border border-[#333] px-3 py-2 text-sm text-white placeholder-[#444] focus:border-[#00FF41] outline-none mono transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer / Submit */}
            <div className="pt-6 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#FFA000] text-[9px] mono max-w-[200px]">
                <AlertOctagon className="w-3 h-3 shrink-0" />
                <span>Limits enforce strict transaction denial at the gateway level.</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#00FF41] hover:bg-[#00CC33] text-black font-bold text-xs mono transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? 'PROVISIONING...' : 'DEPLOY AGENT'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
