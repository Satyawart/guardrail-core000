-- Phase 33 QA Fix: Grant missing INSERT privileges to authenticated role
-- The edge function inserts into 'intents' and 'risk_evaluations'.

GRANT SELECT, INSERT ON public.intents TO authenticated;
GRANT SELECT, INSERT ON public.risk_evaluations TO authenticated;
