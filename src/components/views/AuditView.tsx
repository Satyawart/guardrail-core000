import React, { useState } from 'react';
import { useGuardrail } from '../../context/GuardrailContext';
import { Lock, Search, RotateCcw, CheckCircle, ShieldCheck, Download, Copy, Check } from 'lucide-react';
import { AuditRecord } from '../../types';

export const AuditView: React.FC = () => {
  const { auditLogs, replayTransaction, transactions, setSelectedTransaction, setIsTransactionDrawerOpen } = useGuardrail();
  const [search, setSearch] = useState('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const filteredLogs = auditLogs.filter(log => 
    log.id.toLowerCase().includes(search.toLowerCase()) ||
    log.event.toLowerCase().includes(search.toLowerCase()) ||
    log.actor.toLowerCase().includes(search.toLowerCase()) ||
    log.details.toLowerCase().includes(search.toLowerCase()) ||
    log.hash.toLowerCase().includes(search.toLowerCase())
  );

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="p-4 bg-[#0E0E0E] border border-[#222] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#00FF41]" />
            <h1 className="text-base font-bold mono text-white tracking-wider">IMMUTABLE CRYPTOGRAPHIC AUDIT TRAIL</h1>
            <span className="text-[10px] mono px-2 py-0.5 bg-[#1A1A1A] border border-[#333] text-[#00FF41]">
              SHA-256 ATTESTED
            </span>
          </div>
          <p className="text-xs mono text-[#888] mt-1">
            Every autonomous agent decision, policy check, supervisor override, and deduplicated event is cryptographically sealed in the audit ledger.
          </p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="p-3 bg-[#0E0E0E] border border-[#222] mono text-xs">
        <div className="flex items-center bg-[#0A0A0A] border border-[#222] px-3 py-1.5">
          <Search className="w-3.5 h-3.5 text-[#888] mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search audit records by ID, actor, event, hash, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-white placeholder-[#666] outline-none text-xs"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="border border-[#222] bg-[#0E0E0E] overflow-x-auto mono text-xs">
        <table className="w-full text-left">
          <thead className="bg-[#141414] border-b border-[#222] text-[10px] text-[#888]">
            <tr>
              <th className="p-3">LOG ID & TIME</th>
              <th className="p-3">EVENT TYPE</th>
              <th className="p-3">ACTOR</th>
              <th className="p-3">DECISION</th>
              <th className="p-3">CRYPTOGRAPHIC HASH</th>
              <th className="p-3">EVENT DETAILS</th>
              <th className="p-3 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A1A1A]">
            {filteredLogs.map((log) => {
              const isBlock = log.decision === 'BLOCK';
              const isPermit = log.decision === 'PERMIT' || log.decision === 'POLICY_UPDATE';
              const isReview = log.decision === 'REVIEW';

              return (
                <tr key={log.id} className="hover:bg-[#141414] transition">
                  <td className="p-3 whitespace-nowrap">
                    <span className="font-bold text-white block">{log.id}</span>
                    <span className="text-[9px] text-[#666]">{log.timestamp}</span>
                  </td>

                  <td className="p-3 font-medium text-[#AAA] whitespace-nowrap">
                    {log.event}
                  </td>

                  <td className="p-3 whitespace-nowrap text-[#888]">
                    {log.actor}
                  </td>

                  <td className="p-3 whitespace-nowrap">
                    <span className={`text-[9px] px-1.5 py-0.2 border font-bold ${
                      isBlock 
                        ? 'bg-[#FF3D00]/10 border-[#FF3D00] text-[#FF3D00]' 
                        : isReview 
                        ? 'bg-[#FFA000]/10 border-[#FFA000] text-[#FFA000]' 
                        : 'bg-[#00FF41]/10 border-[#00FF41] text-[#00FF41]'
                    }`}>
                      [{log.decision}]
                    </span>
                  </td>

                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#00FF41] text-[11px] font-mono">{log.hash}</span>
                      <button
                        onClick={() => copyHash(log.hash)}
                        className="text-[#666] hover:text-white"
                        title="Copy Hash"
                      >
                        {copiedHash === log.hash ? <Check className="w-3 h-3 text-[#00FF41]" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </td>

                  <td className="p-3 max-w-sm text-[#AAA] text-[11px]">
                    {log.details}
                  </td>

                  <td className="p-3 text-right whitespace-nowrap">
                    {log.transactionId && (
                      <button
                        onClick={() => replayTransaction(log.transactionId!)}
                        className="px-2 py-1 bg-[#1A1A1A] border border-[#333] hover:border-[#FF3D00] text-white text-[10px] transition flex items-center gap-1 ml-auto"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                        <span>REPLAY</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
