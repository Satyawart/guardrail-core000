import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Transaction, 
  KpiMetric, 
  PolicyRule, 
  ApprovalRequest, 
  FailureScenario, 
  RevenueMetric, 
  SystemHealthItem, 
  DemoScenarioId,
  AgentRuntime,
  AuditRecord,
  NotificationItem,
  NavItem
} from '../types';
import { 
  INITIAL_KPIS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_POLICIES, 
  INITIAL_APPROVALS, 
  INITIAL_AGENTS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_NOTIFICATIONS, 
  REVENUE_INTELLIGENCE_DATA, 
  SYSTEM_HEALTH_ITEMS,
  PRIMARY_AGENT_AUTHORITY
} from '../data/mockData';

interface GlobalFilters {
  timeRange: '1H' | '24H' | '7D' | '30D';
  selectedAgentId: string | 'ALL';
  selectedStatus: string | 'ALL';
  searchQuery: string;
}

interface GuardrailContextType {
  // Navigation & View
  currentNav: NavItem;
  setCurrentNav: (nav: NavItem) => void;

  // Active Data Collections
  transactions: Transaction[];
  policies: PolicyRule[];
  approvals: ApprovalRequest[];
  agents: AgentRuntime[];
  auditLogs: AuditRecord[];
  kpiMetrics: KpiMetric[];
  revenueData: RevenueMetric;
  systemHealth: SystemHealthItem[];
  agentAuthority: typeof PRIMARY_AGENT_AUTHORITY;
  notifications: NotificationItem[];
  unreadNotificationsCount: number;

  // Selection & Inspector State
  selectedTransaction: Transaction | null;
  setSelectedTransaction: (tx: Transaction | null) => void;
  isTransactionDrawerOpen: boolean;
  setIsTransactionDrawerOpen: (open: boolean) => void;
  selectedAgent: AgentRuntime | null;
  setSelectedAgent: (agent: AgentRuntime | null) => void;

  // Global Flags & Controller
  activeScenarioId: DemoScenarioId;
  isTestMode: boolean;
  toggleTestMode: () => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isPitchModeOpen: boolean;
  setIsPitchModeOpen: (open: boolean) => void;
  globalFilters: GlobalFilters;
  setGlobalFilters: React.Dispatch<React.SetStateAction<GlobalFilters>>;

  // Actions & Operations
  triggerScenario: (scenarioId: DemoScenarioId) => void;
  approveRequest: (approvalId: string) => void;
  rejectRequest: (approvalId: string, reason?: string) => void;
  addNewPolicy: (policy: Partial<PolicyRule>) => PolicyRule;
  updatePolicy: (policyId: string, updates: Partial<PolicyRule>) => void;
  toggleAgentStatus: (agentId: string, newStatus: 'ACTIVE' | 'PAUSED' | 'BLOCKED') => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  resetDemoState: () => void;
  replayTransaction: (txId: string) => void;
  replayingTxId: string | null;
  addToast: (toast: { title: string; message: string; type?: 'success' | 'warning' | 'error' | 'info' }) => void;
  toast: { title: string; message: string; type?: 'success' | 'warning' | 'error' | 'info' } | null;
}

const GuardrailContext = createContext<GuardrailContextType | undefined>(undefined);

export const GuardrailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentNav, setCurrentNav] = useState<NavItem>('OVERVIEW');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [policies, setPolicies] = useState<PolicyRule[]>(INITIAL_POLICIES);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(INITIAL_APPROVALS);
  const [agents, setAgents] = useState<AgentRuntime[]>(INITIAL_AGENTS);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>(INITIAL_AUDIT_LOGS);
  const [kpiMetrics, setKpiMetrics] = useState<KpiMetric[]>(INITIAL_KPIS);
  const [revenueData, setRevenueData] = useState<RevenueMetric>(REVENUE_INTELLIGENCE_DATA);
  const [systemHealth, setSystemHealth] = useState<SystemHealthItem[]>(SYSTEM_HEALTH_ITEMS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Inspector & Modal States
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isTransactionDrawerOpen, setIsTransactionDrawerOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentRuntime | null>(null);
  const [activeScenarioId, setActiveScenarioId] = useState<DemoScenarioId>('SCENARIO_1_SUCCESS');
  const [isTestMode, setIsTestMode] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isPitchModeOpen, setIsPitchModeOpen] = useState(false);
  const [replayingTxId, setReplayingTxId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ title: string; message: string; type?: 'success' | 'warning' | 'error' | 'info' } | null>(null);

  const [globalFilters, setGlobalFilters] = useState<GlobalFilters>({
    timeRange: '24H',
    selectedAgentId: 'ALL',
    selectedStatus: 'ALL',
    searchQuery: ''
  });

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const addToast = (t: { title: string; message: string; type?: 'success' | 'warning' | 'error' | 'info' }) => {
    setToast(t);
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Keyboard shortcut for Command Palette (CMD+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTestMode = () => {
    setIsTestMode(prev => {
      const next = !prev;
      addToast({
        title: next ? 'Razorpay Testnet Activated' : 'Simulation Mode Activated',
        message: next ? 'Transactions will verify with HMAC-SHA256 test tokens.' : 'Operating on local deterministic sandbox.',
        type: 'info'
      });
      return next;
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetDemoState = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setPolicies(INITIAL_POLICIES);
    setApprovals(INITIAL_APPROVALS);
    setAgents(INITIAL_AGENTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setKpiMetrics(INITIAL_KPIS);
    setRevenueData(REVENUE_INTELLIGENCE_DATA);
    setSystemHealth(SYSTEM_HEALTH_ITEMS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSelectedTransaction(null);
    setIsTransactionDrawerOpen(false);
    setSelectedAgent(null);
    setActiveScenarioId('SCENARIO_1_SUCCESS');

    addToast({
      title: 'Demo State Reset',
      message: 'Canonical demo dataset, runtimes, and policy boundaries restored.',
      type: 'info'
    });
  };

  const toggleAgentStatus = (agentId: string, newStatus: 'ACTIVE' | 'PAUSED' | 'BLOCKED') => {
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status: newStatus } : a));
    
    // Add audit record
    const auditRecord: AuditRecord = {
      id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toLocaleTimeString(),
      event: `AGENT_STATUS_${newStatus}`,
      actor: 'SUPERVISOR_ADMIN',
      decision: newStatus === 'ACTIVE' ? 'PERMIT' : 'BLOCK',
      hash: `0x${Math.random().toString(16).substr(2, 12)}`,
      details: `Agent ${agentId} status updated to ${newStatus}.`
    };
    setAuditLogs(prev => [auditRecord, ...prev]);

    addToast({
      title: `Agent Status Updated`,
      message: `${agentId} runtime changed to ${newStatus}.`,
      type: newStatus === 'ACTIVE' ? 'success' : 'warning'
    });
  };

  const addNewPolicy = (policyData: Partial<PolicyRule>): PolicyRule => {
    const newVersion = 'v4.2.1';
    const newPolicy: PolicyRule = {
      id: policyData.id || `pol_custom_${Date.now()}`,
      name: policyData.name || 'Custom Deterministic Policy',
      naturalLanguage: policyData.naturalLanguage || 'Enforce merchant safety rule.',
      category: policyData.category || 'MARGIN',
      status: 'ACTIVE',
      version: newVersion,
      enforcementCount: 0,
      codeSnippet: policyData.codeSnippet || 'if (margin < 0.15) return BLOCK("CUSTOM_VIOLATION");',
      versions: [
        {
          version: newVersion,
          createdAt: new Date().toISOString().split('T')[0],
          author: 'Admin (Natural Language Compiler)',
          status: 'ACTIVE',
          diffSummary: 'Compiled from natural language prompt into AST rules.',
          codeSnippet: policyData.codeSnippet || 'if (margin < 0.15) return BLOCK();'
        }
      ],
      impactStats: {
        triggered: 0,
        blocked: 0,
        reviewed: 0,
        permitted: 0,
        valueProtected: 0,
        revenueUpliftPercent: 1.5
      }
    };

    setPolicies(prev => [newPolicy, ...prev]);

    // Audit log
    const auditRecord: AuditRecord = {
      id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toLocaleTimeString(),
      event: 'POLICY_CREATED_AND_DEPLOYED',
      actor: 'LLM_POLICY_COMPILER',
      policyId: newPolicy.id,
      decision: 'POLICY_UPDATE',
      hash: `0x${Math.random().toString(16).substr(2, 12)}`,
      details: `New policy "${newPolicy.name}" (${newVersion}) compiled & bound to 12 agent runtimes.`
    };
    setAuditLogs(prev => [auditRecord, ...prev]);

    // Notification
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      timestamp: 'Just now',
      title: 'New Policy Deployed',
      description: `Policy ${newPolicy.name} active across all agents.`,
      type: 'POLICY',
      targetNav: 'POLICIES',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);

    addToast({
      title: 'Policy Compiled & Deployed',
      message: `"${newPolicy.name}" bound to all active runtimes.`,
      type: 'success'
    });

    return newPolicy;
  };

  const updatePolicy = (policyId: string, updates: Partial<PolicyRule>) => {
    setPolicies(prev => prev.map(p => {
      if (p.id === policyId) {
        return { ...p, ...updates };
      }
      return p;
    }));
  };

  const approveRequest = (approvalId: string) => {
    const req = approvals.find(a => a.id === approvalId);
    if (!req) return;

    // Remove from pending approvals
    setApprovals(prev => prev.filter(a => a.id !== approvalId));

    // Update corresponding transaction if existing
    setTransactions(prev => prev.map(tx => {
      if (tx.id === req.transactionId || tx.amount === req.amount) {
        return {
          ...tx,
          status: 'SUCCESS',
          reason: `Supervisor Approved by human admin. Razorpay settlement completed.`,
          steps: [
            ...tx.steps,
            {
              id: `s_appr_${Date.now()}`,
              stepNumber: tx.steps.length + 1,
              name: 'SUPERVISOR_AUTHORIZED',
              title: `Authorized by Human Supervisor. Razorpay payout executed.`,
              status: 'PASS',
              timestamp: new Date().toLocaleTimeString(),
              latencyMs: 18,
              input: `Approval ID: ${approvalId}`,
              ruleEvaluated: 'Human-in-the-Loop Sign-off',
              output: 'State: AUTHORIZED_AND_SETTLED'
            }
          ]
        };
      }
      return tx;
    }));

    // Update KPI metrics
    setKpiMetrics(prev => prev.map(k => {
      if (k.type === 'approvals') {
        const remaining = approvals.length - 1;
        return { ...k, value: remaining > 0 ? `${remaining} Pending` : '0 Pending' };
      }
      return k;
    }));

    // Add Audit Record
    const auditRecord: AuditRecord = {
      id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toLocaleTimeString(),
      event: 'SUPERVISOR_APPROVAL_EXECUTED',
      actor: 'SUPERVISOR_ADMIN',
      transactionId: req.transactionId || 'TX-9479-REVW',
      decision: 'PERMIT',
      hash: `0x${Math.random().toString(16).substr(2, 12)}`,
      details: `Supervisor authorized ₹${req.amount.toLocaleString('en-IN')} payout exception (${req.policyException}). Settled on Razorpay testnet.`
    };
    setAuditLogs(prev => [auditRecord, ...prev]);

    addToast({
      title: 'Transaction Authorized by Supervisor',
      message: `₹${req.amount.toLocaleString('en-IN')} approved and settled on Razorpay Testnet.`,
      type: 'success'
    });
  };

  const rejectRequest = (approvalId: string, reason?: string) => {
    const req = approvals.find(a => a.id === approvalId);
    if (!req) return;

    setApprovals(prev => prev.filter(a => a.id !== approvalId));

    setTransactions(prev => prev.map(tx => {
      if (tx.id === req.transactionId || tx.amount === req.amount) {
        return {
          ...tx,
          status: 'BLOCKED',
          reason: reason || 'Supervisor Rejected: Threshold policy breached; proposal declined.',
        };
      }
      return tx;
    }));

    const auditRecord: AuditRecord = {
      id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toLocaleTimeString(),
      event: 'SUPERVISOR_REJECTION_EXECUTED',
      actor: 'SUPERVISOR_ADMIN',
      transactionId: req.transactionId,
      decision: 'BLOCK',
      hash: `0x${Math.random().toString(16).substr(2, 12)}`,
      details: `Supervisor declined approval request ${approvalId}. Transaction cancelled.`
    };
    setAuditLogs(prev => [auditRecord, ...prev]);

    addToast({
      title: 'Request Declined by Supervisor',
      message: `Approval ${approvalId} rejected. Escrow returned safely.`,
      type: 'warning'
    });
  };

  const replayTransaction = (txId: string) => {
    setReplayingTxId(txId);
    const tx = transactions.find(t => t.id === txId) || transactions[0];
    setSelectedTransaction(tx);
    setIsTransactionDrawerOpen(true);

    addToast({
      title: 'Replaying Decision Trace',
      message: `Reconstructing 10-step lifecycle for ${tx.id}...`,
      type: 'info'
    });

    setTimeout(() => {
      setReplayingTxId(null);
    }, 3500);
  };

  const triggerScenario = (scenarioId: DemoScenarioId) => {
    setActiveScenarioId(scenarioId);

    const nowStr = new Date().toLocaleTimeString();

    if (scenarioId === 'SCENARIO_1_SUCCESS') {
      const newTx: Transaction = {
        id: `TX-${Math.floor(1000 + Math.random() * 9000)}-EXEC`,
        timestamp: new Date().toISOString(),
        actor: 'AI Buyer #17',
        actorId: 'AGENT_BUYER_17',
        actorType: 'AI Agent',
        action: 'Liquidity sweep: 5x Dell XPS Enterprise Laptops',
        amount: 320000,
        status: 'SUCCESS',
        merchantName: 'Acme Enterprise',
        merchantId: 'MERCH_ACME_01',
        riskScore: 0.04,
        riskLevel: 'LOW',
        policyApplied: 'MARGIN_FLOOR_15 (v4.2.0)',
        hash: `0x${Math.random().toString(16).substr(2, 12)}`,
        razorpayPaymentId: `pay_${Math.random().toString(36).substr(2, 8)}_test`,
        idempotencyKey: `idemp_${Date.now()}`,
        explainability: {
          decision: 'PERMIT',
          summary: 'Transaction authorized within deterministic merchant bounds. Zero margin dilution and valid spend authority.',
          checks: [
            { text: 'Agent spend within authority limit (₹3,20,000 <= ₹5,00,000)', passed: true, value: '₹3,20,000' },
            { text: 'Merchant net margin satisfies 15.0% floor (Achieved: 18.2%)', passed: true, value: '18.2%' },
            { text: 'Negotiated discount satisfies 10.0% ceiling (Applied: 6.5%)', passed: true, value: '6.5%' },
            { text: 'Risk scoring velocity check evaluated nominal', passed: true, value: '0.04 Score' },
            { text: 'No duplicate idempotency key detected across ledger', passed: true, value: 'Unique Key' },
            { text: 'Razorpay testnet payment order created and signed', passed: true, value: 'HMAC-SHA256' }
          ]
        },
        steps: [
          { id: 's1', stepNumber: 1, name: 'INTENT_RECEIVED', title: 'Parse customer prompt "5 enterprise laptops under ₹3.5L"', status: 'PASS', timestamp: `${nowStr}.102`, latencyMs: 12, input: 'Prompt text: "5 enterprise laptops under ₹3.5L"', ruleEvaluated: 'LLM Intent Parser v2', output: 'Structured Intent { item: "Dell XPS 15", qty: 5, budgetCap: 350000 }' },
          { id: 's2', stepNumber: 2, name: 'INTENT_NORMALIZED', title: 'Order proposal synthesized: 5x Dell XPS 15 @ ₹64,000/ea', status: 'PASS', timestamp: `${nowStr}.124`, latencyMs: 22, input: 'SKU: DELL-XPS-15-I7, Base Price: ₹68,400', ruleEvaluated: 'Catalog Schema Validator', output: 'Normalized Order { total: 320000, discountPct: 6.43% }' },
          { id: 's3', stepNumber: 3, name: 'AUTHORITY_EVALUATED', title: 'Spend check: ₹3,20,000 <= Assigned ₹5,00,000 ceiling', status: 'PASS', timestamp: `${nowStr}.138`, latencyMs: 14, input: 'Agent: AGENT_BUYER_17, Available: ₹5,00,000', ruleEvaluated: 'Agent Authority Boundary Rule #1', output: 'Permitted: Remaining limit ₹1,80,000' },
          { id: 's4', stepNumber: 4, name: 'MERCHANT_POLICY_EVAL', title: 'Margin check: 18.2% margin >= 15.0% mandatory floor', status: 'PASS', timestamp: `${nowStr}.149`, latencyMs: 11, input: 'Item Cost: ₹52,300, Proposed Price: ₹64,000', ruleEvaluated: 'MARGIN_FLOOR_15 (v4.2.0)', output: 'Margin: 18.28% (Valid: +3.28% above floor)' },
          { id: 's5', stepNumber: 5, name: 'MARGIN_CALCULATED', title: 'Net revenue profit margin confirmed: ₹58,500 protected', status: 'PASS', timestamp: `${nowStr}.155`, latencyMs: 6, input: 'Gross: ₹3,20,000, COGS: ₹2,61,500', ruleEvaluated: 'Financial Accounting Engine', output: 'Net Merchant Profit: ₹58,500' },
          { id: 's6', stepNumber: 6, name: 'RISK_SCORED', title: 'Fraud & velocity matrix evaluation score: 0.04 (Nominal)', status: 'PASS', timestamp: `${nowStr}.162`, latencyMs: 7, input: 'IP, Device, Merchant ID, Hourly Velocity', ruleEvaluated: 'ML Anomaly Matrix v3', output: 'Risk Tier: LOW (0.04 / 1.00)' },
          { id: 's7', stepNumber: 7, name: 'TRANSACTION_AUTHORIZED', title: 'Autonomous token authorization generated without escalation', status: 'PASS', timestamp: `${nowStr}.168`, latencyMs: 6, input: 'All pre-flight checks PASS', ruleEvaluated: 'Guardrail Decision Matrix', output: 'Decision: PERMIT' },
          { id: 's8', stepNumber: 8, name: 'PAYMENT_INITIATED', title: 'Razorpay Test Gateway payload dispatched: order_NYz8923h', status: 'PASS', timestamp: `${nowStr}.180`, latencyMs: 12, input: 'Amount: ₹3,20,000, Currency: INR', ruleEvaluated: 'Razorpay API Adapter (Testnet)', output: 'Order Created: order_NYz8923h' },
          { id: 's9', stepNumber: 9, name: 'RAZORPAY_RESPONSE', title: 'Webhook signature 0x4f8e verified via HMAC-SHA256', status: 'PASS', timestamp: `${nowStr}.210`, latencyMs: 30, input: 'Razorpay Signature Header, Event: payment.captured', ruleEvaluated: 'Cryptographic Webhook Verifier', output: 'Signature Authenticated' },
          { id: 's10', stepNumber: 10, name: 'VERIFICATION_COMPLETED', title: 'Ledger idempotency matched; immutable block #84912 recorded', status: 'PASS', timestamp: `${nowStr}.218`, latencyMs: 8, input: 'Settlement state verified', ruleEvaluated: 'Distributed Audit Ledger', output: 'Settled & Reconciled (0 Duplicates)' }
        ]
      };

      setTransactions(prev => [newTx, ...prev]);

      const auditRecord: AuditRecord = {
        id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: nowStr,
        event: 'TRANSACTION_PERMITTED',
        actor: 'AGENT_BUYER_17',
        transactionId: newTx.id,
        policyId: 'MARGIN_FLOOR_15',
        decision: 'PERMIT',
        hash: newTx.hash || '0x8f2a91b4c3e7',
        details: 'Valid procurement ₹3,20,000 authorized within spend limits & margin floor.'
      };
      setAuditLogs(prev => [auditRecord, ...prev]);

      addToast({
        title: 'Scenario 01: Safe Transaction Permitted',
        message: '10-step lifecycle passed seamlessly. Settled on Razorpay Testnet.',
        type: 'success'
      });
    } else if (scenarioId === 'SCENARIO_2_DISCOUNT_BLOCK') {
      const newTx: Transaction = {
        id: `TX-${Math.floor(1000 + Math.random() * 9000)}-BLCK`,
        timestamp: new Date().toISOString(),
        actor: 'Autonomous Negotiator #04',
        actorId: 'AGENT_NEGOTIATOR_04',
        actorType: 'AI Agent',
        action: 'Excess discount 25% on SKU-4491',
        amount: 85000,
        status: 'BLOCKED',
        merchantName: 'Global Cloud Direct',
        merchantId: 'MERCH_CLOUD_04',
        riskScore: 0.28,
        riskLevel: 'HIGH',
        policyApplied: 'MARGIN_FLOOR_15',
        reason: 'Policy Violation: Negotiated discount 25.0% exceeds merchant max ceiling 10.0% & breaches margin floor (8.4% < 15.0%).',
        hash: `0x${Math.random().toString(16).substr(2, 12)}`,
        explainability: {
          decision: 'BLOCKED',
          summary: 'Guardrail halted transaction before payment gateway execution. Prevented ₹14,200 margin dilution.',
          exposurePrevented: 14200,
          checks: [
            { text: 'Merchant net margin satisfies 15.0% floor (Proposed: 8.4%)', passed: false, value: '8.4% (< 15.0%)' },
            { text: 'Negotiated discount within agent authority ceiling (Proposed: 25.0%)', passed: false, value: '25.0% (> 10.0%)' },
            { text: 'Single transaction spend within authority (₹85,000 <= ₹4,00,000)', passed: true, value: '₹85,000' },
            { text: 'Guardrail intervention prevented dispatch to Razorpay API', passed: true, value: 'Halted At Core' }
          ]
        },
        steps: [
          { id: 's1', stepNumber: 1, name: 'INTENT_RECEIVED', title: 'Buyer requested bulk 25% discount on enterprise cloud SKU-4491', status: 'PASS', timestamp: `${nowStr}.010`, latencyMs: 10, input: 'Buyer inquiry: "Need 25% discount on SKU-4491"', ruleEvaluated: 'Negotiation Intent Parser', output: 'Requested Discount: 25.0%' },
          { id: 's2', stepNumber: 2, name: 'INTENT_NORMALIZED', title: 'Agent generated invoice proposal ₹85,000 (Cost basis ₹77,800)', status: 'PASS', timestamp: `${nowStr}.025`, latencyMs: 15, input: 'Base Price: ₹1,13,333, Proposed: ₹85,000', ruleEvaluated: 'Quote Pricing Generator', output: 'Discount: 25.0%, Margin: 8.4%' },
          { id: 's3', stepNumber: 3, name: 'AUTHORITY_EVALUATED', title: 'Discount 25% exceeds Agent assigned max 10.0% ceiling', status: 'BLOCK', timestamp: `${nowStr}.038`, latencyMs: 13, input: 'Proposed: 25.0%, Agent Max: 10.0%', ruleEvaluated: 'Agent Discount Boundary Rule', output: 'VIOLATION: Discount ceiling exceeded (+15.0%)' },
          { id: 's4', stepNumber: 4, name: 'MERCHANT_POLICY_EVAL', title: 'Net margin 8.4% breaches merchant mandatory 15.0% margin floor', status: 'BLOCK', timestamp: `${nowStr}.046`, latencyMs: 8, input: 'Calculated Margin: 8.47%, Required: 15.0%', ruleEvaluated: 'MARGIN_FLOOR_15 (v4.2.0)', output: 'VIOLATION: Margin floor breach (-6.53%)' },
          { id: 's5', stepNumber: 5, name: 'TRANSACTION_HALTED', title: 'Action blocked at Guardrail perimeter; zero financial leakage', status: 'BLOCK', timestamp: `${nowStr}.052`, latencyMs: 6, input: 'Policy Breaches Detected', ruleEvaluated: 'Safety Perimeter Interceptor', output: 'Action Halted. Exposure Prevented: ₹14,200' }
        ]
      };

      setTransactions(prev => [newTx, ...prev]);

      const auditRecord: AuditRecord = {
        id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: nowStr,
        event: 'POLICY_BLOCK',
        actor: 'AGENT_NEGOTIATOR_04',
        transactionId: newTx.id,
        policyId: 'MARGIN_FLOOR_15',
        decision: 'BLOCK',
        hash: newTx.hash || '0x3c99f1e4a2b1',
        details: 'Halted 25% discount proposal. Protected ₹14,200 margin from dilution.'
      };
      setAuditLogs(prev => [auditRecord, ...prev]);

      addToast({
        title: 'Scenario 02: Margin Floor Violation Blocked',
        message: 'Guardrail prevented 25% discount. Saved ₹14,200 in margin exposure.',
        type: 'warning'
      });
    } else if (scenarioId === 'SCENARIO_3_APPROVAL_REQUIRED') {
      const newApproval: ApprovalRequest = {
        id: `appr_${Math.floor(1000 + Math.random() * 9000)}`,
        transactionId: `TX-${Math.floor(1000 + Math.random() * 9000)}-REVW`,
        agentId: 'AGENT_SUPPORT_09',
        agentName: 'Support Agent #09',
        merchant: 'Nordic Retail Hub',
        intent: 'Discretionary damage claim compensation for transit delay',
        amount: 14500,
        requestedAt: 'Just now',
        reason: 'Refund ₹14,500 exceeds autonomous refund limit of ₹5,000 by ₹9,500.',
        policyException: 'REFUND_CAP_5K',
        riskScore: 0.14,
        status: 'PENDING',
        recommendation: 'Escrow held. Requires human supervisor authorization before Razorpay release.'
      };

      setApprovals(prev => [newApproval, ...prev]);

      const newTx: Transaction = {
        id: newApproval.transactionId!,
        timestamp: new Date().toISOString(),
        actor: 'Support Agent #09',
        actorId: 'AGENT_SUPPORT_09',
        actorType: 'AI Agent',
        action: 'Discretionary refund claim #RF-892',
        amount: 14500,
        status: 'REVIEW',
        merchantName: 'Nordic Retail Hub',
        merchantId: 'MERCH_NORDIC_09',
        riskScore: 0.14,
        riskLevel: 'MEDIUM',
        policyApplied: 'REFUND_CAP_5K',
        reason: 'Threshold Exceeded: Refund ₹14,500 exceeds auto-refund threshold ₹5,000. Escrow held pending Supervisor sign-off.',
        hash: `0x${Math.random().toString(16).substr(2, 12)}`,
        explainability: {
          decision: 'REVIEW',
          summary: 'Refund exceeds autonomous threshold of ₹5,000. Escrow held in Supervisor Queue pending human sign-off.',
          checks: [
            { text: 'Customer compensation request verified with valid order proof', passed: true, value: 'Valid Proof' },
            { text: 'Autonomous refund cap check (₹14,500 > ₹5,000)', passed: false, value: '₹14,500 (> ₹5k)' },
            { text: 'Customer tier VIP Enterprise requires supervisor verification', passed: false, value: 'Escalated' },
            { text: 'Escrow isolation enabled pending supervisor action', passed: true, value: 'Escrow Held' }
          ]
        },
        steps: [
          { id: 's1', stepNumber: 1, name: 'INTENT_RECEIVED', title: 'Customer damage claim submitted for order ORD-4491', status: 'PASS', timestamp: `${nowStr}.100`, latencyMs: 10, input: 'Customer claim: Transit damage', ruleEvaluated: 'Support Intent Parser', output: 'Claim: ₹14,500' },
          { id: 's2', stepNumber: 2, name: 'AUTHORITY_EVALUATED', title: 'Refund value ₹14,500 exceeds autonomous limit ₹5,000', status: 'REVIEW', timestamp: `${nowStr}.115`, latencyMs: 15, input: 'Amount: ₹14,500, Agent Limit: ₹5,000', ruleEvaluated: 'Agent Refund Boundary Rule', output: 'ESCALATION REQUIRED (+₹9,500 delta)' },
          { id: 's3', stepNumber: 3, name: 'DECISION_ROUTING', title: 'Transaction routed to Supervisor Queue for human sign-off', status: 'REVIEW', timestamp: `${nowStr}.122`, latencyMs: 7, input: 'Escalation trigger', ruleEvaluated: 'Human-in-the-Loop Routing Engine', output: `Queued to Approval Center (ID: ${newApproval.id})` }
        ]
      };

      setTransactions(prev => [newTx, ...prev]);

      const notif: NotificationItem = {
        id: `notif_${Date.now()}`,
        timestamp: 'Just now',
        title: 'New Supervisor Approval Escalation',
        description: `Support Agent #09 requested ₹14,500 refund. Escrow held.`,
        type: 'APPROVAL',
        targetNav: 'APPROVALS',
        read: false
      };
      setNotifications(prev => [notif, ...prev]);

      addToast({
        title: 'Scenario 03: Escalated to Human Supervisor',
        message: 'Refund ₹14,500 routed to Supervisor Queue for sign-off.',
        type: 'info'
      });
    } else if (scenarioId === 'SCENARIO_4_DUPLICATE_WEBHOOK') {
      const newTx: Transaction = {
        id: `TX-${Math.floor(1000 + Math.random() * 9000)}-IDEM`,
        timestamp: new Date().toISOString(),
        actor: 'Razorpay Webhook Node',
        actorId: 'RAZORPAY_WEBHOOK',
        actorType: 'Razorpay Webhook',
        action: 'Duplicate payment.captured event #evt_9918',
        amount: 42000,
        status: 'SUCCESS',
        merchantName: 'Acme Enterprise',
        merchantId: 'MERCH_ACME_01',
        riskScore: 0.01,
        riskLevel: 'LOW',
        policyApplied: 'IDEMPOTENCY_LEDGER',
        hash: `0x${Math.random().toString(16).substr(2, 12)}`,
        idempotencyKey: 'idemp_evt_99182a',
        explainability: {
          decision: 'PERMIT',
          summary: 'Duplicate webhook captured. Idempotency ledger reconciled state with zero duplicate payouts.',
          checks: [
            { text: 'Razorpay webhook signature verified (HMAC-SHA256)', passed: true, value: 'Valid HMAC' },
            { text: 'Idempotency ledger lookup matched previous event evt_99182a', passed: true, value: 'Duplicate Identified' },
            { text: 'Duplicate ledger posting suppressed (0 extra debits)', passed: true, value: '0 Double Debits' }
          ]
        },
        steps: [
          { id: 's1', stepNumber: 1, name: 'WEBHOOK_RECEIPT', title: 'Received duplicate payment.captured event evt_99182a', status: 'PASS', timestamp: `${nowStr}.100`, latencyMs: 8, input: 'Webhook payload: event=payment.captured', ruleEvaluated: 'Webhook Ingestion Node', output: 'Event ID: evt_99182a' },
          { id: 's2', stepNumber: 2, name: 'IDEMPOTENCY_CHECK', title: 'Idempotency key already reconciled in ledger at 14:15:00', status: 'PASS', timestamp: `${nowStr}.108`, latencyMs: 8, input: 'Key: idemp_evt_99182a', ruleEvaluated: 'Distributed Key-Value Idempotency Store', output: 'State: ALREADY_SETTLED' },
          { id: 's3', stepNumber: 3, name: 'DEDUPLICATION_CONFIRMED', title: 'Suppressed duplicate ledger entry; zero duplicate debits', status: 'PASS', timestamp: `${nowStr}.112`, latencyMs: 4, input: 'Deduplication rule', ruleEvaluated: 'Reconciliation Controller', output: 'No duplicate action taken (Safe)' }
        ]
      };

      setTransactions(prev => [newTx, ...prev]);

      const auditRecord: AuditRecord = {
        id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: nowStr,
        event: 'IDEMPOTENCY_DEDUPLICATION',
        actor: 'RAZORPAY_WEBHOOK',
        transactionId: newTx.id,
        policyId: 'IDEMPOTENCY_LEDGER',
        decision: 'DEDUPLICATED',
        hash: newTx.hash || '0x12a99bc45ef7',
        details: 'Suppressed duplicate payment.captured webhook. 0 multiple debits.'
      };
      setAuditLogs(prev => [auditRecord, ...prev]);

      addToast({
        title: 'Scenario 04: Duplicate Webhook Deduplicated',
        message: 'Idempotency ledger suppressed duplicate settlement. Zero leakage.',
        type: 'success'
      });
    } else if (scenarioId === 'SCENARIO_5_PAYMENT_VERIFICATION') {
      addToast({
        title: 'Scenario 05: Gateway Timeout & Reconciled',
        message: 'Exponential backoff and idempotent state verification avoided duplicate charges.',
        type: 'success'
      });
    } else if (scenarioId === 'SCENARIO_6_REVENUE_OPTIMIZATION') {
      addToast({
        title: 'Scenario 06: Revenue Uplift Simulated',
        message: 'AI volume tiers generated +24.6% lift while strictly maintaining 15.0% margin floor.',
        type: 'success'
      });
    }
  };

  return (
    <GuardrailContext.Provider
      value={{
        currentNav,
        setCurrentNav,
        transactions,
        policies,
        approvals,
        agents,
        auditLogs,
        kpiMetrics,
        revenueData,
        systemHealth,
        agentAuthority: PRIMARY_AGENT_AUTHORITY,
        notifications,
        unreadNotificationsCount,
        selectedTransaction,
        setSelectedTransaction,
        isTransactionDrawerOpen,
        setIsTransactionDrawerOpen,
        selectedAgent,
        setSelectedAgent,
        activeScenarioId,
        isTestMode,
        toggleTestMode,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isPitchModeOpen,
        setIsPitchModeOpen,
        globalFilters,
        setGlobalFilters,
        triggerScenario,
        approveRequest,
        rejectRequest,
        addNewPolicy,
        updatePolicy,
        toggleAgentStatus,
        markNotificationAsRead,
        clearAllNotifications,
        resetDemoState,
        replayTransaction,
        replayingTxId,
        addToast,
        toast
      }}
    >
      {children}
    </GuardrailContext.Provider>
  );
};

export const useGuardrail = () => {
  const context = useContext(GuardrailContext);
  if (!context) {
    throw new Error('useGuardrail must be used within a GuardrailProvider');
  }
  return context;
};
