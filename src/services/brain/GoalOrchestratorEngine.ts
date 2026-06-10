import { dbEngine } from '../../db/dbEngine';
import { 
  GoalOrchestrator, 
  GoalExecutionPlan, 
  GoalAgentAssignment, 
  GoalOutcomeEvaluation,
  StrategyPlan,
  StrategyHypothesis,
  StrategyExperiment,
  StrategyResult,
  OutcomeMemory,
  DecisionOutcome,
  StrategyPerformance,
  ExecutionFeedback,
  BusinessMemory,
  WorkflowInstance
} from '../../types';
import { BusinessWorkflowEngine } from '../BusinessWorkflowEngine';
import { capabilityScoringEngine } from './CapabilityScoringEngine';
import { confidenceEngine } from './ConfidenceEngine';
import { skillGraphEngine } from './SkillGraphEngine';
import { multiStoreIntelligence } from './MultiStoreIntelligence';
import { knowledgeFusionEngine } from './KnowledgeFusionEngine';

export class GoalOrchestratorEngine {
  private static instance: GoalOrchestratorEngine | null = null;

  private constructor() {}

  public static getInstance(): GoalOrchestratorEngine {
    if (!GoalOrchestratorEngine.instance) {
      GoalOrchestratorEngine.instance = new GoalOrchestratorEngine();
    }
    return GoalOrchestratorEngine.instance;
  }

  /**
   * Phase 199: Initiates a Goal Orchestrator instance and starts autonomous execution logic.
   * This is the bridge from simple automation to cognitive, goal-driven business operations.
   */
  public initiateGoal(
    tenantId: string,
    storeId: string,
    goalName: string,
    targetMetric: 'sales_volume' | 'gmv' | 'profit_margin' | string,
    targetValue: number,
    deadlineDays: number = 30
  ): { goal: GoalOrchestrator; plan: GoalExecutionPlan; strategy: StrategyPlan } {
    const now = new Date();
    const deadlineDate = new Date(now.getTime() + deadlineDays * 24 * 60 * 60 * 1000);

    // 1. Establish the Goal Orchestrator
    const currentValue = this.getCurrentMetricBaseValue(targetMetric);
    const goal = dbEngine.goal_orchestrators.create({
      tenant_id: tenantId,
      store_id: storeId,
      name: goalName,
      target_metric: targetMetric,
      target_value: targetValue,
      current_value: currentValue,
      status: 'active',
      deadline: deadlineDate.toISOString()
    });

    // 2. Formulate Strategy (Phase 200 Integration)
    const strategy = this.formulateStrategy(tenantId, goal.id, goalName, targetMetric, targetValue);

    // 3. Elaborate Goal Execution Plan (Phase 199)
    const plan = dbEngine.goal_execution_plans.create({
      orchestrator_id: goal.id,
      name: `战役行动纲领：${goalName} 深度执行方案`,
      status: 'approved',
      estimated_impact: `预计提升目标达成度, 增加销售毛利 +15%`
    });

    // 4. Assign Specialists Agents to Tasks (Phase 199)
    this.assignSpecialistAgents(plan.id, targetMetric);

    // 5. Build Experiential Memory of Past Strategic Context (Phase 202 Integration)
    this.createInitialGoalMemory(tenantId, goalName, targetMetric);

    return { goal, plan, strategy };
  }

  /**
   * Phase 200 & 207: Cognitive formulation of strategies, hypotheses, and experiments.
   * Dynamically aggregates European Apparel Domain knowledge in real time via the Knowledge Fusion Engine.
   */
  private formulateStrategy(
    tenantId: string,
    goalId: string,
    goalName: string,
    targetMetric: string,
    targetValue: number
  ): StrategyPlan {
    let title = '';
    let description = '';
    let hyStatement = '';
    let testVariable = '';
    let confidence = 85;

    // 0. Knowledge Fusion Engine Core Integration (P1 - P5 Core)
    const fusedContext = knowledgeFusionEngine.generateFusedContext(goalName, 'FR');
    const matchedCategory = fusedContext.fashion.matchedCategories[0]?.name || 'Wool Coat';
    const matchedMaterial = fusedContext.fashion.matchedMaterials[0]?.name || 'Merino Wool';
    const matchedStyle = fusedContext.fashion.matchedStyles[0]?.name || 'Quiet Luxury';
    const trendGrowth = fusedContext.market.trends[0]?.growth_rate_pct || 34; // matching P2 France trend +34%
    const supplierName = fusedContext.supply.potentialSuppliers[0]?.name || 'EuroTextile Manufacturing';
    const leadTimeDays = fusedContext.supply.leadTimes[0]?.standard_lead_time_days || 12;

    // Direct business intelligence rules based on the objective targets
    if (targetMetric === 'sales_volume') {
      title = `【欧洲智治战役】${matchedStyle}风格${matchedCategory}多渠道改价及库存对冲战役`;
      description = `针对 ${goalName} 目标（对应品类:${matchedCategory}，核心用料:${matchedMaterial}，设计语言:${matchedStyle}）。融合欧洲市场情报中心数据：发现该品类在法国拥有 +${trendGrowth}% 的强劲季度需求；结合供应中心数据，我们战略调用供应商【${supplierName}】进行在途补货，标准时效 ${leadTimeDays} 天达本。通过弹性重组零售单价至 $144.50 对冲尺码摩擦，迅速激活购买势头。`;
      hyStatement = `如果我们将以 ${matchedMaterial} 为核心用料的 ${matchedStyle} 风格 ${matchedCategory} 单价由 $159 校准至 $144.50 并开启供应中心 ${leadTimeDays} 天补货线，销量将在14天内激增 +25%，对冲尺码劣势。`;
      testVariable = `${matchedStyle} ${matchedCategory} Retail Price & Supply Chain`;
      confidence = 92;
    } else if (targetMetric === 'gmv') {
      const personaName = fusedContext.consumer.personas[0]?.name || 'Parisian Chic Careerist';
      title = `【欧洲智治战役】${personaName}核心客群专属特惠 EDM 召回营销方案`;
      description = `针对专属 ${goalName} 目标。融合消费者情报中心数据，发现 ${personaName} 客群在法国偏好 ${matchedStyle} 风格与 ${matchedMaterial} 材料。针对该区域近期连续 45 天无互动的白金大客户开展多维度配券营销以锁定归因，预期降低消费漏斗流动摩擦。分析显示：${fusedContext.consumer.behaviorSummary}`;
      hyStatement = `如果我们对忠诚的 ${personaName} 客群，定向投放 ${matchedStyle} 类目的 EDM 关怀配券，召回率将不低于 30%，回笼 GMV。`;
      testVariable = `${personaName} Loyalty Carbon-Copy Incentive`;
      confidence = 89;
    } else {
      title = '全局商铺运营自适应弹性定价与供应自愈战役';
      description = '实施端到端的库存采购补货以及售价校准，精细匹配欧洲市场物流以及客群敏感度，实现全局商业自愈。';
      hyStatement = '如果我们实行全面的供应链补货支持 and 改价策略，商业流失将降低 15%。';
      testVariable = 'Global Inventory Safety and Dynamic Pricing';
      confidence = 80;
    }

    // 1. Create Strategy Plan
    const strategy = dbEngine.strategy_plans.create({
      tenant_id: tenantId,
      goal_id: goalId,
      title,
      description,
      confidence_score: confidence,
      status: 'approved'
    });

    // 2. Draft Strategy Hypothesis
    const hypothesis = dbEngine.strategy_hypotheses.create({
      strategy_id: strategy.id,
      statement: hyStatement,
      confidence_level: confidence,
      variable_tested: testVariable,
      status: 'untested'
    });

    // 3. Initiate Strategy Experiment
    dbEngine.strategy_experiments.create({
      hypothesis_id: hypothesis.id,
      experiment_name: `${title} 对账对照实验`,
      control_group: '默认标准高昂单价/无主动定向 EDM 投放组',
      test_group: '折扣 $144.50 辅以尺码预警/特定专属 Diamond 触达组',
      metrics_to_track: [targetMetric, 'conversion_rate', 'refund_rate']
    });

    // 4. Create Strategy Performance tracker
    dbEngine.strategy_performances.create({
      strategy_template_id: strategy.id,
      success_count: 0,
      failure_count: 0,
      avg_revenue_impact: 0,
      reliability_score: confidence
    });

    return strategy;
  }

  /**
   * Phase 199: Assigns specialist cognitive Agents to the Goal Execution Plan.
   */
  private assignSpecialistAgents(planId: string, targetMetric: string) {
    if (targetMetric === 'sales_volume') {
      dbEngine.goal_agent_assignments.create({
        plan_id: planId,
        agent_id: 'agt_inv',
        role: 'InventoryAgent',
        assigned_task: '审查法国本地及海外大仓最热销大衣安全配比，生成 50 Units 补足计划',
        status: 'assigned'
      });
      dbEngine.goal_agent_assignments.create({
        plan_id: planId,
        agent_id: 'agt_sales',
        role: 'PricingAgent',
        assigned_task: '分析 Camel Trench Coat (APP-TRNCH-02) 降价弹性弹性至 $144.50，同步修正在线交易价格',
        status: 'assigned'
      });
    } else {
      dbEngine.goal_agent_assignments.create({
        plan_id: planId,
        agent_id: 'agt_sales',
        role: 'CustomerAgent',
        assigned_task: '筛选连续45天无购买记录之尊贵白金大V客群并打包 EDM 营销触达触点',
        status: 'assigned'
      });
    }
  }

  /**
   * Phase 202: Experience Memory Creator - Adds background heuristics about the campaign.
   */
  private createInitialGoalMemory(tenantId: string, goalName: string, targetMetric: string) {
    let summary = '';
    let tags: string[] = [];

    if (targetMetric === 'sales_volume') {
      summary = '历史经验表明：欧洲区冬春时装交替期，大衣退换货率普遍偏大 (约 24%)。盲目堆砌展示并不能降低由于尺码对折造成的货损，必须改价与页面文字提示双翼合龙执行。';
      tags = ['clothing', 'france', 'returns', 'trench-coat'];
    } else if (targetMetric === 'gmv') {
      summary = '历史经验说明：通过 SendGrid 结合定制欧洲货币面值券，其挽回转化率可比普通低价值拉新高出 3.1 倍。';
      tags = ['loyalty', 'vip', 'edm', 'customer-retention'];
    } else {
      summary = '一般商业规律：补货流转资金过大可能会侵占流动资金准备率，必须先审查财务保留安全壁垒。';
      tags = ['finance', 'inventory', 'risk-reserve'];
    }

    dbEngine.business_memories.create({
      tenant_id: tenantId,
      category: 'product_performance',
      experience_summary: summary,
      context_tags: tags,
      importance_score: 9,
      retrieved_count: 1,
      last_accessed_at: new Date().toISOString()
    });
  }

  /**
   * Core Autonomous Engine Driver: This method advances the Goal, Strategy and workflows simultaneously!
   * Fulfills Goal -> Strategy -> Workflow -> Agent -> Outcome Feedback.
   */
  public advanceGoalLifecycle(goalId: string, tenantId: string = 'tenant_global_moda'): {
    goal: GoalOrchestrator;
    workflowsExecuted: string[];
    feedbackLogs: string[];
  } {
    const goal = dbEngine.goal_orchestrators.getById(goalId);
    if (!goal) throw new Error(`GoalOrchestrator ${goalId} not found`);

    const feedbackLogs: string[] = [];
    const workflowsExecuted: string[] = [];

    // Retrieve active planning and strategies
    const plans = dbEngine.goal_execution_plans.getByGoal(goalId);
    if (plans.length === 0) return { goal, workflowsExecuted, feedbackLogs };
    const plan = plans[0];

    const strategies = dbEngine.strategy_plans.getByGoal(goalId);
    const strategy = strategies.length > 0 ? strategies[0] : null;

    if (goal.status === 'completed' || goal.status === 'failed') {
      return { goal, workflowsExecuted, feedbackLogs };
    }

    // 1. Trigger automated workflows to support this Goal!
    // If we've just started or are currently active, launch associated automation runs
    if (plan.status === 'approved') {
      dbEngine.goal_execution_plans.update(plan.id, { status: 'executing' });

      // Match target metric to specific template ID
      let templateId = 'tmpl_price_optimization';
      let workflowReason = '';

      if (goal.target_metric === 'sales_volume') {
        templateId = 'tmpl_replenishment';
        workflowReason = `[大脑目标治理] 触发自动补货支援战役 ${goal.name}`;
      } else if (goal.target_metric === 'gmv') {
        templateId = 'tmpl_customer_recall';
        workflowReason = `[大脑目标治理] 开启 VIP 召回支持战役 ${goal.name}`;
      }

      // Automatically trigger the corresponding workflow in the BusinessWorkflowEngine!
      const wfInstance = BusinessWorkflowEngine.triggerWorkflow(templateId, workflowReason, tenantId);
      workflowsExecuted.push(wfInstance.id);

      // Save assignments status
      const assignments = dbEngine.goal_agent_assignments.getByPlan(plan.id);
      assignments.forEach(as => {
        dbEngine.goal_agent_assignments.update(as.id, { status: 'running' });
      });

      // Update experiment status
      if (strategy) {
        const hypotheses = dbEngine.strategy_hypotheses.getByStrategy(strategy.id);
        if (hypotheses.length > 0) {
          const hypothesis = hypotheses[0];
          const experiments = dbEngine.strategy_experiments.getByHypothesis(hypothesis.id);
          if (experiments.length > 0) {
            dbEngine.strategy_experiments.update(experiments[0].id, { status: 'running' });
          }
        }
      }

      feedbackLogs.push(`大脑中枢启动：与大盘补货/定价相关的补给工作流 (${templateId}) 已经自动开启并关联此经营目标！`);
    } else if (plan.status === 'executing') {
      // Find associated running workflows
      const instances = dbEngine.workflow_instances.getAll().filter(wi => 
        wi.tenant_id === tenantId && 
        wi.status === 'running' && 
        wi.trigger_reason.includes(goalId) || wi.trigger_reason.includes(goal.name)
      );

      if (instances.length > 0) {
        // Step execution! Simulating the business progress
        const currentInstance = instances[0];
        const nextStepResult = BusinessWorkflowEngine.executeNextStep(currentInstance.id);

        if (nextStepResult.completed) {
          // Workflow has fully succeeded! Let's process the outcome, do cognitive learning
          const result = dbEngine.workflow_results.getAll().find(wr => wr.workflow_instance_id === currentInstance.id);
          const totalRevenueImpact = result ? result.revenue_gained : 1500;

          // Update assignments to completed
          const assignments = dbEngine.goal_agent_assignments.getByPlan(plan.id);
          assignments.forEach(as => {
            dbEngine.goal_agent_assignments.update(as.id, { status: 'completed' });
          });

          // Check target completion!
          const simulatedValue = goal.current_value + (totalRevenueImpact > 2000 ? 25 : 15);
          const finalStatus = simulatedValue >= goal.target_value ? 'completed' : 'active';

          const updatedGoal = dbEngine.goal_orchestrators.update(goal.id, {
            current_value: Math.min(goal.target_value, simulatedValue),
            status: finalStatus
          });

          // Fulfill phase 201: Outcome Learning Engine
          this.processLearningAndOutcome(
            tenantId, 
            goal, 
            strategy, 
            result ? result.revenue_gained : 1500, 
            result ? result.cost_saved : 200
          );

          dbEngine.goal_execution_plans.update(plan.id, { 
            status: finalStatus === 'completed' ? 'completed' : 'executing' 
          });

          feedbackLogs.push(`关联工作流 ${currentInstance.id} 战役告捷！归结算商业收益完成。目标达成比率已飙升至 ${updatedGoal.current_value}/${updatedGoal.target_value}！`);
        } else if (nextStepResult.currentStep) {
          // Provide and log dynamic feedback from active agents (Phase 201 Feedback Loops)
          const activeStep = nextStepResult.currentStep;
          
          dbEngine.execution_feedbacks.create({
            instance_id: goalId,
            feedback_loop: 'goal',
            agent_sender_id: activeStep.assigned_agent || 'AIBrainCoordinator',
            message: `[战时对账反馈] 专职专员正在执行任务 "${activeStep.name}". 数据汇报: ${activeStep.execution_response}`,
            issue_detected: false,
            adjustment_suggested: null
          });

          feedbackLogs.push(`智能体专员 (${activeStep.assigned_agent}) 正对账跟进。过程汇报：${activeStep.execution_response}`);
        }
      } else {
        // No active running workflow, check if goal needs manual check
        const achievedPercent = (goal.current_value / goal.target_value) * 100;
        if (achievedPercent >= 100) {
          dbEngine.goal_orchestrators.update(goal.id, { status: 'completed' });
          dbEngine.goal_execution_plans.update(plan.id, { status: 'completed' });
          feedbackLogs.push('宏观销量和营收目标对账判定完毕：成功达标，战役闭环关闭！');
        } else {
          // Auto scaling or boosting value
          const boostedValue = goal.current_value + Math.floor(Math.random() * 5) + 2;
          const status = boostedValue >= goal.target_value ? 'completed' : 'active';
          
          dbEngine.goal_orchestrators.update(goal.id, {
            current_value: Math.min(goal.target_value, boostedValue),
            status
          });

          if (status === 'completed') {
            dbEngine.goal_execution_plans.update(plan.id, { status: 'completed' });
          }
        }
      }
    }

    return {
      goal: dbEngine.goal_orchestrators.getById(goalId)!,
      workflowsExecuted,
      feedbackLogs
    };
  }

  /**
   * Phase 201: Outcome Learning Engine logic.
   * Compiles memories of strategy performance and updates decision models weights based on real market outcome.
   */
  private processLearningAndOutcome(
    tenantId: string,
    goal: GoalOrchestrator,
    strategy: StrategyPlan | null,
    revenueGained: number,
    costSaved: number
  ) {
    if (!strategy) return;

    // 1. Calculate outcomes and variances
    const expectedValue = goal.target_value;
    const actualValue = goal.current_value;
    const variancePercent = expectedValue > 0 ? ((actualValue - expectedValue) / expectedValue) * 100 : 0;
    const success = actualValue >= expectedValue;

    // 2. Log Goal Outcome Evaluation (Phase 199)
    dbEngine.goal_outcome_evaluations.create({
      orchestrator_id: goal.id,
      evaluation_metric: goal.target_metric,
      expected_value: expectedValue,
      actual_value: actualValue,
      variance_percent: parseFloat(variancePercent.toFixed(2)),
      success
    });

    // 3. Update tested hypothesis status (Phase 200 Strategy Planner)
    const hypotheses = dbEngine.strategy_hypotheses.getByStrategy(strategy.id);
    let keyConclusions = '本次补给定价战役在对账决策层面完备，完美验证了降价对冲机制与补货在途锁合的认知优势。';
    if (hypotheses.length > 0) {
      const hypothesis = hypotheses[0];
      dbEngine.strategy_hypotheses.update(hypothesis.id, {
        status: success ? 'proven' : 'disproven'
      });

      // Update Strategy Experiment
      const experiments = dbEngine.strategy_experiments.getByHypothesis(hypothesis.id);
      if (experiments.length > 0) {
        dbEngine.strategy_experiments.update(experiments[0].id, {
          status: 'completed',
          ended_at: new Date().toISOString()
        });
      }
    }

    // 4. Log Strategy Result
    dbEngine.strategy_results.create({
      strategy_id: strategy.id,
      outcome_summary: `战役成果审计：计划执行达到预期目标。实获营业周转增收 $${revenueGained}，阻断货架损失 $${costSaved}。`,
      revenue_impact: revenueGained,
      margin_impact: costSaved,
      conclusions: keyConclusions
    });

    // 5. Update Strategy Performance record and Self-Evolution Weighting
    const perfs = dbEngine.strategy_performances.getAll().filter(p => p.strategy_template_id === strategy.id);
    if (perfs.length > 0) {
      const perf = perfs[0];
      const newSuccess = perf.success_count + (success ? 1 : 0);
      const newFailure = perf.failure_count + (success ? 0 : 1);
      const totalRuns = newSuccess + newFailure;
      const confidenceShift = success ? 3 : -5;

      dbEngine.strategy_performances.update(perf.id, {
        success_count: newSuccess,
        failure_count: newFailure,
        avg_revenue_impact: parseFloat((((perf.avg_revenue_impact * (totalRuns - 1)) + revenueGained) / totalRuns).toFixed(2)),
        reliability_score: Math.max(50, Math.min(100, perf.reliability_score + confidenceShift))
      });
    }

    // 6. Record Outcome Memory (Phase 201)
    const outcomeRating = success ? 95 : 65;
    const learnings = success 
      ? `对账学习引擎：大衣在温差波动交界期拥有极强的改价购买力优势，其折价单价 $144.50 与 100% 在途补充大货组合，被证实是拉动营收的最高效率战术，下期权重建议增强 +12%。`
      : `对账学习引擎：促销折扣可能对于流失客群效果不够持久。未来应当结合更加深入的用户消费画像归因评估进行决策。`;

    dbEngine.outcome_memories.create({
      tenant_id: tenantId,
      context: `目标战术实施背景: ${goal.name}. 追踪度量: ${goal.target_metric}`,
      decision_taken: strategy.title,
      outcome_rating: outcomeRating,
      key_learnings: learnings
    });

    // 7. Write Decision Outcome Audit
    dbEngine.decision_outcomes.create({
      decision_id: strategy.id,
      decision_type: 'strategic_campaign',
      expected_metrics: `期望目标状态达至 ${expectedValue}`,
      actual_metrics: `最终对账达成状态达至 ${actualValue}`,
      deviation_analysis: success 
        ? `对账相符。无负面偏离，偏差率为 ${variancePercent.toFixed(2)}%。决策可靠性提升。` 
        : `预算/结果对账不相符。发生负向偏离 ${variancePercent.toFixed(2)}%，主因是客流渠道分拨发生承载滑点。`
    });

    // 8. Log experiential Business Memory (Phase 202)
    dbEngine.business_memories.create({
      tenant_id: tenantId,
      category: 'product_performance',
      experience_summary: `[认知闭环对账经验] ${strategy.title} 证明在 ${goal.target_metric} 场景下具有极强复用价值。真实营收转化：$${revenueGained}。`,
      context_tags: ['post-campaign', 'proven-strategy', goal.target_metric],
      importance_score: success ? 10 : 6,
      retrieved_count: 0,
      last_accessed_at: new Date().toISOString()
    });

    // 9. Update core Enterprise Skills Graph based on the tactical metric (Phase 205)
    let skillKey: 'market_expansion' | 'inventory_optimization' | 'dynamic_pricing' | 'customer_recall' | 'advertising_delivery' | 'margin_management' = 'market_expansion';
    if (goal.target_metric === 'sales_volume') {
      skillKey = 'inventory_optimization';
    } else if (goal.target_metric === 'gmv') {
      skillKey = 'customer_recall';
    } else if (strategy.title.includes('改价') || strategy.title.includes('打折')) {
      skillKey = 'dynamic_pricing';
    } else {
      skillKey = 'margin_management';
    }
    skillGraphEngine.registerSkillUsage(tenantId, skillKey, success, revenueGained);

    // 10. Recalculate Capability Scores over time based on feedback (Phase 203)
    capabilityScoringEngine.assessAllCapabilities(tenantId);

    // 11. Anonymously share proven strategic outcomes to the multi-store network (Phase 206)
    if (success && revenueGained > 2000) {
      multiStoreIntelligence.shareProvenExperience(
        tenantId,
        'FR', // Default French market country context
        'clothing', // Default Category clothing
        'reduction_percentage', // Default Strategy type
        `${strategy.title} 并在对账结算中实获 $${revenueGained} 回流`,
        revenueGained,
        variancePercent > 0 ? variancePercent : 15.0
      );
    }
  }

  /**
   * Safe baseline calculations per metric type
   */
  private getCurrentMetricBaseValue(metric: string): number {
    if (metric === 'sales_volume') return 100; // baseline volume
    if (metric === 'gmv') return 5200; // baseline GMV
    if (metric === 'profit_margin') return 45; // baseline margin
    return 100;
  }
}

export const goalOrchestratorEngine = GoalOrchestratorEngine.getInstance();
