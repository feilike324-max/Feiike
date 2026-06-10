-- AI Commerce OS - Goals, Strategies and Outcome Cognition Database Schema (Architecture Lock v1.0)
-- Target Platform: PostgreSQL (SaaS-Ready, Europe-First)
-- Covers Phase 199 (Goal Orchestrator), Phase 200 (Strategy Planner), Phase 201 (Outcome Learning), and Phase 202 (Business Memory)

-- 1. Goal Orchestration Tables (Phase 199)
CREATE TABLE IF NOT EXISTS goal_orchestrators (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    store_id VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    target_metric VARCHAR(50) NOT NULL, -- sales_volume, gmv, profit_margin, etc.
    target_value NUMERIC(15, 4) NOT NULL,
    current_value NUMERIC(15, 4) DEFAULT 0.0000 NOT NULL,
    status VARCHAR(30) DEFAULT 'active' NOT NULL, -- active, completed, failed, suspended
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS goal_execution_plans (
    id VARCHAR(50) PRIMARY KEY,
    orchestrator_id VARCHAR(50) NOT NULL REFERENCES goal_orchestrators(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    status VARCHAR(30) DEFAULT 'draft' NOT NULL, -- draft, approved, executing, completed, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    estimated_impact TEXT
);

CREATE TABLE IF NOT EXISTS goal_agent_assignments (
    id VARCHAR(50) PRIMARY KEY,
    plan_id VARCHAR(50) NOT NULL REFERENCES goal_execution_plans(id) ON DELETE CASCADE,
    agent_id VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL, -- InventoryAgent, PricingAgent, CustomerAgent, etc.
    assigned_task TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'assigned' NOT NULL, -- assigned, running, completed, failed
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS goal_outcome_evaluations (
    id VARCHAR(50) PRIMARY KEY,
    orchestrator_id VARCHAR(50) NOT NULL REFERENCES goal_orchestrators(id) ON DELETE CASCADE,
    evaluation_metric VARCHAR(50) NOT NULL,
    expected_value NUMERIC(15, 4) NOT NULL,
    actual_value NUMERIC(15, 4) NOT NULL,
    variance_percent NUMERIC(8, 4) NOT NULL, -- positive is overachievement, negative is underachievement
    success BOOLEAN NOT NULL,
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Strategy Planning Tables (Phase 200)
CREATE TABLE IF NOT EXISTS strategy_plans (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    goal_id VARCHAR(50) REFERENCES goal_orchestrators(id) ON DELETE SET NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    confidence_score INT DEFAULT 50 NOT NULL, -- 0-100 reliability estimate
    status VARCHAR(30) DEFAULT 'draft' NOT NULL, -- draft, approved, executed, archived
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS strategy_hypotheses (
    id VARCHAR(50) PRIMARY KEY,
    strategy_id VARCHAR(50) NOT NULL REFERENCES strategy_plans(id) ON DELETE CASCADE,
    statement TEXT NOT NULL,
    confidence_level INT DEFAULT 50 NOT NULL,
    variable_tested VARCHAR(150),
    status VARCHAR(30) DEFAULT 'untested' NOT NULL, -- untested, proven, disproven
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS strategy_experiments (
    id VARCHAR(50) PRIMARY KEY,
    hypothesis_id VARCHAR(50) NOT NULL REFERENCES strategy_hypotheses(id) ON DELETE CASCADE,
    experiment_name VARCHAR(150) NOT NULL,
    control_group TEXT,
    test_group TEXT,
    metrics_to_track VARCHAR(50)[] NOT NULL,
    status VARCHAR(30) DEFAULT 'scheduled' NOT NULL, -- scheduled, running, completed
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS strategy_results (
    id VARCHAR(50) PRIMARY KEY,
    strategy_id VARCHAR(50) NOT NULL REFERENCES strategy_plans(id) ON DELETE CASCADE,
    outcome_summary TEXT NOT NULL,
    revenue_impact NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
    margin_impact NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
    conclusions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. Outcome Learning Tables (Phase 201)
CREATE TABLE IF NOT EXISTS outcome_memories (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    context TEXT NOT NULL,
    decision_taken TEXT NOT NULL,
    outcome_rating INT NOT NULL, -- score or rating out of 100
    key_learnings TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS decision_outcomes (
    id VARCHAR(50) PRIMARY KEY,
    decision_id VARCHAR(50) NOT NULL, -- references strategy_plans or other decisions
    decision_type VARCHAR(50) NOT NULL, -- strategic_campaign, replenishment, etc.
    expected_metrics TEXT NOT NULL,
    actual_metrics TEXT NOT NULL,
    deviation_analysis TEXT,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS strategy_performances (
    id VARCHAR(50) PRIMARY KEY,
    strategy_template_id VARCHAR(50) NOT NULL REFERENCES strategy_plans(id) ON DELETE CASCADE,
    success_count INT DEFAULT 0 NOT NULL,
    failure_count INT DEFAULT 0 NOT NULL,
    avg_revenue_impact NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
    reliability_score INT DEFAULT 50 NOT NULL, -- calculated weight based on success/failure
    last_optimized_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS execution_feedbacks (
    id VARCHAR(50) PRIMARY KEY,
    instance_id VARCHAR(50) NOT NULL, -- references workflow instance or goal orchestrator
    feedback_loop VARCHAR(30) DEFAULT 'workflow' NOT NULL, -- workflow, goal
    agent_sender_id VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    issue_detected BOOLEAN DEFAULT FALSE NOT NULL,
    adjustment_suggested TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. Experiential Business Memory Tables (Phase 202)
CREATE TABLE IF NOT EXISTS business_memories (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL, -- product_performance, marketing_efficiency, logistics_friction, etc.
    experience_summary TEXT NOT NULL,
    context_tags VARCHAR(50)[] DEFAULT '{}'::VARCHAR(50)[] NOT NULL,
    importance_score INT DEFAULT 5 NOT NULL, -- 1-10 priority rating
    retrieved_count INT DEFAULT 0 NOT NULL,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
