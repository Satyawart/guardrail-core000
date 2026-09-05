import React, { useState } from 'react';
import { useGuardrail } from '../../context/GuardrailContext';
import { Search, Filter, Terminal, ArrowRight, ShieldCheck, CheckCircle, XCircle, AlertTriangle, RotateCcw, Download } from 'lucide-react';
import { Transaction } from '../../types';

export const TransactionsView: React.FC = () => {
  const { 
    transactions, 
    agents,
    setSelectedTransaction, 
    setIsTransactionDrawerOpen,
    replayTransaction,
    replayingTxId
  } = useGuardrail();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'BLOCKED' | 'REVIEW'>('ALL');
  const [agentFilter, setAgentFilter] = useState<string>('ALL');

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.id.toLowerCase().includes(search.toLowerCase()) ||
      tx.actor.toLowerCase().includes(search.toLowerCase()) ||
      tx.action.toLowerCase().includes(search.toLowerCase()) ||
      tx.merchantName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || tx.status === statusFilter;
    const matchesAgent = agentFilter === 'ALL' || tx.actorId === agentFilter;

    return matchesSearch && matchesStatus && matchesAgent;
  });

  const exportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Actor', 'Amount', 'Status', 'RiskScore', 'PolicyApplied', 'Merchant'];
    const rows = filteredTransactions.map(t => [
      t.id,
      t.timestamp,
      t.actor,
      t.amount,
      t.status,
      t.riskScore,
      t.policyApplied || '',
      t.merchantName
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `guardrail_transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="p-4 bg-[#0E0E0E] border border-[#222] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#FF3D00]" />
            <h1 className="text-base font-bold mono text-white tracking-wider">EVENT STREAM & TRANSACTION EXPLORER</h1>
            <span className="text-[10px] mono px-2 py-0.5 bg-[#1A1A1A] border border-[#333] text-[#888]">
              10-STEP DETERMINISTIC AUDIT
            </span>
          </div>
          <p className="text-xs mono text-[#888] mt-1">
            Real-time telemetry of all autonomous intent proposals, policy evaluations, and payment settlements.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1A] border border-[#333] hover:border-[#555] text-xs mono text-[#CCC] hover:text-white transition self-start md:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>EXPORT CSV</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-3 bg-[#0E0E0E] border border-[#222] grid grid-cols-1 sm:grid-cols-3 gap-3 mono text-xs">
        {/* Search */}
        <div className="flex items-center bg-[#0A0A0A] border border-[#222] px-3 py-1.5">
          <Search className="w-3.5 h-3.5 text-[#888] mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search by ID, agent, action, or merchant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-white placeholder-[#666] outline-none text-xs"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center bg-[#0A0A0A] border border-[#222] px-2 py-1">
          <span className="text-[10px] text-[#888] mr-2">STATUS:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-transparent text-white outline-none w-full text-xs"
          >
            <option value="ALL" className="bg-[#111]">ALL STATUSES</option>
            <option value="SUCCESS" className="bg-[#111]">PERMITTED (SUCCESS)</option>
            <option value="BLOCKED" className="bg-[#111]">BLOCKED (POLICY)</option>
            <option value="REVIEW" className="bg-[#111]">REVIEW (SUPERVISOR)</option>
          </select>
        </div>

        {/* Agent Filter */}
        <div className="flex items-center bg-[#0A0A0A] border border-[#222] px-2 py-1">
          <span className="text-[10px] text-[#888] mr-2">AGENT:</span>
          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="bg-transparent text-white outline-none w-full text-xs"
          >
            <option value="ALL" className="bg-[#111]">ALL RUNTIMES</option>
            {agents.map((ag) => (
              <option key={ag.id} value={ag.id} className="bg-[#111]">{ag.name} ({ag.id})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="border border-[#222] bg-[#0E0E0E] overflow-x-auto">
        <table className="w-full text-left mono text-xs">
          <thead className="bg-[#141414] border-b border-[#222] text-[10px] text-[#888]">
            <tr>
              <th className="p-3">TRANSACTION ID</th>
              <th className="p-3">ACTOR / AGENT</th>
              <th className="p-3">PROPOSED ACTION</th>
              <th className="p-3">AMOUNT</th>
              <th className="p-3">RISK SCORE</th>
              <th className="p-3">DECISION</th>
              <th className="p-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A1A1A]">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[#666]">
                  No transactions matching current filter criteria.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => {
                const isBlocked = tx.status === 'BLOCKED';
                const isReview = tx.status === 'REVIEW';
                const isPass = tx.status === 'SUCCESS' || tx.status === 'SETTLED';

                return (
                  <tr 
                    key={tx.id}
                    className="hover:bg-[#141414] transition cursor-pointer"
                    onClick={() => {
                      setSelectedTransaction(tx);
                      setIsTransactionDrawerOpen(true);
                    }}
                  >
                    <td className="p-3 font-bold text-white whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 ${isBlocked ? 'bg-[#FF3D00]' : isReview ? 'bg-[#FFA000]' : 'bg-[#00FF41]'}`} />
                        <span>{tx.id}</span>
                      </div>
                      <span className="text-[9px] text-[#666] block">{tx.timestamp.split('T')[1]?.split('.')[0] || '14:26:40'}</span>
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      <span className="text-white font-medium block">{tx.actor}</span>
                      <span className="text-[10px] text-[#888]">{tx.merchantName}</span>
                    </td>

                    <td className="p-3 max-w-xs">
                      <span className="text-[#CCC] truncate block">{tx.action}</span>
                      {tx.policyApplied && (
                        <span className="text-[9px] text-[#888]">Policy: {tx.policyApplied}</span>
                      )}
                    </td>

                    <td className="p-3 font-bold text-white whitespace-nowrap">
                      ₹{tx.amount.toLocaleString('en-IN')}
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      <span className={`font-bold ${tx.riskScore > 0.2 ? 'text-[#FF3D00]' : 'text-[#00FF41]'}`}>
                        {tx.riskScore.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-[#666] block">[{tx.riskLevel}]</span>
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      <span className={`text-[10px] px-2 py-0.5 border font-bold ${
                        isBlocked 
                          ? 'bg-[#FF3D00]/10 border-[#FF3D00] text-[#FF3D00]' 
                          : isReview 
                          ? 'bg-[#FFA000]/10 border-[#FFA000] text-[#FFA000]' 
                          : 'bg-[#00FF41]/10 border-[#00FF41] text-[#00FF41]'
                      }`}>
                        [{tx.status}]
                      </span>
                    </td>

                    <td className="p-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => replayTransaction(tx.id)}
                          disabled={replayingTxId === tx.id}
                          className="p-1.5 bg-[#141414] border border-[#333] hover:border-[#FF3D00] text-[#AAA] hover:text-white transition"
                          title="Replay Decision Lifecycle"
                        >
                          <RotateCcw className={`w-3 h-3 ${replayingTxId === tx.id ? 'animate-spin text-[#FF3D00]' : ''}`} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTransaction(tx);
                            setIsTransactionDrawerOpen(true);
                          }}
                          className="px-2.5 py-1 bg-[#1A1A1A] border border-[#333] hover:border-[#00FF41] text-[#00FF41] transition text-[11px]"
                        >
                          INSPECT
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
