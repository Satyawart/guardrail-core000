import React, { useState } from 'react';
import { GuardrailProvider, useGuardrail } from './context/GuardrailContext';
import { AppShell } from './components/layout/AppShell';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthView } from './components/auth/AuthView';

// Hero Components
import { GuardrailCore3D } from './components/hero/GuardrailCore3D';
import { AIAgentInAction } from './components/hero/AIAgentInAction';
import { AgentAuthorityPanel } from './components/hero/AgentAuthorityPanel';
import { OrbitingSystemNodes } from './components/hero/OrbitingSystemNodes';

// Command Components
import { GlobalAlertBar } from './components/command/GlobalAlertBar';
import { KpiStrip } from './components/command/KpiStrip';
import { LiveTransactionFeed } from './components/command/LiveTransactionFeed';
import { RevenueIntelligence } from './components/command/RevenueIntelligence';
import { QuickActions } from './components/command/QuickActions';
import { SystemHealth } from './components/command/SystemHealth';

// Full Screen Dedicated Views
import { AgentsView } from './components/views/AgentsView';
import { TransactionsView } from './components/views/TransactionsView';
import { PoliciesView } from './components/views/PoliciesView';
import { ApprovalsView } from './components/views/ApprovalsView';
import { RiskView } from './components/views/RiskView';
import { FailureLabView } from './components/views/FailureLabView';
import { EvaluationView } from './components/views/EvaluationView';
import { RevenueView } from './components/views/RevenueView';
import { AuditView } from './components/views/AuditView';
import { SystemView } from './components/views/SystemView';
import { BeforeAfterView } from './components/views/BeforeAfterView';
import { LiveTransactionSimulator } from './components/LiveTransactionSimulator';

const DashboardContent: React.FC = () => {
  const { 
    currentNav, 
    setCurrentNav,
    transactions, 
    setSelectedTransaction, 
    setIsTransactionDrawerOpen,
    kpiMetrics,
    revenueData,
    agentAuthority,
    isLiveLoading
  } = useGuardrail();

  const [activeSystemNode, setActiveSystemNode] = useState<string | null>('AI_REASONING');

  // The active transaction currently shown in the action harness
  const activeHarnessTx = transactions[0];

  const handleOpenTransactionDrawer = (tx: any) => {
    setSelectedTransaction(tx);
    setIsTransactionDrawerOpen(true);
  };

  // Render view depending on navigation
  const renderCurrentView = () => {
    if (isLiveLoading) {
      return (
        <div className="h-full flex items-center justify-center min-h-[500px]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-10 w-10 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-blue-500 font-mono text-xs tracking-widest uppercase">SYNCING LIVE DATABASE...</p>
          </div>
        </div>
      );
    }

    switch (currentNav) {
      case 'AGENTS':
        return <AgentsView />;
      case 'TRANSACTIONS':
        return <TransactionsView />;
      case 'POLICIES':
        return <PoliciesView />;
      case 'APPROVALS':
        return <ApprovalsView />;
      case 'RISK':
        return <RiskView />;
      case 'FAILURE_LAB':
        return <FailureLabView />;
      case 'EVALUATION':
        return <EvaluationView />;
      case 'REVENUE':
        return <RevenueView />;
      case 'AUDIT':
        return <AuditView />;
      case 'SYSTEM':
        return <SystemView />;
      case 'BEFORE_AFTER':
        return <BeforeAfterView />;
      case 'OVERVIEW':
      default:
        return (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Global Real-time Alert & Notification Strip */}
            <GlobalAlertBar />

            {/* 1. Orbiting 6 System Subsystem Telemetry Nodes */}
            <OrbitingSystemNodes
              activeNodeId={activeSystemNode}
              onNodeClick={(id) => {
                setActiveSystemNode(id);
                if (id === 'POLICY_ENGINE') setCurrentNav('POLICIES');
                if (id === 'RISK_SCORING') setCurrentNav('RISK');
                if (id === 'IDEMPOTENCY_LEDGER') setCurrentNav('AUDIT');
                if (id === 'AUTONOMY_DISPATCH') setCurrentNav('AGENTS');
                if (id === 'SETTLEMENT_RAILS') setCurrentNav('TRANSACTIONS');
              }}
            />

            {/* 2. Central Core Hero Grid (Geometric 3-Column Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 w-full items-stretch">
              {/* Left: AI Agent in Action Harness */}
              <div className="lg:col-span-4 h-full min-h-[360px]">
                {activeHarnessTx ? (
                  <AIAgentInAction
                    activeTransaction={activeHarnessTx}
                    onInspectDetails={() => handleOpenTransactionDrawer(activeHarnessTx)}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center border border-white/5 bg-[#0a0a0a] rounded-lg p-6 text-center">
                     <p className="text-white/40 font-mono text-xs tracking-wider">AWAITING LIVE TRANSACTION</p>
                  </div>
                )}
              </div>

              {/* Center: GuardrailCore3D Holographic Visualizer */}
              <div className="lg:col-span-4 h-full min-h-[360px]">
                <GuardrailCore3D
                  statusText={
                    !activeHarnessTx
                      ? 'AI ALIGNMENT STATE: IDLE'
                      : activeHarnessTx.status === 'BLOCKED'
                      ? 'AI ALIGNMENT STATE: ACTION HALTED'
                      : activeHarnessTx.status === 'REVIEW'
                      ? 'AI ALIGNMENT STATE: SUPERVISOR ESCALATION'
                      : 'AI ALIGNMENT STATE: ACTIVE'
                  }
                />
              </div>

              {/* Right: Agent Authority Bounds Panel */}
              <div className="lg:col-span-4 h-full min-h-[360px]">
                <AgentAuthorityPanel authority={agentAuthority} />
              </div>
            </div>

            {/* 3. 6-Card KPI Strip */}
            <KpiStrip
              metrics={kpiMetrics}
              onKpiClick={(type) => {
                if (type === 'agents') setCurrentNav('AGENTS');
                if (type === 'approvals') setCurrentNav('APPROVALS');
                if (type === 'blocked') setCurrentNav('FAILURE_LAB');
                if (type === 'volume') setCurrentNav('REVENUE');
                if (type === 'violations') setCurrentNav('POLICIES');
              }}
            />

            {/* 4. Quick Action Signature Command Bar */}
            <QuickActions
              onOpenPolicyStudio={() => setCurrentNav('POLICIES')}
              onOpenAgentActivity={() => setCurrentNav('TRANSACTIONS')}
              onOpenFailureLab={() => setCurrentNav('FAILURE_LAB')}
              onOpenEvaluation={() => setCurrentNav('EVALUATION')}
            />

            {/* 5. Two-Column Analytical Matrix (Live Feed + Revenue Intelligence) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
              <LiveTransactionFeed
                transactions={transactions}
                onSelectTransaction={handleOpenTransactionDrawer}
              />
              <RevenueIntelligence data={revenueData} />
            </div>

            {/* 6. System Health & Telemetry Nodes */}
            <SystemHealth />
          </div>
        );
    }
  };

  return (
    <AppShell>
      {renderCurrentView()}
      {/* Live Transaction Simulator */}
      <LiveTransactionSimulator />
    </AppShell>
  );
};

const AppContent: React.FC = () => {
  const { session, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-blue-500 font-mono text-sm tracking-widest">INITIALIZING SECURE KERNEL...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <AuthView />;
  }

  return (
    <GuardrailProvider>
      <DashboardContent />
    </GuardrailProvider>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
