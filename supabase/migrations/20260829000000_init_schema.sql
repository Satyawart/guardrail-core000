-- GUARDRAIL CORE: Initial Database Schema
-- Migration 01: Core Architecture & Governance Foundation (Security Audited)

-- 1. ENUMS
CREATE TYPE transaction_status AS ENUM (
    'PROPOSED', 'EVALUATING', 'APPROVED', 'BLOCKED', 'PENDING_REVIEW',
    'REJECTED', 'EXECUTING', 'EXECUTED', 'FAILED', 'SETTLED', 'RECONCILED', 'CANCELLED'
);

CREATE TYPE guardrail_decision_result AS ENUM (
    'PERMIT', 'BLOCK', 'REVIEW'
);

CREATE TYPE risk_level AS ENUM (
    'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
);

CREATE TYPE policy_category AS ENUM (
    'MARGIN', 'SPEND', 'RISK', 'VELOCITY', 'DISCOUNT'
);

CREATE TYPE human_review_status AS ENUM (
    'PENDING', 'APPROVED', 'REJECTED'
);

-- 2. TABLES

-- Merchants (Organizations)
CREATE TABLE merchants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Users (Maps to auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY,
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE RESTRICT,
    role TEXT NOT NULL DEFAULT 'viewer',
    email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_users_merchant_id ON users(merchant_id);

-- AI Agents
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    risk_score NUMERIC(5,2) DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(id, merchant_id) -- for composite foreign keys
);
CREATE INDEX idx_agents_merchant_id ON agents(merchant_id);

-- Agent Authority (Boundary Limits)
CREATE TABLE agent_authority (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL,
    merchant_id UUID NOT NULL,
    spend_limit NUMERIC(15,4) NOT NULL CHECK (spend_limit >= 0),
    discount_max_percent NUMERIC(5,2) CHECK (discount_max_percent >= 0 AND discount_max_percent <= 100),
    refund_max NUMERIC(15,4) CHECK (refund_max >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    FOREIGN KEY (agent_id, merchant_id) REFERENCES agents(id, merchant_id) ON DELETE RESTRICT,
    UNIQUE(agent_id)
);
CREATE INDEX idx_agent_authority_merchant_id ON agent_authority(merchant_id);

-- Policies (Deterministic Rules)
CREATE TABLE policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    category policy_category NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(id, merchant_id) -- for composite FKs
);
CREATE INDEX idx_policies_merchant_id ON policies(merchant_id);

-- Policy Versions (Immutable snapshot)
CREATE TABLE policy_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID NOT NULL,
    merchant_id UUID NOT NULL,
    version_number INTEGER NOT NULL CHECK (version_number > 0),
    natural_language TEXT NOT NULL,
    code_snippet TEXT NOT NULL,
    configuration JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    FOREIGN KEY (policy_id, merchant_id) REFERENCES policies(id, merchant_id) ON DELETE RESTRICT,
    UNIQUE(policy_id, version_number)
);
CREATE INDEX idx_policy_versions_policy_id ON policy_versions(policy_id);
CREATE INDEX idx_policy_versions_merchant_id ON policy_versions(merchant_id);

-- Intents (Agent's proposed action)
CREATE TABLE intents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL,
    merchant_id UUID NOT NULL,
    description TEXT NOT NULL,
    structured_data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    FOREIGN KEY (agent_id, merchant_id) REFERENCES agents(id, merchant_id) ON DELETE RESTRICT,
    UNIQUE(id, merchant_id)
);
CREATE INDEX idx_intents_agent_id ON intents(agent_id);
CREATE INDEX idx_intents_merchant_id ON intents(merchant_id);

-- Transactions (Core execution unit)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    intent_id UUID,
    merchant_id UUID NOT NULL,
    agent_id UUID NOT NULL,
    amount NUMERIC(15,4) NOT NULL CHECK (amount >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    status transaction_status NOT NULL DEFAULT 'PROPOSED',
    idempotency_key TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE RESTRICT,
    FOREIGN KEY (agent_id, merchant_id) REFERENCES agents(id, merchant_id) ON DELETE RESTRICT,
    FOREIGN KEY (intent_id, merchant_id) REFERENCES intents(id, merchant_id) ON DELETE RESTRICT,
    UNIQUE(merchant_id, idempotency_key),
    UNIQUE(id, merchant_id) -- for composite FKs
);
CREATE INDEX idx_transactions_merchant_id ON transactions(merchant_id);
CREATE INDEX idx_transactions_agent_id ON transactions(agent_id);
CREATE INDEX idx_transactions_intent_id ON transactions(intent_id);

-- Policy Evaluations (Append-Only)
CREATE TABLE policy_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL,
    merchant_id UUID NOT NULL,
    policy_version_id UUID NOT NULL REFERENCES policy_versions(id) ON DELETE RESTRICT,
    result guardrail_decision_result NOT NULL,
    violation_details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    FOREIGN KEY (transaction_id, merchant_id) REFERENCES transactions(id, merchant_id) ON DELETE RESTRICT
);
CREATE INDEX idx_policy_evaluations_transaction_id ON policy_evaluations(transaction_id);
CREATE INDEX idx_policy_evaluations_merchant_id ON policy_evaluations(merchant_id);
CREATE INDEX idx_policy_evaluations_policy_version_id ON policy_evaluations(policy_version_id);

-- Risk Evaluations (Append-Only)
CREATE TABLE risk_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL,
    merchant_id UUID NOT NULL,
    risk_score NUMERIC(5,2) NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_level risk_level NOT NULL,
    indicators JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    FOREIGN KEY (transaction_id, merchant_id) REFERENCES transactions(id, merchant_id) ON DELETE RESTRICT,
    UNIQUE(transaction_id)
);
CREATE INDEX idx_risk_evaluations_merchant_id ON risk_evaluations(merchant_id);

-- Guardrail Decisions (Append-Only)
CREATE TABLE guardrail_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL,
    merchant_id UUID NOT NULL,
    decision guardrail_decision_result NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    FOREIGN KEY (transaction_id, merchant_id) REFERENCES transactions(id, merchant_id) ON DELETE RESTRICT,
    UNIQUE(transaction_id)
);
CREATE INDEX idx_guardrail_decisions_merchant_id ON guardrail_decisions(merchant_id);

-- Human Reviews (Mutable state for review queue)
CREATE TABLE human_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL,
    merchant_id UUID NOT NULL,
    reviewer_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    status human_review_status NOT NULL DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at TIMESTAMPTZ,
    FOREIGN KEY (transaction_id, merchant_id) REFERENCES transactions(id, merchant_id) ON DELETE RESTRICT
);
CREATE INDEX idx_human_reviews_transaction_id ON human_reviews(transaction_id);
CREATE INDEX idx_human_reviews_merchant_id ON human_reviews(merchant_id);
CREATE INDEX idx_human_reviews_reviewer_id ON human_reviews(reviewer_id);

-- Payment Attempts (Append-Only)
CREATE TABLE payment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL,
    merchant_id UUID NOT NULL,
    provider TEXT NOT NULL,
    provider_reference TEXT UNIQUE,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    FOREIGN KEY (transaction_id, merchant_id) REFERENCES transactions(id, merchant_id) ON DELETE RESTRICT
);
CREATE INDEX idx_payment_attempts_transaction_id ON payment_attempts(transaction_id);
CREATE INDEX idx_payment_attempts_merchant_id ON payment_attempts(merchant_id);

-- Settlements (Append-Only Verification)
CREATE TABLE settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL,
    merchant_id UUID NOT NULL,
    expected_amount NUMERIC(15,4) NOT NULL CHECK (expected_amount >= 0),
    actual_amount NUMERIC(15,4) CHECK (actual_amount >= 0),
    reconciliation_status TEXT NOT NULL,
    verified_at TIMESTAMPTZ,
    FOREIGN KEY (transaction_id, merchant_id) REFERENCES transactions(id, merchant_id) ON DELETE RESTRICT,
    UNIQUE(transaction_id)
);
CREATE INDEX idx_settlements_merchant_id ON settlements(merchant_id);

-- Audit Events (Immutable Ledger)
CREATE TABLE audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE RESTRICT,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    transaction_id UUID,
    event_type TEXT NOT NULL,
    actor_type TEXT NOT NULL,
    actor_id UUID,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    FOREIGN KEY (transaction_id, merchant_id) REFERENCES transactions(id, merchant_id) ON DELETE RESTRICT
);
CREATE INDEX idx_audit_events_merchant_id ON audit_events(merchant_id);
CREATE INDEX idx_audit_events_entity_id ON audit_events(entity_id);
CREATE INDEX idx_audit_events_transaction_id ON audit_events(transaction_id);

-- 3. TRIGGERS & FUNCTIONS

-- Automatically update `updated_at`
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_merchants_updated_at BEFORE UPDATE ON merchants FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_agents_updated_at BEFORE UPDATE ON agents FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_agent_authority_updated_at BEFORE UPDATE ON agent_authority FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_policies_updated_at BEFORE UPDATE ON policies FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Enforce Immutability on Append-Only tables
CREATE OR REPLACE FUNCTION prevent_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'This record is immutable and cannot be updated or deleted.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_policy_versions_mod BEFORE UPDATE OR DELETE ON policy_versions FOR EACH ROW EXECUTE FUNCTION prevent_modification();
CREATE TRIGGER prevent_policy_evals_mod BEFORE UPDATE OR DELETE ON policy_evaluations FOR EACH ROW EXECUTE FUNCTION prevent_modification();
CREATE TRIGGER prevent_risk_evals_mod BEFORE UPDATE OR DELETE ON risk_evaluations FOR EACH ROW EXECUTE FUNCTION prevent_modification();
CREATE TRIGGER prevent_guardrail_decisions_mod BEFORE UPDATE OR DELETE ON guardrail_decisions FOR EACH ROW EXECUTE FUNCTION prevent_modification();
CREATE TRIGGER prevent_settlements_mod BEFORE UPDATE OR DELETE ON settlements FOR EACH ROW EXECUTE FUNCTION prevent_modification();
CREATE TRIGGER prevent_audit_events_mod BEFORE UPDATE OR DELETE ON audit_events FOR EACH ROW EXECUTE FUNCTION prevent_modification();
-- Note: payment_attempts might need updates for status changes, so we only prevent DELETE for now.
CREATE TRIGGER prevent_payment_attempts_del BEFORE DELETE ON payment_attempts FOR EACH ROW EXECUTE FUNCTION prevent_modification();

-- 4. ROW LEVEL SECURITY (RLS) & ISOLATION

ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_authority ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardrail_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE human_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- Auth Resolver Function (Phase 3 Prep)
-- Once auth.users is mapped to our users table, this will dynamically return the correct merchant_id.
CREATE OR REPLACE FUNCTION auth_merchant_id() RETURNS UUID AS $$
  -- SELECT merchant_id FROM public.users WHERE id = auth.uid() LIMIT 1;
  SELECT null::uuid; -- Strict fallback locking down all row access until Phase 3 auth logic is finalized.
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '';

-- Merchant Tenancy RLS Policies (All child tables enforce merchant_id = auth_merchant_id())

-- MERCHANTS (Mutable)
CREATE POLICY "Merchants Select" ON merchants FOR SELECT USING (id = auth_merchant_id());
CREATE POLICY "Merchants Update" ON merchants FOR UPDATE USING (id = auth_merchant_id());

-- USERS (Mutable)
CREATE POLICY "Users Select" ON users FOR SELECT USING (merchant_id = auth_merchant_id());

-- AGENTS (Mutable)
CREATE POLICY "Agents Select" ON agents FOR SELECT USING (merchant_id = auth_merchant_id());
CREATE POLICY "Agents Insert" ON agents FOR INSERT WITH CHECK (merchant_id = auth_merchant_id());
CREATE POLICY "Agents Update" ON agents FOR UPDATE USING (merchant_id = auth_merchant_id());
CREATE POLICY "Agents Delete" ON agents FOR DELETE USING (merchant_id = auth_merchant_id());

-- AGENT_AUTHORITY (Mutable)
CREATE POLICY "AgentAuth Select" ON agent_authority FOR SELECT USING (merchant_id = auth_merchant_id());
CREATE POLICY "AgentAuth Insert" ON agent_authority FOR INSERT WITH CHECK (merchant_id = auth_merchant_id());
CREATE POLICY "AgentAuth Update" ON agent_authority FOR UPDATE USING (merchant_id = auth_merchant_id());
-- Prevent DELETE on Authority limits; history is captured via audit log but record persists
CREATE POLICY "AgentAuth Delete" ON agent_authority FOR DELETE USING (false);

-- POLICIES (Mutable)
CREATE POLICY "Policies Select" ON policies FOR SELECT USING (merchant_id = auth_merchant_id());
CREATE POLICY "Policies Insert" ON policies FOR INSERT WITH CHECK (merchant_id = auth_merchant_id());
CREATE POLICY "Policies Update" ON policies FOR UPDATE USING (merchant_id = auth_merchant_id());
-- Deletion disabled to preserve historical integrity, recommend soft-delete via status instead
CREATE POLICY "Policies Delete" ON policies FOR DELETE USING (false);

-- POLICY VERSIONS (Immutable)
CREATE POLICY "PolicyVersion Select" ON policy_versions FOR SELECT USING (merchant_id = auth_merchant_id());
CREATE POLICY "PolicyVersion Insert" ON policy_versions FOR INSERT WITH CHECK (merchant_id = auth_merchant_id());

-- INTENTS (Immutable/Append-Only)
CREATE POLICY "Intents Select" ON intents FOR SELECT USING (merchant_id = auth_merchant_id());
CREATE POLICY "Intents Insert" ON intents FOR INSERT WITH CHECK (merchant_id = auth_merchant_id());

-- TRANSACTIONS (Mutable Lifecycle)
CREATE POLICY "Transactions Select" ON transactions FOR SELECT USING (merchant_id = auth_merchant_id());
CREATE POLICY "Transactions Insert" ON transactions FOR INSERT WITH CHECK (merchant_id = auth_merchant_id());
CREATE POLICY "Transactions Update" ON transactions FOR UPDATE USING (merchant_id = auth_merchant_id());
CREATE POLICY "Transactions Delete" ON transactions FOR DELETE USING (false); -- Never delete transactions

-- POLICY EVALUATIONS (Immutable)
CREATE POLICY "PolicyEvals Select" ON policy_evaluations FOR SELECT USING (merchant_id = auth_merchant_id());
CREATE POLICY "PolicyEvals Insert" ON policy_evaluations FOR INSERT WITH CHECK (merchant_id = auth_merchant_id());

-- RISK EVALUATIONS (Immutable)
CREATE POLICY "RiskEvals Select" ON risk_evaluations FOR SELECT USING (merchant_id = auth_merchant_id());
CREATE POLICY "RiskEvals Insert" ON risk_evaluations FOR INSERT WITH CHECK (merchant_id = auth_merchant_id());

-- GUARDRAIL DECISIONS (Immutable)
CREATE POLICY "Decisions Select" ON guardrail_decisions FOR SELECT USING (merchant_id = auth_merchant_id());
CREATE POLICY "Decisions Insert" ON guardrail_decisions FOR INSERT WITH CHECK (merchant_id = auth_merchant_id());

-- HUMAN REVIEWS (Mutable)
CREATE POLICY "Reviews Select" ON human_reviews FOR SELECT USING (merchant_id = auth_merchant_id());
CREATE POLICY "Reviews Insert" ON human_reviews FOR INSERT WITH CHECK (merchant_id = auth_merchant_id());
CREATE POLICY "Reviews Update" ON human_reviews FOR UPDATE USING (merchant_id = auth_merchant_id());

-- PAYMENT ATTEMPTS (Append-Only, Status Mutable)
CREATE POLICY "Payments Select" ON payment_attempts FOR SELECT USING (merchant_id = auth_merchant_id());
CREATE POLICY "Payments Insert" ON payment_attempts FOR INSERT WITH CHECK (merchant_id = auth_merchant_id());
CREATE POLICY "Payments Update" ON payment_attempts FOR UPDATE USING (merchant_id = auth_merchant_id());

-- SETTLEMENTS (Immutable)
CREATE POLICY "Settlements Select" ON settlements FOR SELECT USING (merchant_id = auth_merchant_id());
CREATE POLICY "Settlements Insert" ON settlements FOR INSERT WITH CHECK (merchant_id = auth_merchant_id());

-- AUDIT EVENTS (Immutable)
CREATE POLICY "Audit Select" ON audit_events FOR SELECT USING (merchant_id = auth_merchant_id());
CREATE POLICY "Audit Insert" ON audit_events FOR INSERT WITH CHECK (merchant_id = auth_merchant_id());
