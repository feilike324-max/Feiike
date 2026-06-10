# AI Commerce OS - 数据字典 (认知决策与自愈核心表)

本文档对平台 **Enterprise Brain（总后台大脑）** 中的 **Phase 199 至 Phase 202** 认知层核心关系型数据库结构进行详细说明。这些表服务于自适应策略、多智能体任务分载、经验沉淀和结果回访学习等微内核脑机制。

---

## 1. 数据表：`goal_orchestrators` (Phase 199)
承载宏观高价值业务指标（如“法国销量提升 15%”），代替单纯的无脑触发自动化。

| 字段名称 (Column Name) | 数据类型 (Data Type) | 允许空值 (Nullable) | 描述 (Description) |
|---|---|---|---|
| `id` | `VARCHAR(50)` | 否 (NO) | 目标主键，前缀 `go_` |
| `tenant_id` | `VARCHAR(50)` | 否 (NO) | 多租户关联 ID |
| `store_id` | `VARCHAR(50)` | 否 (NO) | 归属店铺 ID |
| `name` | `VARCHAR(150)` | 否 (NO) | 行动目标意向（如“法国销量提升15%”） |
| `target_metric`| `VARCHAR(50)` | 否 (NO) | 监测宏观度量（如 `sales_volume`, `gmv`, `profit_margin`） |
| `target_value` | `NUMERIC(15,4)`| 否 (NO) | 行动追求的定量指标目标终值 |
| `current_value`| `NUMERIC(15,4)`| 否 (NO) | 当前已核算完毕的实际度量实数 |
| `status` | `VARCHAR(30)` | 否 (NO) | 目标运转状态 (`active`, `completed`, `failed`) |
| `created_at` | `TIMESTAMP` | 否 (NO) | 目标建立时间 |
| `deadline` | `TIMESTAMP` | 否 (NO) | 意向截止结算阀期 |

---

## 2. 数据表：`goal_execution_plans` (Phase 199)
大脑将宏观业务指标拆解为中微观战役行动纲领的容纳器。

| 字段名称 | 类型 | 允许空值 | 描述 |
|---|---|---|---|
| `id` | `VARCHAR(50)` | 否 | 行动方案主键，前缀 `gep_` |
| `orchestrator_id` | `VARCHAR(50)` | 否 | 级联外键关联 `goal_orchestrators(id)` |
| `name` | `VARCHAR(150)`| 否 | 战役方案标题（如“法国大衣爆增攻坚行动方案”） |
| `status` | `VARCHAR(30)` | 否 | 执行生命周期状态 (`draft`, `approved`, `executing`, `completed`) |
| `created_at` | `TIMESTAMP` | 否 | 创建方案核定时间 |
| `estimated_impact`| `TEXT` | 是 | 大脑推论模拟产生的估算商业收益汇报 |

---

## 3. 数据表：`goal_agent_assignments` (Phase 199)
将战役拆解为多智能体协同链条并指定专属 AI 人格挂载。

| 字段名称 | 类型 | 允许空值 | 描述 |
|---|---|---|---|
| `id` | `VARCHAR(50)` | 否 | 任务分载主键，前缀 `gaa_` |
| `plan_id` | `VARCHAR(50)` | 否 | 外键级联 `goal_execution_plans(id)` |
| `agent_id` | `VARCHAR(50)` | 否 | 承接智能体的注册实例 ID |
| `role` | `VARCHAR(50)` | 否 | 智能体职业定位（如 `InventoryAgent`, `PricingAgent`） |
| `assigned_task` | `TEXT` | 否 | 具体下达的任务行动要求 |
| `status` | `VARCHAR(30)` | 否 | 履约状态 (`assigned`, `running`, `completed`, `failed`) |
| `assigned_at` | `TIMESTAMP` | 否 | 任务分载下达精确时刻 |
| `completed_at` | `TIMESTAMP` | 是 | 任务向脑汇报闭环结算的时间戳 |

---

## 4. 数据表：`strategy_plans` (Phase 200)
脑内核在执行任一战役前，基于理智及博弈自适应推论出的策略预案。

| 字段名称 | 类型 | 允许空值 | 描述 |
|---|---|---|---|
| `id` | `VARCHAR(50)` | 否 | 策略模板主键，前缀 `sp_` |
| `tenant_id` | `VARCHAR(50)` | 否 | 隔离租户 ID |
| `goal_id` | `VARCHAR(50)` | 是 | 追溯关联的 `goal_orchestrators(id)`（软降级） |
| `title` | `VARCHAR(150)`| 否 | 战术预案名称 |
| `description` | `TEXT` | 是 | 预设战术与商业摩擦阻对冲的分析说明 |
| `confidence_score`|`INT` | 否 | 当前策略理智研判可信度配权重 (0-100) |
| `status` | `VARCHAR(30)` | 否 | 策略推行状态 (`draft`, `approved`, `executed`) |
| `created_at` | `TIMESTAMP` | 否 | 策略通过理智审计正式拟定并封存的时间 |

---

## 5. 数据表：`strategy_hypotheses` (Phase 200)
“科学经营”的本质是证伪。存储大脑为检验策略建立的可被推翻或证实的假设实体。

| 字段名称 | 类型 | 允许空值 | 描述 |
|---|---|---|---|
| `id` | `VARCHAR(50)` | 否 | 假设主键，前缀 `sh_` |
| `strategy_id` | `VARCHAR(50)` | 否 | 外键外挂关联 `strategy_plans(id)` |
| `statement` | `TEXT` | 否 | 严密逻辑假设内容（如 “如果降价则退货漏斗将被锁合”） |
| `confidence_level`|`INT` | 否 | 脑对此假设的安全可信额度测算 |
| `variable_tested` | `VARCHAR(150)`| 是 | 本次证伪测试的核心市场控制变量（如单价、配送免运门槛） |
| `status` | `VARCHAR(30)` | 否 | 证伪检验评级状态 (`untested`, `proven`, `disproven`) |

---

## 6. 数据表：`strategy_experiments` (Phase 200)
支持大盘 A/B 试验分配，以真实事务隔离（控制组与实验组）完成科学度量。

| 字段名称 | 类型 | 允许空值 | 描述 |
|---|---|---|---|
| `id` | `VARCHAR(50)` | 否 | 对照实验主键，前缀 `se_` |
| `hypothesis_id` | `VARCHAR(50)` | 否 | 外键关联 `strategy_hypotheses(id)` |
| `experiment_name` | `VARCHAR(150)`| 否 | 实验控制活动名称 |
| `control_group` | `TEXT` | 是 | 控制组默认运营策略描述 |
| `test_group` | `TEXT` | 是 | 实验组自愈干扰运营策略描述 |
| `metrics_to_track`| `VARCHAR[]` | 否 | 实验过程中严格记录的追踪度量数组 |
| `status` | `VARCHAR(30)` | 否 | 试验阶段 (`scheduled`, `running`, `completed`) |

---

## 7. 数据表：`outcome_memories` (Phase 201)
科学归因和认知的最底层，用于在完成战役后沉淀其战略成败以及修正权重。

| 字段名称 | 类型 | 允许空值 | 描述 |
|---|---|---|---|
| `id` | `VARCHAR(50)` | 否 | 成果记忆主键，前缀 `om_` |
| `tenant_id` | `VARCHAR(50)` | 否 | 租户 ID |
| `context` | `TEXT` | 否 | 发生这一经营成果的环境/市场/目标背景上下文 |
| `decision_taken` | `TEXT` | 否 | 当时所实行的最大权决策选择描述 |
| `outcome_rating` | `INT` | 否 | 该决定战术产生效果得分 (0-100) |
| `key_learnings` | `TEXT` | 否 | 经验反馈和自我对账分析得出的归因（用于对冲未来决策偏离） |

---

## 8. 数据表：`business_memories` (Phase 202)
脑内核的业务“厚度”和直觉。除单纯策略统计外，存储带有启发性的全局运营常识、供应链潜规则或突发状况经验备忘。

| 字段名称 | 类型 | 允许空值 | 描述 |
|---|---|---|---|
| `id` | `VARCHAR(50)` | 否 | 业务记忆主键，前缀 `bm_` |
| `tenant_id` | `VARCHAR(50)` | 否 | 租户环境划分 ID |
| `category` | `VARCHAR(50)` | 否 | 经验分类（如 `product_performance`, `logistics_friction`） |
| `experience_summary`| `TEXT` | 否 | 沉淀的富有智慧的启发式常识/商业逻辑规则总结文本 |
| `context_tags` | `VARCHAR[]` | 否 | 场景标签，支持智能体按照上下文索引匹配抓取 |
| `importance_score`| `INT` | 否 | 经验重要性评分 (1-10) |
| `retrieved_count` | `INT` | 否 | 历史决策过程中该高价值经验被调用索引的总次数计数器 |
