import { supabase } from './supabase';

export interface EngineRequestPayload {
  agentId: string;
  intent: string;
  proposedAmount: number;
  proposedDiscount: number;
  estimatedCostBasis: number;
  idempotencyKey: string;
}

export type DecisionState = 'PERMIT' | 'REVIEW' | 'BLOCK';

export interface GuardrailDecisionResult {
  decision: DecisionState;
  finalRiskScore: number;
  intentId?: string;
  transactionId?: string;
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
      level?: string;
      reasons?: string[];
    };
  };
}

/**
 * Invokes the secure Guardrail Core Engine (Supabase Edge Function).
 * The user's active session JWT is automatically included by the Supabase client.
 */
export async function invokeGuardrailEngine(payload: EngineRequestPayload): Promise<GuardrailDecisionResult> {
  const { data, error } = await supabase.functions.invoke<GuardrailDecisionResult>('guardrail-engine', {
    body: payload,
  });

  if (error) {
    console.error('Failed to invoke Guardrail Engine:', error);
    throw new Error(`Engine Invocation Failed: ${error.message}`);
  }

  if (!data) {
    throw new Error('Engine returned empty response');
  }

  return data;
}
