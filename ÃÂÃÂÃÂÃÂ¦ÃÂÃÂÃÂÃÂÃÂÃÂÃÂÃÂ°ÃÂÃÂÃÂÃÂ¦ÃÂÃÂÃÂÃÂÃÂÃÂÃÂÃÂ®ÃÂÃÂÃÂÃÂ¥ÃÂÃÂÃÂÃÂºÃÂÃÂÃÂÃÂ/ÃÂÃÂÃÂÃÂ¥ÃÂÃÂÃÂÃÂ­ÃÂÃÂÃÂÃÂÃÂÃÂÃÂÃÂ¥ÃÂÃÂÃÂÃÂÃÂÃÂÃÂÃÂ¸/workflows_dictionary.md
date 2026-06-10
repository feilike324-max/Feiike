# AI Commerce OS - 数据字典 (业务工作流引擎表)

本文档对平台 **Enterprise Brain（总后台大脑）** 中的 **Phase 195: Business Workflow Engine（业务工作流引擎）** 关系型数据库结构进行详细说明。

---

## 1. 数据表：`workflow_templates`
存储平台预设或管理员自定义的自适应工作流模板。

| 字段名称 (Column Name) | 数据类型 (Data Type) | 允许空值 (Nullable) | 描述 (Description) |
|---|---|---|---|
| `id` | `VARCHAR(50)` | 否 (NO) | 工作流模板主键，前缀为 `tmpl_` |
| `tenant_id` | `VARCHAR(50)` | 否 (NO) | 多租户关联 ID，绑定对应租户 |
| `name` | `VARCHAR(100)` | 否 (NO) | 工作流模板显示名称（例如 “自动安全库存补货工作流”） |
| `trigger_type` | `VARCHAR(50)` | 否 (NO) | 触发该流的事件类型 (`inventory_low`, `customer_churn`, `pricing_anomaly`) |
| `description` | `TEXT` | 是 (YES) | 工作流的具体功能与自治场景背景说明 |
| `is_active` | `BOOLEAN` | 否 (NO) | 该模板当前是否处于启用状态 |
| `created_at` | `TIMESTAMP` | 否 (NO) | 模板创建的时间戳 |

### 索引 (Indexes)
- `idx_workflow_templates_tenant` ON (`tenant_id`) - 支持多租户精细化安全隔离。

---

## 2. 数据表：`workflow_instances`
记录由底层商业事件触发并实际运行的工作流实例，承载高价值经营结果。

| 字段名称 (Column Name) | 数据类型 (Data Type) | 允许空值 (Nullable) | 描述 (Description) |
|---|---|---|---|
| `id` | `VARCHAR(50)` | 否 (NO) | 运行实例主键，前缀为 `inst_` |
| `tenant_id` | `VARCHAR(50)` | 否 (NO) | 租户安全隔离 ID |
| `template_id` | `VARCHAR(50)` | 否 (NO) | 引用的工作流模板外键关联 `workflow_templates(id)` |
| `name` | `VARCHAR(150)` | 否 (NO) | 该实例的具象化运行名称 |
| `status` | `VARCHAR(30)` | 否 (NO) | 实例的当前执行生命周期状态 (`running`, `completed`, `failed`, `suspended`) |
| `current_step_id` | `VARCHAR(50)` | 是 (YES) | 当前正在运行的主干步骤 ID |
| `trigger_reason` | `TEXT` | 是 (YES) | 启动该自治工作流的底座事件根因描述 |
| `created_at` | `TIMESTAMP` | 否 (NO) | 工作流实例化启动时间 |
| `completed_at` | `TIMESTAMP` | 是 (YES) | 工作流结束归档时间，若仍在运行中则为 NULL |

### 索引 (Indexes)
- `idx_workflow_id_tenant_status` ON (`tenant_id`, `status`) - 优化经营日志的高频状态聚合查询。

---

## 3. 数据表：`workflow_steps`
将工作流拆解为具体、由 Agent 串行或并行履约的标准步骤阶段。

| 字段名称 (Column Name) | 数据类型 (Data Type) | 允许空值 (Nullable) | 描述 (Description) |
|---|---|---|---|
| `id` | `VARCHAR(50)` | 否 (NO) | 步骤主键，前缀为 `step_` |
| `workflow_id` | `VARCHAR(50)` | 否 (NO) | 关联的工作流实例外键 `workflow_instances(id)` |
| `step_number` | `INT` | 否 (NO) | 当前步骤在整个流水线中的执行顺序序号（从 1 开始） |
| `name` | `VARCHAR(100)` | 否 (NO) | 本步骤的阶段动作显示名称 |
| `action_type` | `VARCHAR(50)` | 否 (NO) | 标准化动作类型（如 `inventory_check`, `purchase_plan`, `risk_review`, `execute`, `verify_results`, `price_simulate`, `revenue_forecast`） |
| `status` | `VARCHAR(30)` | 否 (NO) | 步骤执行状态 (`pending`, `running`, `completed`, `failed`) |
| `assigned_agent` | `VARCHAR(100)` | 是 (YES) | 承接此任务的智能体角色名（如 `InventoryAgent`, `FinanceAgent`） |
| `execution_response`| `TEXT` | 是 (YES) | 智能体在处理完本阶段后反馈的大脑可读式核心明细结论 |
| `started_at` | `TIMESTAMP` | 是 (YES) | 当前步骤启动时间 |
| `completed_at` | `TIMESTAMP` | 是 (YES) | 步骤结束归仓时间 |

### 索引 (Indexes)
- `idx_workflow_steps_wf` ON (`workflow_id`, `step_number`) - 顺畅提取有序执行脑神经元图纸。

---

## 4. 数据表：`workflow_execution_logs`
存储工作流执行深度审计线索，专供 Super Admin 后台进行安全、合规与宪章节制回放审计。

| 字段名称 (Column Name) | 数据类型 (Data Type) | 允许空值 (Nullable) | 描述 (Description) |
|---|---|---|---|
| `id` | `VARCHAR(50)` | 否 (NO) | 审计日志主键，前缀为 `log_` |
| `tenant_id` | `VARCHAR(50)` | 否 (NO) | 隔离租户 ID |
| `workflow_instance_id`| `VARCHAR(50)`| 是 (YES) | 关联的工作流运行实例主键 |
| `step_id` | `VARCHAR(50)` | 是 (YES) | 关联的具体步骤 ID，分析更精细颗粒度 |
| `log_level` | `VARCHAR(20)` | 否 (NO) | 日志审计评级 (`info`, `warning`, `error`, `governance_audit`) |
| `message` | `TEXT` | 否 (NO) | 审计、拦截、警告或流控执行的具体日志载荷文本 |
| `timestamp` | `TIMESTAMP` | 否 (NO) | 事件日志生成的精准原子钟时间 |

---

## 5. 数据表：`workflow_results`
沉淀已完成自治流的最终价值成果数据，包含 GMV 实际挽留额、风险损耗轧差以及关键指标质变。

| 字段名称 (Column Name) | 数据类型 (Data Type) | 允许空值 (Nullable) | 描述 (Description) |
|---|---|---|---|
| `id` | `VARCHAR(50)` | 否 (NO) | 经营结果记录主键，前缀为 `res_` |
| `tenant_id` | `VARCHAR(50)` | 否 (NO) | 租户 ID |
| `workflow_instance_id`| `VARCHAR(50)`| 否 (NO) | 唯一关联的工作流运行实例，承载最终审计结论 |
| `outcome` | `VARCHAR(20)` | 否 (NO) | 自治流结算状态评鉴 (`success`, `failure`) |
| `revenue_gained` | `DECIMAL(15,2)` | 否 (NO) | 大脑行动自愈后为店铺创造/挽回的实际 GMV 收入额度 |
| `cost_saved` | `DECIMAL(15,2)` | 否 (NO) | 通过智能降损、合规规避所拦截/拯救的供应链或折让成本 |
| `metrics_impact` | `TEXT` | 是 (YES) | 数据归因指标对冲评估归还结果（如“退货率压缩、供应率稳定维持”） |
| `verified_at` | `TIMESTAMP` | 否 (NO) | 对应数据资产划拨、审计确认的时间戳 |
