import React from 'react';
import { DEMO_SCENARIOS } from '../../data/mockData';
import { DemoScenarioId } from '../../types';
import { Play, ChevronRight, X } from 'lucide-react';

interface DemoControllerProps {
  activeScenarioId: DemoScenarioId;
  onSelectScenario: (scenarioId: DemoScenarioId) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const DemoController: React.FC<DemoControllerProps> = ({
  activeScenarioId,
  onSelectScenario,
  isOpen,
  onToggle
}) => {
  return (
    <div className="relative z-40">
      {/* Floating Trigger Pill */}
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-1 bg-[#1A1A1A] border border-[#333] hover:border-[#FF3D00] text-[11px] mono text-[#E0E0E0] hover:text-white transition shadow-lg select-none"
      >
        <span className="w-2 h-2 bg-[#FF3D00]" />
        <span className="font-bold tracking-wider">[PITCH DEMO CONTROLLER]</span>
        <span className="text-[10px] px-1.5 py-0.2 bg-[#0A0A0A] border border-[#333] text-[#888]">
          {isOpen ? 'CLOSE' : '6 SCENARIOS'}
        </span>
      </button>

      {/* Expanded Scenario Selector Dropdown */}
      {isOpen && (
        <div className="absolute top-8 right-0 w-80 sm:w-96 p-3 bg-[#0E0E0E] border border-[#333] shadow-2xl space-y-2 mt-1">
          <div className="flex items-center justify-between pb-2 border-b border-[#222] text-[10px] mono text-[#888]">
            <span className="tracking-widest">DETERMINISTIC SIMULATION</span>
            <span className="text-[#00FF41]">[1-CLICK EXEC]</span>
          </div>

          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {DEMO_SCENARIOS.map((sc) => {
              const isSelected = activeScenarioId === sc.id;

              return (
                <button
                  key={sc.id}
                  onClick={() => onSelectScenario(sc.id)}
                  className={`w-full text-left p-2 border transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-[#1A1A1A] border-[#FF3D00] text-white shadow-md'
                      : 'bg-[#0A0A0A] border-[#222] text-[#AAA] hover:bg-[#141414] hover:border-[#444]'
                  }`}
                >
                  <span className={`w-5 h-5 flex items-center justify-center mono text-[10px] font-bold shrink-0 mt-0.5 ${
                    isSelected ? 'bg-[#FF3D00] text-black' : 'bg-[#222] text-[#888]'
                  }`}>
                    0{sc.stepNumber}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-[11px] mono truncate text-white">{sc.label}</span>
                      <span className="text-[9px] mono px-1 bg-[#1A1A1A] border border-[#333] text-[#00FF41] shrink-0">
                        {sc.badge}
                      </span>
                    </div>
                    <p className="text-[10px] mono text-[#888] line-clamp-1 mt-0.5">
                      {sc.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#222] text-[9px] mono text-[#666] text-center tracking-wider">
            Simulates real-time system events, policy enforcement, and Razorpay flows.
          </div>
        </div>
      )}
    </div>
  );
};
