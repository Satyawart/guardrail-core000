import React, { useState } from 'react';
import { Transaction, TransactionStatus } from '../../types';
import { 
  Activity, 
  Search, 
  Filter, 
  ChevronRight 
} from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { formatINR, formatTime } from '../../utils/formatters';

interface LiveTransactionFeedProps {
  transactions: Transaction[];
  onSelectTransaction: (transaction: Transaction) => void;
}

export const LiveTransactionFeed: React.FC<LiveTransactionFeedProps> = ({
  transactions,
  onSelectTransaction
}) => {
  const [filter, setFilter] = useState<'ALL' | 'SUCCESS' | 'BLOCKED' | 'REVIEW'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter = filter === 'ALL' || tx.status === filter;
    const matchesSearch = 
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.merchantName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-[#0E0E0E] p-4 border border-[#222] flex flex-col h-full">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-[#222]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-[#FF3D00]" />
          <div>
            <h3 className="font-bold text-xs mono text-white flex items-center gap-2 tracking-wider">
              REAL-TIME AUTONOMY LOG
              <span className="text-[9px] mono px-1 bg-[#1A1A1A] border border-[#333] text-[#00FF41]">
                [RECORDING]
              </span>
            </h3>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-[#0A0A0A] p-0.5 border border-[#222] text-[10px] mono">
          {(['ALL', 'SUCCESS', 'BLOCKED', 'REVIEW'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2 py-0.5 transition ${
                filter === tab
                  ? 'bg-[#1A1A1A] text-white border border-[#333] font-bold'
                  : 'text-[#888] hover:text-[#CCC]'
              }`}
            >
              {tab === 'ALL' ? 'ALL' : tab === 'SUCCESS' ? 'PERMITTED' : tab === 'BLOCKED' ? 'BLOCKED' : 'REVIEW'}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 max-h-[360px] pr-1">
        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center text-[#666] mono text-xs border border-dashed border-[#222]">
            No transaction events matching criteria.
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              onClick={() => onSelectTransaction(tx)}
              className="group p-2.5 bg-[#0A0A0A] hover:bg-[#141414] border border-[#222] hover:border-[#444] transition cursor-pointer flex items-center justify-between gap-3 relative overflow-hidden"
            >
              {/* Left Stripe Indicator */}
              <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${
                tx.status === 'SUCCESS'
                  ? 'bg-[#00FF41]'
                  : tx.status === 'BLOCKED'
                  ? 'bg-[#FF3D00]'
                  : tx.status === 'REVIEW'
                  ? 'bg-[#FFB52E]'
                  : 'bg-white'
              }`} />

              <div className="flex items-center gap-3 min-w-0 pl-1.5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] mono text-[#666]">
                      {formatTime(tx.timestamp)}
                    </span>
                    <span className="text-xs font-bold mono text-[#E0E0E0] group-hover:text-white truncate">
                      {tx.action}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#888] mono mt-0.5 truncate">
                    <span className="text-white">{tx.actor}</span>
                    <span>•</span>
                    <span>{tx.merchantName}</span>
                    <span>•</span>
                    <span className="text-[#666]">{tx.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-xs font-bold mono text-white">
                    {tx.amount > 0 ? formatINR(tx.amount) : 'RULE'}
                  </div>
                  <div className="mt-0.5">
                    <StatusBadge status={tx.status} size="sm" />
                  </div>
                </div>

                <ChevronRight className="w-3.5 h-3.5 text-[#666] group-hover:text-white transition" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Feed Footer */}
      <div className="mt-3 pt-2.5 border-t border-[#222] flex items-center justify-between text-[9px] mono text-[#888]">
        <span className="flex items-center gap-1.5 text-[#00FF41]">
          <span className="w-1.5 h-1.5 bg-[#00FF41]" />
          AUTONOMOUS VERIFICATION ACTIVE
        </span>
        <span className="text-[#666]">CLICK TO INSPECT LIFECYCLE</span>
      </div>
    </div>
  );
};
