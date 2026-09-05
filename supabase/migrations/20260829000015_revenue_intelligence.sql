-- GUARDRAIL CORE: Migration 015 — Phase 27 Live Revenue Intelligence
-- Purpose: Implement a secure RPC to calculate revenue and margin ROI metrics securely at the DB layer.
-- SECURITY MODEL:
--   - RPC runs as SECURITY DEFINER to bypass client restrictions and perform heavy aggregations securely.
--   - Tenant isolation is strictly enforced via merchant_id JWT claims.

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
    -- 1. Identity & Auth Resolution
    v_merchant_id := (current_setting('request.jwt.claims', true)::jsonb ->> 'merchant_id')::UUID;
    v_role := (current_setting('request.jwt.claims', true)::jsonb ->> 'role')::TEXT;

    IF v_role != 'PLATFORM_OPERATOR' AND v_merchant_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: Missing merchant_id in JWT claims';
    END IF;

    -- 2. Time Range Resolution
    v_start_time := CASE p_time_range
        WHEN '1H' THEN now() - interval '1 hour'
        WHEN '24H' THEN now() - interval '24 hours'
        WHEN '7D' THEN now() - interval '7 days'
        WHEN '30D' THEN now() - interval '30 days'
        ELSE now() - interval '7 days'
    END;

    -- 3. Calculate Aggregates
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
      AND (v_role = 'PLATFORM_OPERATOR' OR t.merchant_id = v_merchant_id);

    -- Base margin protected calculation (15% of safely governed revenue + prevented leakage)
    v_margin_protected := (v_total_revenue * 0.15) + (v_blocked_value * 0.15);
    
    IF v_total_count > 0 THEN
        v_conversion_rate := ROUND((v_permit_count::NUMERIC / v_total_count::NUMERIC) * 100, 1);
    ELSE
        v_conversion_rate := 0;
    END IF;

    -- 4. Historical Trend (Grouped by time intervals)
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
            AND (v_role = 'PLATFORM_OPERATOR' OR t.merchant_id = v_merchant_id)
        LEFT JOIN guardrail_decisions gd ON t.id = gd.transaction_id
        GROUP BY s.bucket
        ORDER BY s.bucket ASC
    )
    SELECT COALESCE(jsonb_agg(to_jsonb(trend_data)), '[]'::jsonb) INTO v_historical_trend FROM trend_data;

    -- 5. Return JSONB payload
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
