-- AI Commerce OS - Goals, Strategies and Outcome Cognition Seeds (Architecture Lock v1.0)
-- Target: tenant_global_moda / store_paris_moda
-- Covers Phase 199, 200, 201, 202 preseed values

-- 1. Goal Orchestrators (Phase 199)
INSERT INTO goal_orchestrators (id, tenant_id, store_id, name, target_metric, target_value, current_value, status, created_at, deadline)
VALUES (
    'go_france_15', 
    'tenant_global_moda', 
    'store_paris_moda', 
    '法国销量提高15%', 
    'sales_volume', 
    115.0000, 
    100.0000, 
    'active', 
    NOW() - INTERVAL '24 hours', 
    NOW() + INTERVAL '10 days'
)
ON CONFLICT (id) DO NOTHING;

-- 2. Goal Execution Plans (Phase 199)
INSERT INTO goal_execution_plans (id, orchestrator_id, name, status, created_at, estimated_impact)
VALUES (
    'gep_france_15', 
    'go_france_15', 
    '战役行动纲领：法国销量提高15% 深度执行方案', 
    'executing', 
    NOW() - INTERVAL '24 hours', 
    '预计提升目标达成度, 增加销售毛利 +15%'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Goal Agent Assignments (Phase 199)
INSERT INTO goal_agent_assignments (id, plan_id, agent_id, role, assigned_task, status, assigned_at, completed_at)
VALUES 
('gaa_inv_01', 'gep_france_15', 'agt_inv', 'InventoryAgent', '审查法国本地及海外大仓最热销大衣安全配比，生成 50 Units 补足计划', 'running', NOW() - INTERVAL '24 hours', NULL),
('gaa_sales_01', 'gep_france_15', 'agt_sales', 'PricingAgent', '分析 Camel Trench Coat (APP-TRNCH-02) 降价弹性自售价 $159 至 $144.50，同步修正在线交易价格', 'running', NOW() - INTERVAL '24 hours', NULL)
ON CONFLICT (id) DO NOTHING;

-- 4. Strategy Plans (Phase 200)
INSERT INTO strategy_plans (id, tenant_id, goal_id, title, description, confidence_score, status, created_at)
VALUES (
    'sp_france_15', 
    'tenant_global_moda', 
    'go_france_15', 
    '利用季节交错大衣畅销品改价及库存对冲战役', 
    '针对法国销量提高15%目标，通过弹性重组零售单价至 $144.50 对冲尺码摩擦，并同步补充 50 套在途备货，以迅速激活购买势头。', 
    90, 
    'executed', 
    NOW() - INTERVAL '24 hours'
)
ON CONFLICT (id) DO NOTHING;

-- 5. Strategy Hypotheses (Phase 200)
INSERT INTO strategy_hypotheses (id, strategy_id, statement, confidence_level, variable_tested, status, created_at)
VALUES (
    'sh_france_15', 
    'sp_france_15', 
    '如果我们将经典大衣单价由 $159 校准至 $144.50 保持低毛利，销量将在14天内激增 +25%，对冲尺码劣势。', 
    90, 
    'Classic Tallored Trench Coat Retail Unit Price', 
    'proven', 
    NOW() - INTERVAL '24 hours'
)
ON CONFLICT (id) DO NOTHING;

-- 6. Strategy Experiments (Phase 200)
INSERT INTO strategy_experiments (id, hypothesis_id, experiment_name, control_group, test_group, metrics_to_track, status, started_at, ended_at)
VALUES (
    'se_france_15', 
    'sh_france_15', 
    '利用季节交错大衣畅销品改价及库存对冲战役 对账对照实验', 
    '默认标准高昂单价/无主动定向 EDM 投放组', 
    '折扣 $144.50 辅以尺码预警/特定专属 Diamond 触达组', 
    '{"sales_volume", "conversion_rate", "refund_rate"}'::VARCHAR(50)[], 
    'completed', 
    NOW() - INTERVAL '24 hours', 
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 7. Strategy Results (Phase 200)
INSERT INTO strategy_results (id, strategy_id, outcome_summary, revenue_impact, margin_impact, conclusions, created_at)
VALUES (
    'sr_france_15', 
    'sp_france_15', 
    '战役成果审计：计划执行达到预期目标。实获营业周转增收 $11000，阻断货架损失 $450。', 
    11000.00, 
    450.00, 
    '本次补给定价战役在对账决策层面完备，完美验证了降价对冲机制与补货在途锁合的认知优势。', 
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 8. Outcome Memories (Phase 201)
INSERT INTO outcome_memories (id, tenant_id, context, decision_taken, outcome_rating, key_learnings, created_at)
VALUES (
    'om_france_15', 
    'tenant_global_moda', 
    '目标战术实施背景: 法国销量提高15%. 追踪度量: sales_volume', 
    '利用季节交错大衣畅销品改价及库存对冲战役', 
    95, 
    '对账学习引擎：大衣在温差波动交界期拥有极强的改价购买力优势，其折价单价 $144.50 与 100% 在途补充大货组合，被证实是拉动营收的最高效率战术，下期权重建议增强 +12%。', 
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 9. Decision Outcomes (Phase 201)
INSERT INTO decision_outcomes (id, decision_id, decision_type, expected_metrics, actual_metrics, deviation_analysis, logged_at)
VALUES (
    'do_france_15', 
    'sp_france_15', 
    'strategic_campaign', 
    '期望目标状态达至 115', 
    '最终对账达成状态达至 115', 
    '对账相符。无负面偏离，偏差率为 0%。决策可靠性提升。', 
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 10. Strategy Performances (Phase 201)
INSERT INTO strategy_performances (id, strategy_template_id, success_count, failure_count, avg_revenue_impact, reliability_score, last_optimized_at)
VALUES (
    'sp_perf_france_15', 
    'sp_france_15', 
    1, 
    0, 
    11000.00, 
    93, 
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 11. Business Memories (Phase 202)
INSERT INTO business_memories (id, tenant_id, category, experience_summary, context_tags, importance_score, retrieved_count, last_accessed_at, created_at)
VALUES (
    'bm_france_15', 
    'tenant_global_moda', 
    'product_performance', 
    '历史经验表明：欧洲区冬春时装交替期，大衣退换货率普遍偏大 (约 24%)。盲目堆砌展示并不能降低由于尺码对折造成的货损，必须改价与页面文字提示双翼合龙执行。', 
    '{"clothing", "france", "returns", "trench-coat"}'::VARCHAR(50)[], 
    9, 
    1, 
    NOW(), 
    NOW()
)
ON CONFLICT (id) DO NOTHING;
