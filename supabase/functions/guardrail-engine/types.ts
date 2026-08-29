export interface EngineRequestPayload {
  agentId: string;
  intent: string;
  proposedAmount: number;
  proposedDiscount: number; // e.g. 5.0 for 5%
  estimatedCostBasis: number;
  idempotencyKey: string;
}

export type DecisionState = 'PERMIT' | 'REVIEW' | 'BLOCK';

export interface GuardrailDecisionResult {
  decision: DecisionState;
  finalRiskScore: number;
  details: {
    authority: {
      status: DecisionState;
      reason: string;
    };
    policies: {
      status: DecisionState;
      failedPolicyVersionId?: string;
      reason?: string;
    };
    risk: {
      status: DecisionState;
      score: number;
    };
  };
  transactionId?: string;
}
