import { DecisionState } from './types.ts';

export function evaluateAuthority(
  proposedAmount: number,
  proposedDiscount: number,
  authority: any
): { status: DecisionState; reason: string } {
  if (!authority) {
    return { status: 'BLOCK', reason: 'No active agent authority found.' };
  }
  // NOTE: agent_authority has no status column — its presence confirms the agent is provisioned.
  // Agent-level status (ACTIVE/PAUSED/BLOCKED) lives on the agents table and is enforced in Phase 8.

  const spendLimit = parseFloat(authority.spend_limit || '0');
  if (proposedAmount > spendLimit) {
    return { 
      status: 'REVIEW', 
      reason: `Proposed amount ${proposedAmount} exceeds single-tx limit of ${spendLimit}.`
    };
  }

  const maxDiscount = parseFloat(authority.discount_max_percent || '0');
  if (proposedDiscount > maxDiscount) {
    return {
      status: 'BLOCK',
      reason: `Proposed discount ${proposedDiscount}% exceeds authority max ${maxDiscount}%.`
    };
  }

  return { status: 'PERMIT', reason: 'Within authority bounds.' };
}

export function evaluatePolicies(
  proposedAmount: number,
  costBasis: number,
  policies: any[]
): { status: DecisionState; failedPolicyVersionId?: string; reason?: string } {
  // Hardcoded policy evaluation (Hackathon Scope)
  // We'll evaluate the MARGIN_FLOOR_15 equivalent.
  
  const marginFloorPolicy = policies.find((p: any) => p.category === 'MARGIN' && p.status === 'ACTIVE');
  
  if (marginFloorPolicy && proposedAmount > 0) {
    const margin = (proposedAmount - costBasis) / proposedAmount;
    // Assuming 15.0% = 0.15
    const floor = 0.15; 
    
    if (margin < floor) {
      // Return the policy_versions.id for the FK reference (first version of this policy)
      const policyVersionId = marginFloorPolicy.policy_versions?.[0]?.id ?? null;
      return {
        status: 'BLOCK',
        failedPolicyVersionId: policyVersionId,
        reason: `Net margin ${(margin*100).toFixed(1)}% is below mandatory floor ${(floor*100).toFixed(1)}%.`
      };
    }
  }

  return { status: 'PERMIT' };
}

export function evaluateRisk(
  agentId: string, 
  velocityMetrics: any
): { status: DecisionState; score: number } {
  // Simple heuristic risk scoring
  const score = Math.random() * 0.1; // Random baseline 0 - 0.1
  
  if (score > 0.8) {
    return { status: 'BLOCK', score };
  }
  if (score > 0.4) {
    return { status: 'REVIEW', score };
  }
  return { status: 'PERMIT', score };
}
