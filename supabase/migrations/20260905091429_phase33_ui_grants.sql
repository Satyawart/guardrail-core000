-- Phase 33 QA Fix: Grant missing privileges to authenticated role
-- The UI needs to insert agents, authority, policies, and policy versions.

GRANT SELECT, INSERT, UPDATE ON public.agents TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.agent_authority TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.policies TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.policy_versions TO authenticated;
