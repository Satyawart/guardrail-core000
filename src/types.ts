export type TransactionStatus = 'SUCCESS' | 'BLOCKED' | 'REVIEW' | 'PROCESSING' | 'SETTLED' | 'FAILED' | 'AI' | 'REJECTED' | 'PENDING_REVIEW';

export type DemoScenarioId = 
  | 'SCENARIO_1_SUCCESS'
  | 'SCENARIO_2_DISCOUNT_BLOCK'
  | 'SCENARIO_3_APPROVAL_REQUIRED'
  | 'SCENARIO_4_DUPLICATE_WEBHOOK'
  | 'SCENARIO_5_PAYMENT_VERIFICATION'
  | 'SCENARIO_6_REVENUE_OPTIMIZATION';

export type NavItem = 
  | 'OVERVIEW' 
  | 'AGENTS'
  | 'TRANSACTIONS' 
  | 'POLICIES' 
  | 'APPROVALS' 
  | 'RISK'
  | 'FAILURE_LAB' 
  | 'EVALUATION' 
  | 'REVENUE'
  | 'AUDIT'
  | 'SYSTEM'
  | 'BEFORE_AFTER';

export interface LifecycleStep {
  id: string;
  stepNumber: number;
  name: string;
  title: string;
  status: 'PASS' | 'BLOCK' | 'REVIEW' | 'INFO';
  timestamp: string;
  latencyMs: number;
  input?: string;
  ruleEvaluated?: string;
  output?: string;
  isExpanded?: boolean;
}

export interface ExplainabilityCheck {
  text: string;
  passed: boolean;
  value?: string;
}

export interface ExplainabilityReport {
  decision: 'PERMIT' | 'BLOCKED' | 'REVIEW';
  summary: string;
  exposurePrevented?: number;
  checks: ExplainabilityCheck[];
}

export interface Transaction {
  id: string;
  timestamp: string;
  actor: string;
  actorId?: string;
  actorType: 'AI Agent' | 'Human Admin' | 'Razorpay Webhook' | 'System';
  action: string;
  amount: number;
  status: TransactionStatus;
  merchantName: string;
  merchantId?: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  policyApplied?: string;
  reason?: string;
  hash?: string;
  steps: LifecycleStep[];
  explainability?: ExplainabilityReport;
  razorpayPaymentId?: string;
  idempotencyKey?: string;
}

export interface KpiMetric {
  id: string;
  type: 'agents' | 'authorized' | 'blocked' | 'approvals' | 'volume' | 'violations';
  title: string;
  value: string;
  change: string;
  deltaLabel?: string;
}

export interface PolicyVersion {
  version: string;
  createdAt: string;
  author: string;
  status: 'ACTIVE' | 'ARCHIVED';
  diffSummary?: string;
  codeSnippet: string;
}

export interface PolicyRule {
  id: string;
  name: string;
  naturalLanguage: string;
  category: 'MARGIN' | 'SPEND' | 'RISK' | 'VELOCITY' | 'DISCOUNT';
  status: 'ACTIVE' | 'DRAFT' | 'PAUSED';
  enforcementCount: number;
  codeSnippet: string;
  version: string;
  currentMarginFloor?: number;
  maxDiscountAllowed?: number;
  spendLimit?: number;
  versions?: PolicyVersion[];
  impactStats?: {
    triggered: number;
    blocked: number;
    reviewed: number;
    permitted: number;
    valueProtected: number;
    revenueUpliftPercent: number;
  };
}

export interface ApprovalRequest {
  id: string;
  transactionId?: string;
  agentId: string;
  agentName: string;
  merchant: string;
  intent: string;
  amount: number;
  requestedAt: string;
  reason: string;
  policyException: string;
  riskScore: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  recommendation: string;
}

export interface AgentActivityEntry {
  id: string;
  timestamp: string;
  intent: string;
  reasoning: string;
  action: string;
  policyResult: 'PASS' | 'BLOCK' | 'REVIEW';
  authorityResult: 'PASS' | 'BLOCK' | 'REVIEW';
  riskResult: 'PASS' | 'BLOCK' | 'REVIEW';
  decision: 'PERMIT' | 'BLOCK' | 'REVIEW';
  amount: number;
  txId?: string;
}

export interface RiskComponent {
  name: string;
  score: number;
  max: number;
  status: 'ZERO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details: string;
}

export interface RiskIntelligenceMetric {
  averageScore: number;
  components: RiskComponent[];
}

export interface AgentRuntime {
  id: string;
  name: string;
  type: string;
  status: 'ACTIVE' | 'PAUSED' | 'BLOCKED';
  spendLimit: number;
  usedSpend: number;
  remainingSpend: number;
  utilizationPercent: number;
  discountAuthorityMaxPercent: number;
  refundAuthorityMax: number;
  riskScore: number;
  activePoliciesCount: number;
  lastAction: string;
  lastActionTime: string;
  latencyAvg: string;
  tasksCompleted: number;
  timeline: AgentActivityEntry[];
}

export interface FailureScenario {
  id: string;
  title: string;
  description: string;
  faultType: 'GATEWAY_TIMEOUT' | 'SPEND_CAP_EXCEEDED' | 'DUPLICATE_WEBHOOK' | 'UNBOUND_AGENT_PROPOSAL';
  expectedBehavior: string;
  actualResponse: string;
  recoveryAction: string;
  verificationProof: string;
}

export interface RevenueMetric {
  totalRevenue: number;
  revenueUpliftPercent: number;
  marginProtected: number;
  blockedValue: number;
  recoverableValue: number;
  conversionRate: number;
  historicalTrend: { date: string; revenue: number; unprotectedBaseline: number }[];
  aiRecommendation: {
    title: string;
    description: string;
    predictedUplift: string;
    measuredImpact: string;
  };
}

export interface SystemHealthItem {
  name: string;
  latencyMs: number;
  uptimePercent: number;
  status: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE';
  componentKey: string;
  description?: string;
}

export interface DemoScenario {
  id: DemoScenarioId;
  stepNumber: number;
  label: string;
  badge: string;
  title: string;
  description: string;
  expectedOutcome: string;
  details?: string;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  event: string;
  actor: string;
  transactionId?: string;
  policyId?: string;
  decision: 'PERMIT' | 'BLOCK' | 'REVIEW' | 'RECOVERY' | 'DEDUPLICATED' | 'POLICY_UPDATE';
  hash: string;
  details: string;
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'APPROVAL' | 'VIOLATION' | 'INCIDENT' | 'POLICY' | 'SYSTEM';
  targetNav: NavItem;
  read: boolean;
}

export interface ObservabilityPoint {
  time: string;
  latency: number;
  throughput: number;
  errorRate: number;
  policyEvals: number;
  riskEvals: number;
}
