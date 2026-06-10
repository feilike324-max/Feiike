# AI Commerce OS - 实体关系模型 (认知决策与自愈核心 ERD)

本文档描述 **Enterprise Brain（总后台大脑）** 核心 **Phase 199 至 Phase 202** 认知层、自适应策略层与自愈经验仓储实体之间的物理与逻辑连接拓扑。

```mermaid
erDiagram
    goal_orchestrators ||--o{ goal_execution_plans : "triggers_generation_of"
    goal_orchestrators ||--o{ goal_outcome_evaluations : "is_measured_by"
    goal_orchestrators ||--o{ strategy_plans : "is_addressed_by"
    
    goal_execution_plans ||--o{ goal_agent_assignments : "comprises"
    
    strategy_plans ||--o{ strategy_hypotheses : "formulates"
    strategy_plans ||--o{ strategy_results : "yields_results"
    strategy_plans ||--o{ strategy_performances : "tracks_longterm_stats"
    
    strategy_hypotheses ||--o{ strategy_experiments : "validated_by"
    
    goal_orchestrators {
        varchar id PK
        varchar tenant_id
        varchar store_id
        varchar name
        varchar target_metric
        numeric target_value
        numeric current_value
        varchar status
        timestamp deadline
    }

    goal_execution_plans {
        varchar id PK
        varchar orchestrator_id FK
        varchar name
        varchar status
        text estimated_impact
    }

    goal_agent_assignments {
        varchar id PK
        varchar plan_id FK
        varchar agent_id
        varchar role
        text assigned_task
        varchar status
        timestamp assigned_at
        timestamp completed_at
    }

    goal_outcome_evaluations {
        varchar id PK
        varchar orchestrator_id FK
        varchar evaluation_metric
        numeric expected_value
        numeric actual_value
        numeric variance_percent
        boolean success
    }

    strategy_plans {
        varchar id PK
        varchar tenant_id
        varchar goal_id FK
        varchar title
        text description
        int confidence_score
        varchar status
    }

    strategy_hypotheses {
        varchar id PK
        varchar strategy_id FK
        text statement
        int confidence_level
        varchar variable_tested
        varchar status
    }

    strategy_experiments {
        varchar id PK
        varchar hypothesis_id FK
        varchar experiment_name
        text control_group
        text test_group
        varchar_array metrics_to_track
        varchar status
    }
```

## 认知级联规则与闭环流控 (Cognitive Cascading Rules)
1. **战役强级联 (Campaign Cascading):**
   - 如果管理员强制清理终止某一核心经营目标 (`goal_orchestrators`)，其拆解派生出的中微观战役行动大纲 (`goal_execution_plans`) 以及多智能体任务指派书 (`goal_agent_assignments`) 将同步被 PostgreSQL **ON DELETE CASCADE** 精准清扫出列，保护运行空间原子性。
2. **策略软关联与保护 (Strategy Preservation):**
   - 当行动目标被结清或物理下架时，关联该目标的策略决策预案 (`strategy_plans`) 指向目标的外键会 **ON DELETE SET NULL** 软归还降级置空。
   - **理由**：经营目标可以是一次性的，但大脑研发的战略分析、博弈 A/B 对抗证据、降价对冲假设等对未来决策自愈极具常识沉淀性。我们必须让它脱离对单一战役存续的生理依赖，永久沉淀至 `outcome_memories` 与 `business_memories` 中作为终身资产复用调配！
