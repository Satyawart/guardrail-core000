import { 
  Transaction, 
  KpiMetric, 
  PolicyRule, 
  ApprovalRequest, 
  FailureScenario, 
  RevenueMetric, 
  SystemHealthItem, 
  DemoScenario,
  AgentRuntime,
  AuditRecord,
  NotificationItem,
  ObservabilityPoint
} from '../types';

export const INITIAL_KPIS: KpiMetric[] = [
  {
    id: 'kpi_agents',
    type: 'agents',
    title: 'Active AI Agents',
    value: '12',
    change: 'All Bound',
    deltaLabel: '12 Live Runtimes'
  },
  {
    id: 'kpi_auth',
    type: 'authorized',
    title: 'Governed Throughput',
    value: '₹48.2M',
    change: '99.98% Pass',
    deltaLabel: 'Alignment rate'
  },
  {
    id: 'kpi_blocked',
    type: 'blocked',
    title: 'Policy Violations Prevented',
    value: '142',
    change: 'Zero Leakage',
    deltaLabel: 'Autonomous block'
  },
  {
    id: 'kpi_approvals',
    type: 'approvals',
    title: 'Human Review Queue',
    value: '3 Pending',
    change: 'Avg: 42s',
    deltaLabel: 'Supervised bounds'
  },
  {
    id: 'kpi_volume',
    type: 'volume',
    title: 'Capital Under Guard',
    value: '₹2.84B',
    change: '+0.12%',
    deltaLabel: 'Delta 24h'
  },
  {
    id: 'kpi_violations',
    type: 'violations',
    title: 'Margin Floor Guard',
    value: '15.0%',
    change: 'Guaranteed',
    deltaLabel: '₹84.5k preserved'
  }
];

export const PRIMARY_AGENT_AUTHORITY = {
  agentId: 'AGENT_BUYER_17',
  merchant: 'Acme Enterprise Corp',
  status: 'ACTIVE_ALIGNED',
  spendLimit: 500000,
  usedSpend: 320000,
  remainingSpend: 180000,
  utilizationPercent: 64.0,
  discountAuthorityMaxPercent: 10,
  refundAuthorityMax: 5000,
  validUntil: '2026-12-31 23:59:59 UTC'
};

export const INITIAL_AGENTS: AgentRuntime[] = [
  {
    id: 'AGENT_BUYER_17',
    name: 'AI Buyer #17',
    type: 'Autonomous Procurement',
    status: 'ACTIVE',
    spendLimit: 500000,
    usedSpend: 320000,
    remainingSpend: 180000,
    utilizationPercent: 64.0,
    discountAuthorityMaxPercent: 10,
    refundAuthorityMax: 5000,
    riskScore: 0.04,
    activePoliciesCount: 4,
    lastAction: 'Procured 5x Enterprise Laptops (Dell XPS)',
    lastActionTime: '2 mins ago',
    latencyAvg: '0.12s',
    tasksCompleted: 428,
    timeline: [
      {
        id: 'act_17_1',
        timestamp: '14:26:40',
        intent: 'Parse customer prompt "5 enterprise laptops under ₹3.5L"',
        reasoning: 'Evaluated vendor inventory and verified transaction is within ₹5,00,000 authority cap and above 15.0% margin floor.',
        action: 'Authorized order order_NYz8923h on Razorpay Testnet',
        policyResult: 'PASS',
        authorityResult: 'PASS',
        riskResult: 'PASS',
        decision: 'PERMIT',
        amount: 320000,
        txId: 'TX-9481-EXEC'
      },
      {
        id: 'act_17_2',
        timestamp: '13:10:15',
        intent: 'Replenish office hardware inventory: 20x 4K Monitors',
        reasoning: 'Batch cost ₹2,40,000 matches preferred vendor contractual discount 6.5%.',
        action: 'Completed order placement with verified HMAC signature',
        policyResult: 'PASS',
        authorityResult: 'PASS',
        riskResult: 'PASS',
        decision: 'PERMIT',
        amount: 240000,
        txId: 'TX-9475-PROC'
      }
    ]
  },
  {
    id: 'AGENT_NEGOTIATOR_04',
    name: 'Autonomous Negotiator #04',
    type: 'B2B Pricing & Discounts',
    status: 'ACTIVE',
    spendLimit: 400000,
    usedSpend: 165000,
    remainingSpend: 235000,
    utilizationPercent: 41.25,
    discountAuthorityMaxPercent: 10,
    refundAuthorityMax: 3000,
    riskScore: 0.28,
    activePoliciesCount: 3,
    lastAction: 'Attempted 25% discount proposal on SKU-4491 (BLOCKED)',
    lastActionTime: '5 mins ago',
    latencyAvg: '0.18s',
    tasksCompleted: 312,
    timeline: [
      {
        id: 'act_04_1',
        timestamp: '14:24:12',
        intent: 'Buyer requests 25% discount on enterprise cloud license SKU-4491',
        reasoning: 'Proposed 25% discount breaches merchant policy ceiling of 10.0% and yields net margin 8.4% (< 15.0% floor).',
        action: 'Guardrail engine automatically halted proposal generation before dispatch.',
        policyResult: 'BLOCK',
        authorityResult: 'BLOCK',
        riskResult: 'PASS',
        decision: 'BLOCK',
        amount: 85000,
        txId: 'TX-9480-DISC'
      },
      {
        id: 'act_04_2',
        timestamp: '12:45:00',
        intent: 'Negotiate volume contract for 100 enterprise seats',
        reasoning: 'Approved 8.5% volume discount resulting in 18.2% margin, within safe policy boundaries.',
        action: 'Dispatched signed quote to buyer',
        policyResult: 'PASS',
        authorityResult: 'PASS',
        riskResult: 'PASS',
        decision: 'PERMIT',
        amount: 195000,
        txId: 'TX-9472-NEGO'
      }
    ]
  },
  {
    id: 'AGENT_SUPPORT_09',
    name: 'Support Agent #09',
    type: 'Customer Care & Returns',
    status: 'ACTIVE',
    spendLimit: 100000,
    usedSpend: 28500,
    remainingSpend: 71500,
    utilizationPercent: 28.5,
    discountAuthorityMaxPercent: 5,
    refundAuthorityMax: 5000,
    riskScore: 0.14,
    activePoliciesCount: 3,
    lastAction: 'Submitted ₹14,500 refund claim to Supervisor Queue',
    lastActionTime: '8 mins ago',
    latencyAvg: '0.15s',
    tasksCompleted: 619,
    timeline: [
      {
        id: 'act_09_1',
        timestamp: '14:22:05',
        intent: 'Customer claims damaged transit packaging on order #ORD-4491',
        reasoning: 'Requested refund amount ₹14,500 exceeds autonomous support cap of ₹5,000. Routed to supervisor queue.',
        action: 'Escrow held pending human supervisor sign-off.',
        policyResult: 'REVIEW',
        authorityResult: 'REVIEW',
        riskResult: 'PASS',
        decision: 'REVIEW',
        amount: 14500,
        txId: 'TX-9479-REVW'
      },
      {
        id: 'act_09_2',
        timestamp: '11:15:30',
        intent: 'Issue replacement shipping voucher for late courier delivery',
        reasoning: 'Voucher value ₹1,200 is below autonomous cap ₹5,000 with clean customer history.',
        action: 'Issued voucher automatically',
        policyResult: 'PASS',
        authorityResult: 'PASS',
        riskResult: 'PASS',
        decision: 'PERMIT',
        amount: 1200,
        txId: 'TX-9470-VOUC'
      }
    ]
  },
  {
    id: 'AGENT_PROCURE_03',
    name: 'Procurement Bot #03',
    type: 'Inventory Reorder & Vendor RFQ',
    status: 'ACTIVE',
    spendLimit: 600000,
    usedSpend: 450000,
    remainingSpend: 150000,
    utilizationPercent: 75.0,
    discountAuthorityMaxPercent: 12,
    refundAuthorityMax: 5000,
    riskScore: 0.08,
    activePoliciesCount: 4,
    lastAction: 'High-volume server rack procurement batch #SRV-901',
    lastActionTime: '15 mins ago',
    latencyAvg: '0.11s',
    tasksCompleted: 245,
    timeline: [
      {
        id: 'act_03_1',
        timestamp: '14:12:00',
        intent: 'Flash inventory reorder: 50x NVMe 2TB Enterprise drives',
        reasoning: 'Reorder velocity nominal, pricing verified against contract baseline.',
        action: 'Placed order with vendor API',
        policyResult: 'PASS',
        authorityResult: 'PASS',
        riskResult: 'PASS',
        decision: 'PERMIT',
        amount: 450000,
        txId: 'TX-9474-NVME'
      }
    ]
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TX-9481-EXEC',
    timestamp: new Date(Date.now() - 1000 * 25).toISOString(),
    actor: 'AI Buyer #17',
    actorId: 'AGENT_BUYER_17',
    actorType: 'AI Agent',
    action: 'Liquidity sweep & bulk procurement',
    amount: 320000,
    status: 'SUCCESS',
    merchantName: 'Acme Enterprise',
    merchantId: 'MERCH_ACME_01',
    riskScore: 0.04,
    riskLevel: 'LOW',
    policyApplied: 'MARGIN_FLOOR_15 (v4.2.0)',
    hash: '0x8f2a91b4c3e7d812',
    razorpayPaymentId: 'pay_NYz8923h_test',
    idempotencyKey: 'idemp_9481_a83f',
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
      { id: 's1', stepNumber: 1, name: 'INTENT_RECEIVED', title: 'Parse customer prompt "5 enterprise laptops under ₹3.5L"', status: 'PASS', timestamp: '14:26:40.102', latencyMs: 12, input: 'Prompt text: "5 enterprise laptops under ₹3.5L"', ruleEvaluated: 'LLM Intent Parser v2', output: 'Structured Intent { item: "Dell XPS 15", qty: 5, budgetCap: 350000 }' },
      { id: 's2', stepNumber: 2, name: 'INTENT_NORMALIZED', title: 'Order proposal synthesized: 5x Dell XPS 15 @ ₹64,000/ea', status: 'PASS', timestamp: '14:26:40.124', latencyMs: 22, input: 'SKU: DELL-XPS-15-I7, Base Price: ₹68,400', ruleEvaluated: 'Catalog Schema Validator', output: 'Normalized Order { total: 320000, discountPct: 6.43% }' },
      { id: 's3', stepNumber: 3, name: 'AUTHORITY_EVALUATED', title: 'Spend check: ₹3,20,000 <= Assigned ₹5,00,000 ceiling', status: 'PASS', timestamp: '14:26:40.138', latencyMs: 14, input: 'Agent: AGENT_BUYER_17, Available: ₹5,00,000', ruleEvaluated: 'Agent Authority Boundary Rule #1', output: 'Permitted: Remaining limit ₹1,80,000' },
      { id: 's4', stepNumber: 4, name: 'MERCHANT_POLICY_EVAL', title: 'Margin check: 18.2% margin >= 15.0% mandatory floor', status: 'PASS', timestamp: '14:26:40.149', latencyMs: 11, input: 'Item Cost: ₹52,300, Proposed Price: ₹64,000', ruleEvaluated: 'MARGIN_FLOOR_15 (v4.2.0)', output: 'Margin: 18.28% (Valid: +3.28% above floor)' },
      { id: 's5', stepNumber: 5, name: 'MARGIN_CALCULATED', title: 'Net revenue profit margin confirmed: ₹58,500 protected', status: 'PASS', timestamp: '14:26:40.155', latencyMs: 6, input: 'Gross: ₹3,20,000, COGS: ₹2,61,500', ruleEvaluated: 'Financial Accounting Engine', output: 'Net Merchant Profit: ₹58,500' },
      { id: 's6', stepNumber: 6, name: 'RISK_SCORED', title: 'Fraud & velocity matrix evaluation score: 0.04 (Nominal)', status: 'PASS', timestamp: '14:26:40.162', latencyMs: 7, input: 'IP, Device, Merchant ID, Hourly Velocity', ruleEvaluated: 'ML Anomaly Matrix v3', output: 'Risk Tier: LOW (0.04 / 1.00)' },
      { id: 's7', stepNumber: 7, name: 'TRANSACTION_AUTHORIZED', title: 'Autonomous token authorization generated without escalation', status: 'PASS', timestamp: '14:26:40.168', latencyMs: 6, input: 'All pre-flight checks PASS', ruleEvaluated: 'Guardrail Decision Matrix', output: 'Decision: PERMIT' },
      { id: 's8', stepNumber: 8, name: 'PAYMENT_INITIATED', title: 'Razorpay Test Gateway payload dispatched: order_NYz8923h', status: 'PASS', timestamp: '14:26:40.180', latencyMs: 12, input: 'Amount: ₹3,20,000, Currency: INR, IdempotencyKey: idemp_9481', ruleEvaluated: 'Razorpay API Adapter (Testnet)', output: 'Order Created: order_NYz8923h' },
      { id: 's9', stepNumber: 9, name: 'RAZORPAY_RESPONSE', title: 'Webhook signature 0x4f8e verified via HMAC-SHA256', status: 'PASS', timestamp: '14:26:40.210', latencyMs: 30, input: 'Razorpay Signature Header, Event: payment.captured', ruleEvaluated: 'Cryptographic Webhook Verifier', output: 'Signature Authenticated' },
      { id: 's10', stepNumber: 10, name: 'VERIFICATION_COMPLETED', title: 'Ledger idempotency matched; immutable block #84912 recorded', status: 'PASS', timestamp: '14:26:40.218', latencyMs: 8, input: 'Settlement state verified', ruleEvaluated: 'Distributed Audit Ledger', output: 'Settled & Reconciled (0 Duplicates)' }
    ]
  },
  {
    id: 'TX-9480-DISC',
    timestamp: new Date(Date.now() - 1000 * 130).toISOString(),
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
    policyApplied: 'MARGIN_FLOOR_15 & DISCOUNT_LIMIT_10',
    reason: 'Policy Violation: Negotiated discount 25.0% exceeds merchant max ceiling 10.0% & breaches margin floor (8.4% < 15.0%).',
    hash: '0x3c99f1e4a2b18742',
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
      { id: 's1', stepNumber: 1, name: 'INTENT_RECEIVED', title: 'Buyer requested bulk 25% discount on enterprise cloud SKU-4491', status: 'PASS', timestamp: '14:24:12.010', latencyMs: 10, input: 'Buyer inquiry: "Need 25% discount on SKU-4491"', ruleEvaluated: 'Negotiation Intent Parser', output: 'Requested Discount: 25.0%' },
      { id: 's2', stepNumber: 2, name: 'INTENT_NORMALIZED', title: 'Agent generated invoice proposal ₹85,000 (Cost basis ₹77,800)', status: 'PASS', timestamp: '14:24:12.025', latencyMs: 15, input: 'Base Price: ₹1,13,333, Proposed: ₹85,000', ruleEvaluated: 'Quote Pricing Generator', output: 'Discount: 25.0%, Margin: 8.4%' },
      { id: 's3', stepNumber: 3, name: 'AUTHORITY_EVALUATED', title: 'Discount 25% exceeds Agent assigned max 10.0% ceiling', status: 'BLOCK', timestamp: '14:24:12.038', latencyMs: 13, input: 'Proposed: 25.0%, Agent Max: 10.0%', ruleEvaluated: 'Agent Discount Boundary Rule', output: 'VIOLATION: Discount ceiling exceeded (+15.0%)' },
      { id: 's4', stepNumber: 4, name: 'MERCHANT_POLICY_EVAL', title: 'Net margin 8.4% breaches merchant mandatory 15.0% margin floor', status: 'BLOCK', timestamp: '14:24:12.046', latencyMs: 8, input: 'Calculated Margin: 8.47%, Required: 15.0%', ruleEvaluated: 'MARGIN_FLOOR_15 (v4.2.0)', output: 'VIOLATION: Margin floor breach (-6.53%)' },
      { id: 's5', stepNumber: 5, name: 'TRANSACTION_HALTED', title: 'Action blocked at Guardrail perimeter; zero financial leakage', status: 'BLOCK', timestamp: '14:24:12.052', latencyMs: 6, input: 'Policy Breaches Detected', ruleEvaluated: 'Safety Perimeter Interceptor', output: 'Action Halted. Exposure Prevented: ₹14,200' }
    ]
  },
  {
    id: 'TX-9479-REVW',
    timestamp: new Date(Date.now() - 1000 * 320).toISOString(),
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
    hash: '0x99a147e8b22c6104',
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
      { id: 's1', stepNumber: 1, name: 'INTENT_RECEIVED', title: 'Customer damage claim submitted for order ORD-4491', status: 'PASS', timestamp: '14:22:05.100', latencyMs: 10, input: 'Customer claim: Transit damage', ruleEvaluated: 'Support Intent Parser', output: 'Claim: ₹14,500' },
      { id: 's2', stepNumber: 2, name: 'AUTHORITY_EVALUATED', title: 'Refund value ₹14,500 exceeds autonomous limit ₹5,000', status: 'REVIEW', timestamp: '14:22:05.115', latencyMs: 15, input: 'Amount: ₹14,500, Agent Limit: ₹5,000', ruleEvaluated: 'Agent Refund Boundary Rule', output: 'ESCALATION REQUIRED (+₹9,500 delta)' },
      { id: 's3', stepNumber: 3, name: 'DECISION_ROUTING', title: 'Transaction routed to Supervisor Queue for human sign-off', status: 'REVIEW', timestamp: '14:22:05.122', latencyMs: 7, input: 'Escalation trigger', ruleEvaluated: 'Human-in-the-Loop Routing Engine', output: 'Queued to Approval Center (ID: appr_8912)' }
    ]
  },
  {
    id: 'TX-9478-IDEM',
    timestamp: new Date(Date.now() - 1000 * 500).toISOString(),
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
    hash: '0x12a99bc45ef77102',
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
      { id: 's1', stepNumber: 1, name: 'WEBHOOK_RECEIPT', title: 'Received duplicate payment.captured event evt_99182a', status: 'PASS', timestamp: '14:15:02.100', latencyMs: 8, input: 'Webhook payload: event=payment.captured', ruleEvaluated: 'Webhook Ingestion Node', output: 'Event ID: evt_99182a' },
      { id: 's2', stepNumber: 2, name: 'IDEMPOTENCY_CHECK', title: 'Idempotency key already reconciled in ledger at 14:15:00', status: 'PASS', timestamp: '14:15:02.108', latencyMs: 8, input: 'Key: idemp_evt_99182a', ruleEvaluated: 'Distributed Key-Value Idempotency Store', output: 'State: ALREADY_SETTLED' },
      { id: 's3', stepNumber: 3, name: 'DEDUPLICATION_CONFIRMED', title: 'Suppressed duplicate ledger entry; zero duplicate debits', status: 'PASS', timestamp: '14:15:02.112', latencyMs: 4, input: 'Deduplication rule', ruleEvaluated: 'Reconciliation Controller', output: 'No duplicate action taken (Safe)' }
    ]
  }
];

export const INITIAL_POLICIES: PolicyRule[] = [
  {
    id: 'pol_margin_01',
    name: 'Guaranteed 15% Merchant Margin Floor',
    naturalLanguage: 'Block any AI agent discount or pricing proposal that results in a net merchant margin below 15.0%.',
    category: 'MARGIN',
    status: 'ACTIVE',
    version: 'v4.2.0',
    currentMarginFloor: 15.0,
    enforcementCount: 842,
    codeSnippet: `// DETERMINISTIC COMPILED GUARDRAIL RULE (v4.2.0)
export function enforceMarginFloor(ctx: TransactionContext): GuardrailDecision {
  const netMargin = (ctx.proposedPrice - ctx.unitCost) / ctx.proposedPrice;
  if (netMargin < 0.15) {
    return {
      decision: "BLOCK",
      code: "MARGIN_FLOOR_BREACH",
      reason: \`Proposed margin \${(netMargin*100).toFixed(1)}% is below 15.0% floor.\`,
      exposurePrevented: ctx.unitCost * 0.15
    };
  }
  return { decision: "PASS" };
}`,
    versions: [
      {
        version: 'v4.2.0',
        createdAt: '2026-08-20',
        author: 'Merchant Ops Lead',
        status: 'ACTIVE',
        diffSummary: 'Increased margin floor requirement from 12.0% to 15.0% to safeguard promotional season margins.',
        codeSnippet: 'if (netMargin < 0.15) return BLOCK("MARGIN_FLOOR_BREACH");'
      },
      {
        version: 'v4.1.0',
        createdAt: '2026-05-14',
        author: 'Risk Engineering',
        status: 'ARCHIVED',
        diffSummary: 'Initial policy baseline enforcing 12.0% minimum margin.',
        codeSnippet: 'if (netMargin < 0.12) return BLOCK("MARGIN_FLOOR_BREACH");'
      }
    ],
    impactStats: {
      triggered: 842,
      blocked: 137,
      reviewed: 42,
      permitted: 663,
      valueProtected: 8450000,
      revenueUpliftPercent: 3.2
    }
  },
  {
    id: 'pol_spend_02',
    name: 'Single Transaction Hard Cap ₹5,00,000',
    naturalLanguage: 'Autonomous AI Buyer agents cannot authorize single purchases exceeding ₹5,00,000 without supervisor approval.',
    category: 'SPEND',
    status: 'ACTIVE',
    version: 'v4.1.2',
    spendLimit: 500000,
    enforcementCount: 310,
    codeSnippet: `// DETERMINISTIC COMPILED GUARDRAIL RULE (v4.1.2)
export function enforceSpendCap(ctx: TransactionContext): GuardrailDecision {
  if (ctx.amount > 500000) {
    return {
      decision: "REVIEW",
      code: "SPEND_CAP_EXCEEDED",
      reason: \`Transaction value ₹\${ctx.amount} exceeds autonomous ceiling ₹5,00,000.\`
    };
  }
  return { decision: "PASS" };
}`,
    versions: [
      {
        version: 'v4.1.2',
        createdAt: '2026-07-01',
        author: 'Treasury Admin',
        status: 'ACTIVE',
        diffSummary: 'Bound single procurement transactions strictly to ₹5,00,000 per AI agent runtime.',
        codeSnippet: 'if (ctx.amount > 500000) return REQUIRE_APPROVAL();'
      }
    ],
    impactStats: {
      triggered: 310,
      blocked: 18,
      reviewed: 64,
      permitted: 228,
      valueProtected: 4120000,
      revenueUpliftPercent: 2.1
    }
  },
  {
    id: 'pol_discount_03',
    name: 'Autonomous Agent Discount Ceiling (10%)',
    naturalLanguage: 'Agents can negotiate maximum 10.0% volume discount; higher requires human escalation or halts immediately.',
    category: 'DISCOUNT',
    status: 'ACTIVE',
    version: 'v4.0.5',
    maxDiscountAllowed: 10.0,
    enforcementCount: 194,
    codeSnippet: `// DETERMINISTIC COMPILED GUARDRAIL RULE (v4.0.5)
export function enforceDiscountCeiling(ctx: TransactionContext): GuardrailDecision {
  if (ctx.discountPercentage > 10.0) {
    return {
      decision: "BLOCK",
      code: "DISCOUNT_CEILING_EXCEEDED",
      reason: \`Discount \${ctx.discountPercentage}% exceeds agent maximum 10.0%.\`
    };
  }
  return { decision: "PASS" };
}`,
    versions: [
      {
        version: 'v4.0.5',
        createdAt: '2026-04-10',
        author: 'Commerce Strategy',
        status: 'ACTIVE',
        diffSummary: 'Locked max dynamic discount parameter to 10.0% ceiling.',
        codeSnippet: 'if (discountPercentage > 10.0) return BLOCK();'
      }
    ],
    impactStats: {
      triggered: 194,
      blocked: 51,
      reviewed: 12,
      permitted: 131,
      valueProtected: 2150000,
      revenueUpliftPercent: 1.8
    }
  }
];

export const INITIAL_APPROVALS: ApprovalRequest[] = [
  {
    id: 'appr_8912',
    transactionId: 'TX-9479-REVW',
    agentId: 'AGENT_SUPPORT_09',
    agentName: 'Support Agent #09',
    merchant: 'Nordic Retail Hub',
    intent: 'Discretionary compensation voucher for delayed transit packaging #ORD-4491',
    amount: 14500,
    requestedAt: '4 mins ago',
    reason: 'Exceeds autonomous refund cap of ₹5,000 by ₹9,500. Customer tier: VIP Enterprise.',
    policyException: 'REFUND_CAP_5K',
    riskScore: 0.14,
    status: 'PENDING',
    recommendation: 'Authorize: Long-standing client with ₹4.2M annual GMV. Risk factor nominal.'
  },
  {
    id: 'appr_8913',
    agentId: 'AGENT_BUYER_03',
    agentName: 'Procurement Bot #03',
    merchant: 'Acme Enterprise Corp',
    intent: 'High-volume server rack procurement batch #SRV-901',
    amount: 620000,
    requestedAt: '12 mins ago',
    reason: 'Exceeds single transaction cap ₹5,00,000 by ₹1,20,000.',
    policyException: 'SPEND_CAP_5L',
    riskScore: 0.08,
    status: 'PENDING',
    recommendation: 'Authorize: Contractual quarterly server refresh schedule with Dell OEM.'
  },
  {
    id: 'appr_8914',
    agentId: 'AGENT_REORDER_11',
    agentName: 'Inventory Reorder #11',
    merchant: 'Global Cloud Direct',
    intent: 'Flash inventory reorder: 50x NVMe 2TB Enterprise drives',
    amount: 450000,
    requestedAt: '28 mins ago',
    reason: 'Velocity check: 3rd reorder in 1 hour triggered supervisor review threshold.',
    policyException: 'VELOCITY_SPIKE',
    riskScore: 0.22,
    status: 'PENDING',
    recommendation: 'Investigate: High frequency order spike within 60-minute window.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditRecord[] = [
  {
    id: 'AUD-99142',
    timestamp: '14:26:40',
    event: 'TRANSACTION_PERMITTED',
    actor: 'AGENT_BUYER_17',
    transactionId: 'TX-9481-EXEC',
    policyId: 'MARGIN_FLOOR_15',
    decision: 'PERMIT',
    hash: '0x8f2a91b4c3e7d812',
    details: 'Procurement order of ₹3,20,000 approved & settled via Razorpay testnet gateway.'
  },
  {
    id: 'AUD-99141',
    timestamp: '14:24:12',
    event: 'POLICY_BLOCK',
    actor: 'AGENT_NEGOTIATOR_04',
    transactionId: 'TX-9480-DISC',
    policyId: 'MARGIN_FLOOR_15',
    decision: 'BLOCK',
    hash: '0x3c99f1e4a2b18742',
    details: 'Excess 25% discount halted. Prevented ₹14,200 net margin dilution.'
  },
  {
    id: 'AUD-99140',
    timestamp: '14:22:05',
    event: 'SUPERVISOR_ESCALATION',
    actor: 'AGENT_SUPPORT_09',
    transactionId: 'TX-9479-REVW',
    policyId: 'REFUND_CAP_5K',
    decision: 'REVIEW',
    hash: '0x99a147e8b22c6104',
    details: 'Refund ₹14,500 exceeded autonomous limit ₹5,000. Escrow held for supervisor.'
  },
  {
    id: 'AUD-99139',
    timestamp: '14:15:02',
    event: 'IDEMPOTENCY_DEDUPLICATION',
    actor: 'RAZORPAY_WEBHOOK',
    transactionId: 'TX-9478-IDEM',
    policyId: 'IDEMPOTENCY_LEDGER',
    decision: 'DEDUPLICATED',
    hash: '0x12a99bc45ef77102',
    details: 'Duplicate webhook evt_99182a received. Suppressed second ledger debit.'
  },
  {
    id: 'AUD-99138',
    timestamp: '13:58:30',
    event: 'POLICY_VERSION_DEPLOYED',
    actor: 'MERCHANT_ADMIN_01',
    policyId: 'MARGIN_FLOOR_15',
    decision: 'POLICY_UPDATE',
    hash: '0x77d121ba59f99312',
    details: 'Updated Margin Floor policy from v4.1.0 to v4.2.0 (15.0% floor enforced).'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    timestamp: '4 mins ago',
    title: 'Supervisor Approval Pending',
    description: 'Support Agent #09 requested ₹14,500 refund exceeding autonomous bounds.',
    type: 'APPROVAL',
    targetNav: 'APPROVALS',
    read: false
  },
  {
    id: 'notif_2',
    timestamp: '10 mins ago',
    title: 'High-Value Policy Block',
    description: 'Negotiator #04 attempted 25% discount resulting in 8.4% margin. Halted cleanly.',
    type: 'VIOLATION',
    targetNav: 'TRANSACTIONS',
    read: false
  },
  {
    id: 'notif_3',
    timestamp: '25 mins ago',
    title: 'Gateway Timeout Safely Reconciled',
    description: 'Razorpay 10s latency spike caught; zero duplicate debits created.',
    type: 'INCIDENT',
    targetNav: 'FAILURE_LAB',
    read: false
  },
  {
    id: 'notif_4',
    timestamp: '1 hour ago',
    title: 'Policy v4.2.0 Active',
    description: 'Guaranteed 15.0% margin floor deployed to all 12 live agent runtimes.',
    type: 'POLICY',
    targetNav: 'POLICIES',
    read: true
  }
];

export const REVENUE_INTELLIGENCE_DATA: RevenueMetric = {
  totalRevenue: 48200000,
  revenueUpliftPercent: 24.6,
  marginProtected: 8450000,
  blockedValue: 1240000,
  recoverableValue: 850000,
  conversionRate: 68.4,
  historicalTrend: [
    { date: 'Mon', revenue: 5400000, unprotectedBaseline: 4200000 },
    { date: 'Tue', revenue: 6200000, unprotectedBaseline: 4800000 },
    { date: 'Wed', revenue: 7100000, unprotectedBaseline: 5300000 },
    { date: 'Thu', revenue: 6800000, unprotectedBaseline: 5100000 },
    { date: 'Fri', revenue: 8400000, unprotectedBaseline: 6200000 },
    { date: 'Sat', revenue: 7900000, unprotectedBaseline: 6100000 },
    { date: 'Sun', revenue: 9200000, unprotectedBaseline: 7000000 }
  ],
  aiRecommendation: {
    title: 'DYNAMIC PRICING & VOLUME TIERS',
    description: 'Dynamic volume discount policy +12% on orders > 10 units maintains 17.8% net margin while lifting velocity +24.6%.',
    predictedUplift: '+18.4% Revenue',
    measuredImpact: '0.00% Margin Floor Breach'
  }
};

export const SYSTEM_HEALTH_ITEMS: SystemHealthItem[] = [
  { name: 'POLICY ENGINE', latencyMs: 1.24, uptimePercent: 99.99, status: 'OPERATIONAL', componentKey: 'policy_core', description: 'Deterministic AST evaluation' },
  { name: 'ALIGNMENT PERIMETER', latencyMs: 0.88, uptimePercent: 99.99, status: 'OPERATIONAL', componentKey: 'alignment_bounds', description: 'Real-time spend & margin limits' },
  { name: 'RISK SCORING MATRIX', latencyMs: 2.15, uptimePercent: 99.98, status: 'OPERATIONAL', componentKey: 'risk_matrix', description: 'Anomaly velocity analysis' },
  { name: 'RAZORPAY TEST GATEWAY', latencyMs: 14.8, uptimePercent: 99.95, status: 'OPERATIONAL', componentKey: 'razorpay_api', description: 'Testnet settlement relay' },
  { name: 'IDEMPOTENCY LEDGER', latencyMs: 0.42, uptimePercent: 100.0, status: 'OPERATIONAL', componentKey: 'idempotency_store', description: 'SHA-256 deduplication state' },
  { name: 'SUPERVISOR RELAY', latencyMs: 4.10, uptimePercent: 100.0, status: 'OPERATIONAL', componentKey: 'supervisor_queue', description: 'Human-in-the-loop escalation' }
];

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'SCENARIO_1_SUCCESS',
    stepNumber: 1,
    label: 'SAFE TRANSACTION: Valid Procurement',
    badge: '10-Step Pass',
    title: 'AI Buyer #17 buys 5 laptops for ₹3,20,000 (Within Limits)',
    description: 'Valid order passes spend check (₹3.2L < ₹5.0L), 18.2% margin floor, and settles on Razorpay Testnet.',
    expectedOutcome: '100% Policy Bound & Settled',
    details: 'Flow: Intent → Policy Check → Risk Check → Authority Check → Payment Authorization → Razorpay Test Gateway → Verification → Settlement.'
  },
  {
    id: 'SCENARIO_2_DISCOUNT_BLOCK',
    stepNumber: 2,
    label: 'MARGIN VIOLATION: Excess 25% Discount',
    badge: 'Halted At Core',
    title: 'AI Negotiator proposes 25% discount (Ceiling is 10%)',
    description: 'Deterministic policy halts transaction to safeguard margin floor (Proposed 8.4% < 15.0% floor).',
    expectedOutcome: 'Blocked • ₹14,200 Margin Saved',
    details: 'Guardrail identifies -6.6% margin deficit and automatically suppresses payment token generation.'
  },
  {
    id: 'SCENARIO_3_APPROVAL_REQUIRED',
    stepNumber: 3,
    label: 'HUMAN REVIEW: ₹14,500 Refund',
    badge: 'Supervisor Queue',
    title: 'Support Agent requests ₹14,500 refund (> ₹5,000 limit)',
    description: 'Escalates to human supervisor approval queue with instant telemetry and audit logs.',
    expectedOutcome: 'Held in Escrow for Sign-off',
    details: 'Supervisor can inspect customer order history, risk score (0.14), and authorize or reject.'
  },
  {
    id: 'SCENARIO_4_DUPLICATE_WEBHOOK',
    stepNumber: 4,
    label: 'IDEMPOTENCY: Duplicate Webhooks',
    badge: '0 Payout Leaks',
    title: 'Razorpay webhook delivered twice for same transaction',
    description: 'Idempotency ledger prevents double-capture and duplicate refunds using event hashes.',
    expectedOutcome: 'Deduplicated • 0 Multiple Debits',
    details: 'Event #1 Accepted. Event #2 Deduplicated and suppressed.'
  },
  {
    id: 'SCENARIO_5_PAYMENT_VERIFICATION',
    stepNumber: 5,
    label: 'GATEWAY TIMEOUT & RECOVERY',
    badge: 'Safe Idempotent Retry',
    title: 'Simulates 10s Razorpay timeout with safe backoff',
    description: 'Recovers without duplicate debits by verifying state before reissuing tokens.',
    expectedOutcome: 'Reconciled in 1.24ms',
    details: 'Request → Timeout → Retry → Idempotency Check → Safe Recovery → Verified State.'
  },
  {
    id: 'SCENARIO_6_REVENUE_OPTIMIZATION',
    stepNumber: 6,
    label: 'GROWTH: Governed Margin Uplift',
    badge: '+24.6% Lift',
    title: 'Dynamic volume discount policy simulation',
    description: 'Merchant unlocks 24.6% higher volume while maintaining a 15.0% margin floor.',
    expectedOutcome: 'Revenue Lift Without Margin Slip',
    details: 'Simulates safe AI autonomous negotiation boosting conversion to 68.4%.'
  }
];

export const FAILURE_SCENARIOS: FailureScenario[] = [
  {
    id: 'fail_timeout',
    title: 'Razorpay Gateway Latency Spike & Timeout',
    description: 'Simulates a 10-second payment gateway timeout during payment.capture call.',
    faultType: 'GATEWAY_TIMEOUT',
    expectedBehavior: 'Control Plane triggers exponential backoff retry & idempotent verify before re-issuing.',
    actualResponse: 'Halted re-issue, verified existing order_NYz8923h status on Razorpay API, resumed clean state.',
    recoveryAction: 'Verified with zero duplicate debits.',
    verificationProof: 'IDEMPOTENCY_KEY_0x91ba_VERIFIED'
  },
  {
    id: 'fail_spend',
    title: 'Autonomous Spend Cap Exceeded (₹7,50,000 > ₹5,00,000)',
    description: 'AI Agent attempts to place a ₹7,50,000 order exceeding its assigned authority.',
    faultType: 'SPEND_CAP_EXCEEDED',
    expectedBehavior: 'Control Plane hard-blocks payment token generation and halts Razorpay call.',
    actualResponse: 'Interception triggered at Authority Check Step #3. Delta ₹2,50,000 flagged.',
    recoveryAction: 'Halted cleanly at Authority Boundary.',
    verificationProof: 'SPEND_CAP_INTERCEPT_HASH_0x77ab'
  },
  {
    id: 'fail_webhook',
    title: 'Duplicate Webhook Delivery (Race Condition)',
    description: 'Simulates 5 concurrent identical Razorpay payment.captured webhook requests.',
    faultType: 'DUPLICATE_WEBHOOK',
    expectedBehavior: 'Idempotency ledger catches duplicates using SHA-256 event hash; only 1 ledger update occurs.',
    actualResponse: 'Event 1 captured; Events 2-5 dropped with 200 OK + "DUPLICATE_IGNORED" response.',
    recoveryAction: '100% Idempotent. 0 Multi-actions.',
    verificationProof: 'LEDGER_TX_HASH_MATCH_0x99bc'
  },
  {
    id: 'fail_unbound',
    title: 'Unbound AI Proposal (Sub-zero Margin Hallucination)',
    description: 'AI model suggests a 60% promo code without merchant policy constraints.',
    faultType: 'UNBOUND_AGENT_PROPOSAL',
    expectedBehavior: 'Deterministic AST evaluator rejects proposal at Step 4; suppresses execution.',
    actualResponse: 'Rejected: Negative profit margin (-24.2%). Intercepted before dispatch.',
    recoveryAction: 'Proposal quarantined and logged in Audit Trail.',
    verificationProof: 'POLICY_AST_ASSERTION_PASS'
  }
];

export const OBSERVABILITY_DATA: Record<string, ObservabilityPoint[]> = {
  '1H': [
    { time: '14:00', latency: 1.18, throughput: 142, errorRate: 0.00, policyEvals: 420, riskEvals: 390 },
    { time: '14:10', latency: 1.22, throughput: 168, errorRate: 0.00, policyEvals: 480, riskEvals: 440 },
    { time: '14:20', latency: 1.24, throughput: 195, errorRate: 0.00, policyEvals: 560, riskEvals: 510 },
    { time: '14:30', latency: 1.21, throughput: 210, errorRate: 0.00, policyEvals: 610, riskEvals: 580 }
  ],
  '24H': [
    { time: '00:00', latency: 1.15, throughput: 85, errorRate: 0.00, policyEvals: 2200, riskEvals: 2100 },
    { time: '06:00', latency: 1.19, throughput: 140, errorRate: 0.00, policyEvals: 3400, riskEvals: 3200 },
    { time: '12:00', latency: 1.25, throughput: 245, errorRate: 0.01, policyEvals: 6800, riskEvals: 6400 },
    { time: '18:00', latency: 1.24, throughput: 210, errorRate: 0.00, policyEvals: 5900, riskEvals: 5500 }
  ],
  '7D': [
    { time: 'Day 1', latency: 1.20, throughput: 4200, errorRate: 0.00, policyEvals: 18400, riskEvals: 17200 },
    { time: 'Day 3', latency: 1.22, throughput: 4800, errorRate: 0.00, policyEvals: 21000, riskEvals: 19800 },
    { time: 'Day 5', latency: 1.24, throughput: 5600, errorRate: 0.01, policyEvals: 24500, riskEvals: 23100 },
    { time: 'Day 7', latency: 1.24, throughput: 6100, errorRate: 0.00, policyEvals: 26800, riskEvals: 25400 }
  ],
  '30D': [
    { time: 'W1', latency: 1.21, throughput: 28000, errorRate: 0.00, policyEvals: 110000, riskEvals: 104000 },
    { time: 'W2', latency: 1.23, throughput: 31000, errorRate: 0.01, policyEvals: 125000, riskEvals: 118000 },
    { time: 'W3', latency: 1.24, throughput: 34000, errorRate: 0.00, policyEvals: 138000, riskEvals: 129000 },
    { time: 'W4', latency: 1.24, throughput: 39000, errorRate: 0.00, policyEvals: 154000, riskEvals: 146000 }
  ]
};
