import React, { useState, useRef, useEffect } from 'react';
import { useGuardrail } from '../../context/GuardrailContext';
import { Bell, Check, ExternalLink, ShieldAlert, CheckCircle, AlertTriangle, Cpu } from 'lucide-react';
import { NavItem } from '../../types';

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadNotificationsCount, markNotificationAsRead, clearAllNotifications, setCurrentNav } = useGuardrail();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (id: string, targetNav: NavItem) => {
    markNotificationAsRead(id);
    setCurrentNav(targetNav);
    setIsOpen(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'APPROVAL':
        return <AlertTriangle className="w-3.5 h-3.5 text-[#FF3D00]" />;
      case 'VIOLATION':
        return <ShieldAlert className="w-3.5 h-3.5 text-[#FF3D00]" />;
      case 'POLICY':
        return <CheckCircle className="w-3.5 h-3.5 text-[#00FF41]" />;
      case 'INCIDENT':
        return <Cpu className="w-3.5 h-3.5 text-[#FFA000]" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-[#888]" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 bg-[#141414] border border-[#333] hover:border-[#555] text-[#AAA] hover:text-white transition"
        title="Real-time Alerts & Escalations"
      >
        <Bell className="w-3.5 h-3.5" />
        {unreadNotificationsCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF3D00] text-black font-bold text-[9px] mono flex items-center justify-center">
            {unreadNotificationsCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-9 w-80 sm:w-96 bg-[#0E0E0E] border border-[#333] shadow-2xl z-50 animate-in fade-in slide-in-from-top-1">
          {/* Header */}
          <div className="p-3 border-b border-[#222] flex items-center justify-between mono text-[10px] text-[#888]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-wider">EVENT NOTIFICATIONS</span>
              <span className="text-[#00FF41]">[{unreadNotificationsCount} NEW]</span>
            </div>
            {unreadNotificationsCount > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-[9px] text-[#888] hover:text-[#00FF41] transition flex items-center gap-1"
              >
                <Check className="w-2.5 h-2.5" /> MARK ALL READ
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[#1A1A1A]">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-xs mono text-[#666]">
                No recent notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleItemClick(n.id, n.targetNav)}
                  className={`p-3 transition cursor-pointer hover:bg-[#141414] flex items-start gap-2.5 ${
                    !n.read ? 'bg-[#181412]/50' : 'bg-transparent'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-[11px] mono font-bold truncate ${!n.read ? 'text-white' : 'text-[#AAA]'}`}>
                        {n.title}
                      </span>
                      <span className="text-[9px] mono text-[#666] shrink-0">{n.timestamp}</span>
                    </div>
                    <p className="text-[10px] mono text-[#888] line-clamp-2 mt-0.5">
                      {n.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer link to Audit */}
          <div className="p-2 border-t border-[#222] bg-[#0A0A0A] text-center">
            <button
              onClick={() => {
                setCurrentNav('AUDIT');
                setIsOpen(false);
              }}
              className="text-[10px] mono text-[#888] hover:text-white transition flex items-center justify-center gap-1 mx-auto"
            >
              <span>VIEW FULL CRYPTOGRAPHIC AUDIT LOG</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
