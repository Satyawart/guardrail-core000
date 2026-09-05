-- Phase 33 RPC Fixes

-- 1. Revenue Intelligence
CREATE OR REPLACE FUNCTION get_revenue_intelligence(p_time_range TEXT DEFAULT '7D')
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_merchant_id UUID;
    v_role TEXT;
    v_start_time TIMESTAMPTZ;
    v_total_revenue NUMERIC := 0;
    v_blocked_value NUMERIC := 0;
    v_margin_protected NUMERIC := 0;
    v_conversion_rate NUMERIC := 0;
    v_total_count INT := 0;
    v_permit_count INT := 0;
    v_historical_trend JSONB := '[]'::JSONB;
BEGIN
    v_merchant_id := auth_merchant_id();
    v_role := (current_setting('request.jwt.claims', true)::jsonb ->> 'user_role')::TEXT;

    IF v_merchant_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: Merchant ID could not be resolved';
    END IF;

    v_start_time := CASE p_time_range
        WHEN '1H' THEN now() - interval '1 hour'
        WHEN '24H' THEN now() - interval '24 hours'
        WHEN '7D' THEN now() - interval '7 days'
        WHEN '30D' THEN now() - interval '30 days'
        ELSE now() - interval '7 days'
    END;

    SELECT 
        COALESCE(SUM(t.amount) FILTER (WHERE gd.decision = 'PERMIT'), 0),
        COALESCE(SUM(t.amount) FILTER (WHERE gd.decision = 'BLOCK'), 0),
        COUNT(*) FILTER (WHERE gd.decision = 'PERMIT'),
        COUNT(*)
    INTO 
        v_total_revenue,
        v_blocked_value,
        v_permit_count,
        v_total_count
    FROM transactions t
    JOIN guardrail_decisions gd ON t.id = gd.transaction_id
    WHERE t.created_at >= v_start_time
      AND t.merchant_id = v_merchant_id;

    v_margin_protected := (v_total_revenue * 0.15) + (v_blocked_value * 0.15);
    
    IF v_total_count > 0 THEN
        v_conversion_rate := ROUND((v_permit_count::NUMERIC / v_total_count::NUMERIC) * 100, 1);
    ELSE
        v_conversion_rate := 0;
    END IF;

    WITH series AS (
        SELECT generate_series(
            date_trunc('day', v_start_time),
            date_trunc('day', now()),
            '1 day'::interval
        ) AS bucket
    ),
    trend_data AS (
        SELECT 
            to_char(s.bucket, 'Mon DD') as date,
            COALESCE(SUM(t.amount) FILTER (WHERE gd.decision = 'PERMIT'), 0) as revenue,
            COALESCE(SUM(t.amount) FILTER (WHERE gd.decision = 'PERMIT'), 0) + COALESCE(SUM(t.amount) FILTER (WHERE gd.decision = 'BLOCK'), 0) as "unprotectedBaseline"
        FROM series s
        LEFT JOIN transactions t ON date_trunc('day', t.created_at) = s.bucket 
            AND t.merchant_id = v_merchant_id
        LEFT JOIN guardrail_decisions gd ON t.id = gd.transaction_id
        GROUP BY s.bucket
        ORDER BY s.bucket ASC
    )
    SELECT COALESCE(jsonb_agg(to_jsonb(trend_data)), '[]'::jsonb) INTO v_historical_trend FROM trend_data;

    RETURN jsonb_build_object(
        'totalRevenue', v_total_revenue,
        'marginProtected', v_margin_protected,
        'blockedValue', v_blocked_value,
        'conversionRate', v_conversion_rate,
        'revenueUpliftPercent', CASE WHEN (v_total_revenue + v_blocked_value) > 0 THEN ROUND((v_total_revenue / (v_total_revenue + v_blocked_value)) * 100, 1) ELSE 0 END,
        'historicalTrend', v_historical_trend
    );
END;
$$;


-- 2. Risk Intelligence
CREATE OR REPLACE FUNCTION get_risk_intelligence(p_time_range TEXT DEFAULT '7D')
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_merchant_id UUID;
    v_role TEXT;
    v_start_time TIMESTAMPTZ;
    v_avg_agent_risk NUMERIC := 0.04;
    v_avg_amount_util NUMERIC := 0.01;
    v_avg_discount_util NUMERIC := 0.01;
    v_avg_score NUMERIC := 0.04;
    v_total_evals INT := 0;
BEGIN
    v_merchant_id := auth_merchant_id();
    v_role := (current_setting('request.jwt.claims', true)::jsonb ->> 'user_role')::TEXT;

    IF v_merchant_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: Merchant ID could not be resolved';
    END IF;

    v_start_time := CASE p_time_range
        WHEN '1H' THEN now() - interval '1 hour'
        WHEN '24H' THEN now() - interval '24 hours'
        WHEN '7D' THEN now() - interval '7 days'
        WHEN '30D' THEN now() - interval '30 days'
        ELSE now() - interval '7 days'
    END;

    SELECT 
        COUNT(*),
        COALESCE(AVG(risk_score), 4.0),
        COALESCE(AVG((indicators->>'agentRiskScore')::NUMERIC), 4.0),
        COALESCE(AVG((indicators->>'amountUtilization')::NUMERIC), 0.01),
        COALESCE(AVG((indicators->>'discountUtilization')::NUMERIC), 0.01)
    INTO 
        v_total_evals,
        v_avg_score,
        v_avg_agent_risk,
        v_avg_amount_util,
        v_avg_discount_util
    FROM risk_evaluations
    WHERE created_at >= v_start_time
      AND merchant_id = v_merchant_id;

    v_avg_score := v_avg_score / 100.0;
    v_avg_agent_risk := v_avg_agent_risk / 100.0;

    RETURN jsonb_build_object(
        'averageScore', ROUND(v_avg_score, 2),
        'components', jsonb_build_array(
            jsonb_build_object(
                'name', 'Agent Intrinsic Risk',
                'score', ROUND(LEAST(v_avg_agent_risk, 0.25), 2),
                'max', 0.25,
                'status', CASE WHEN v_avg_agent_risk > 0.15 THEN 'MEDIUM' ELSE 'LOW' END,
                'details', 'Average intrinsic agent risk across all active runtimes.'
            ),
            jsonb_build_object(
                'name', 'Amount Utilization',
                'score', ROUND(LEAST(v_avg_amount_util, 0.20), 2),
                'max', 0.20,
                'status', CASE WHEN v_avg_amount_util > 0.8 THEN 'HIGH' WHEN v_avg_amount_util > 0.5 THEN 'MEDIUM' ELSE 'LOW' END,
                'details', 'Average capital utilization per transaction against authorized limits.'
            ),
            jsonb_build_object(
                'name', 'Discount Utilization',
                'score', ROUND(LEAST(v_avg_discount_util, 0.20), 2),
                'max', 0.20,
                'status', CASE WHEN v_avg_discount_util > 0.8 THEN 'HIGH' WHEN v_avg_discount_util > 0.5 THEN 'MEDIUM' ELSE 'LOW' END,
                'details', 'Promotional discounting bounded against organizational margins.'
            )
        )
    );
END;
$$;


-- 3. Governance Analytics
CREATE OR REPLACE FUNCTION get_governance_analytics(p_time_range TEXT DEFAULT '7D')
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_merchant_id UUID;
    v_start_time TIMESTAMPTZ;
    v_active_agents INT := 0;
    v_total_governed_spend NUMERIC := 0;
    v_block_count INT := 0;
    v_pending_reviews INT := 0;
BEGIN
    v_merchant_id := auth_merchant_id();
    IF v_merchant_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: Merchant ID could not be resolved';
    END IF;

    v_start_time := CASE p_time_range
        WHEN '1H' THEN now() - interval '1 hour'
        WHEN '24H' THEN now() - interval '24 hours'
        WHEN '7D' THEN now() - interval '7 days'
        WHEN '30D' THEN now() - interval '30 days'
        ELSE now() - interval '7 days'
    END;

    -- Active Agents
    SELECT COUNT(*) INTO v_active_agents FROM agents WHERE merchant_id = v_merchant_id AND status = 'ACTIVE';
    
    -- Governed Spend (Sum of all transactions regardless of permit/block)
    SELECT COALESCE(SUM(amount), 0) INTO v_total_governed_spend FROM transactions WHERE merchant_id = v_merchant_id AND created_at >= v_start_time;
    
    -- Block Count
    SELECT COUNT(*) INTO v_block_count FROM guardrail_decisions WHERE merchant_id = v_merchant_id AND decision = 'BLOCK' AND created_at >= v_start_time;
    
    -- Pending Reviews
    SELECT COUNT(*) INTO v_pending_reviews FROM human_reviews hr 
    JOIN transactions t ON hr.transaction_id = t.id 
    WHERE hr.merchant_id = v_merchant_id AND hr.status = 'PENDING';

    RETURN jsonb_build_object(
        'active_agents', v_active_agents,
        'total_governed_spend', v_total_governed_spend,
        'block_count', v_block_count,
        'pending_reviews', v_pending_reviews
    );
END;
$$;


-- 4. Process Review Decision
CREATE OR REPLACE FUNCTION process_review_decision(p_transaction_id UUID, p_decision TEXT, p_reason TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_merchant_id UUID;
    v_actor_email TEXT;
    v_review_exists BOOLEAN;
BEGIN
    v_merchant_id := auth_merchant_id();
    v_actor_email := (current_setting('request.jwt.claims', true)::jsonb ->> 'email')::TEXT;

    IF v_merchant_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: Merchant ID could not be resolved';
    END IF;

    IF p_decision NOT IN ('APPROVE', 'REJECT') THEN
        RAISE EXCEPTION 'Invalid decision. Must be APPROVE or REJECT.';
    END IF;

    -- Check if review exists and is pending
    SELECT EXISTS (
        SELECT 1 FROM human_reviews 
        WHERE transaction_id = p_transaction_id 
        AND merchant_id = v_merchant_id 
        AND status = 'PENDING'
    ) INTO v_review_exists;

    IF NOT v_review_exists THEN
        RAISE EXCEPTION 'Review not found or already processed.';
    END IF;

    -- Update Review
    UPDATE human_reviews
    SET status = CASE WHEN p_decision = 'APPROVE' THEN 'APPROVED' ELSE 'REJECTED' END,
        reviewed_by = v_actor_email,
        reviewed_at = now(),
        notes = p_reason
    WHERE transaction_id = p_transaction_id;

    -- Update Transaction Status
    UPDATE transactions
    SET status = CASE WHEN p_decision = 'APPROVE' THEN 'APPROVED' ELSE 'REJECTED' END,
        updated_at = now()
    WHERE id = p_transaction_id;
    
    -- Insert Audit Event
    INSERT INTO audit_events (merchant_id, event, actor, transaction_id, decision, details, hash)
    VALUES (
        v_merchant_id,
        'SUPERVISOR_REVIEW',
        v_actor_email,
        p_transaction_id,
        CASE WHEN p_decision = 'APPROVE' THEN 'PERMIT' ELSE 'BLOCK' END,
        p_reason,
        encode(digest(p_transaction_id::text || p_decision || now()::text, 'sha256'), 'hex')
    );

    RETURN jsonb_build_object('success', true, 'status', CASE WHEN p_decision = 'APPROVE' THEN 'APPROVED' ELSE 'REJECTED' END);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_revenue_intelligence TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_risk_intelligence TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_governance_analytics TO authenticated;
GRANT EXECUTE ON FUNCTION public.process_review_decision TO authenticated;
