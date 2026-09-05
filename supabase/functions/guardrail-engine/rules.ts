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
  
  // Case-insensitive status match — DB stores 'active' (lowercase)
  const marginFloorPolicy = policies.find((p: any) => p.category === 'MARGIN' && p.status?.toLowerCase() === 'active');
  
  if (marginFloorPolicy && proposedAmount > 0) {
    const margin = (proposedAmount - costBasis) / proposedAmount;
    // Read floor from policy_versions.configuration; fall back to 0.15 if not set
    const floor: number = marginFloorPolicy.policy_versions?.[0]?.configuration?.floor ?? 0.15;
    
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
  agent: any,
  payload: any,
  authority: any
): { status: DecisionState; score: number; level: string; reasons: string[] } {
  const reasons: string[] = [];
  
  // 1. Agent intrinsic risk score (0-100)
  let score = parseFloat(agent?.risk_score || '0');
  
  // 2. Amount utilization penalty
  if (authority && authority.spend_limit) {
    const spendLimit = parseFloat(authority.spend_limit);
    if (spendLimit > 0) {
      const amountUtilization = payload.proposedAmount / spendLimit;
      if (amountUtilization > 0.8) {
        score += 10;
        reasons.push(`High amount utilization (${(amountUtilization * 100).toFixed(1)}%)`);
      }
      if (amountUtilization > 1.0) {
        score += 20;
        reasons.push(`Amount exceeds limit`);
      }
    }
  }

  // 3. Discount utilization penalty
  if (authority && authority.discount_max_percent) {
    const maxDiscount = parseFloat(authority.discount_max_percent);
    if (maxDiscount > 0) {
      const discountUtilization = payload.proposedDiscount / maxDiscount;
      if (discountUtilization > 0.8) {
        score += 10;
        reasons.push(`High discount utilization (${(discountUtilization * 100).toFixed(1)}%)`);
      }
    }
  }
  
  // 4. Enforce Agent Status
  if (agent?.status === 'BLOCKED') {
    score = 100; // Forced to max risk
    reasons.push('Agent status is BLOCKED');
  } else if (agent?.status === 'PAUSED') {
    score = Math.max(score, 50); // Forced to at least HIGH risk (REVIEW)
    reasons.push('Agent status is PAUSED');
  }

  // Clamp score to 0-100
  score = Math.min(Math.max(score, 0), 100);

  // 5. Determine level and status based on score
  let level = 'LOW';
  let status: DecisionState = 'PERMIT';

  if (score >= 75) {
    level = 'CRITICAL';
    status = 'BLOCK';
  } else if (score >= 50) {
    level = 'HIGH';
    status = 'REVIEW';
  } else if (score >= 25) {
    level = 'MEDIUM';
    status = 'PERMIT';
  } else {
    level = 'LOW';
    status = 'PERMIT';
  }

  if (reasons.length === 0) {
    reasons.push('Normal operational bounds');
  }

  return { status, score, level, reasons };
}
