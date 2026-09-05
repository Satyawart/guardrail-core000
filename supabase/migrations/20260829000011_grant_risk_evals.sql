-- GUARDRAIL CORE: Migration 011 — Grant risk_evaluations to authenticated
-- Purpose: Grant minimum required privileges on public.risk_evaluations to the authenticated role.
--
-- SECURITY MODEL:
--   - RLS is NOT disabled. The existing "RiskEvals Select" and "RiskEvals Insert" RLS policies
--     already enforce merchant_id = auth_merchant_id() tenant isolation.
--   - This GRANT only allows PostgreSQL to reach RLS evaluation.

GRANT SELECT, INSERT ON public.risk_evaluations TO authenticated;
