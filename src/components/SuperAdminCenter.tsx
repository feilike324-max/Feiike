import React, { useState, useMemo } from 'react';
import { 
  BarChart3, Users, Bot, Settings, Database, RefreshCw, 
  Send, AlertTriangle, Key, Sliders, Check, Network, Activity,
  CreditCard, Mail, Eye, Play, Pause, Trash, ArrowRight, Shield, FileText, Globe,
  Code, Search, Lock, HelpCircle, Terminal, Coins, DollarSign,
  Brain, Award, Zap, CheckCircle, ShieldCheck, Inbox, Sparkles, Trash2, Scale, LayoutDashboard, Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { TenantConfig, AppMarketItem, IndustryType } from '../types';
import EcosPerformanceOptimizer from './admin/ai-brain-center/EcosPerformanceOptimizer';
import EcosStrategicIntelligence from './admin/ai-brain-center/EcosStrategicIntelligence';
import EcosCognitiveGovernance from './admin/ai-brain-center/EcosCognitiveGovernance';
import EcosEnterpriseNervousSystem from './admin/ai-brain-center/EcosEnterpriseNervousSystem';
import AIDiscoveryCenter from './admin/ai-brain-center/AIDiscoveryCenter';
import AIExecutionControlCenter from './admin/ai-brain-center/AIExecutionControlCenter';
import EcosCEODashboard from './admin/ai-brain-center/EcosCEODashboard';
import EcosMasterDirectory from './admin/ai-brain-center/EcosMasterDirectory';

interface SuperAdminCenterProps {
  activeSubTab?: 'stats' | 'tenants' | 'query' | 'gateways' | 'ai-ops' | 'roles' | 'logs' | 'diagnostics' | 'settings';
  tenants: TenantConfig[];
  onUpdateTenantStatus: (tenantId: string, status: 'active' | 'suspended') => void;
  onUpdateTenantAiBudget: (tenantId: string, budget: number) => void;
  marketItems: AppMarketItem[];
  onAddMarketItem: (item: AppMarketItem) => void;
  globalDefaultModel: string;
  onChangeGlobalModel: (model: string) => void;
  onAddSystemLog: (module: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  activeAgents?: any[];
  onUpdateAgents?: (agents: any[]) => void;
  onChangeSubTab?: (subTab: string) => void;
  auditLogs?: any[];
  setAuditLogs?: React.Dispatch<React.SetStateAction<any[]>>;
  agentRuns?: any[];
  setAgentRuns?: React.Dispatch<React.SetStateAction<any[]>>;
  agentTasks?: any[];
  setAgentTasks?: React.Dispatch<React.SetStateAction<any[]>>;
  tenantDB?: Record<string, any>;
  setTenantDB?: React.Dispatch<React.SetStateAction<any>>;
  addLog?: (agent: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
  selectedIndustry?: IndustryType;
}

export default function SuperAdminCenter({
  activeSubTab = 'stats',
  tenants,
  onUpdateTenantStatus,
  onUpdateTenantAiBudget,
  marketItems,
  onAddMarketItem,
  globalDefaultModel,
  onChangeGlobalModel,
  onAddSystemLog,
  activeAgents = [],
  onUpdateAgents,
  onChangeSubTab,
  auditLogs = [],
  setAuditLogs,
  agentRuns = [],
  setAgentRuns,
  agentTasks = [],
  setAgentTasks,
  tenantDB,
  setTenantDB,
  addLog,
  selectedIndustry = 'retail'
}: SuperAdminCenterProps) {

  // ==================== 24h System Task Performance Data for Recharts ====================
  const last24hPerformanceData = useMemo(() => {
    const data = [];
    const baseHour = 14; 
    for (let i = 23; i >= 0; i--) {
      const hourVal = (baseHour - i + 24) % 24;
      const hourStr = `${hourVal.toString().padStart(2, '0')}:00`;
      
      const isBusinessHour = hourVal >= 9 && hourVal <= 18;
      const baseTasks = isBusinessHour ? 220 : 115;
      const tasks = Math.floor(baseTasks + Math.sin(i * 0.8) * 45 + Math.random() * 20);
      
      const baseLatency = isBusinessHour ? 205 : 145;
      const latency = Math.floor(baseLatency + Math.cos(i * 0.8) * 20 + Math.random() * 15);
      
      data.push({
        time: hourStr,
        tasks,
        latency,
      });
    }
    return data;
  }, []);

  const performanceStats = useMemo(() => {
    const totalTasks = last24hPerformanceData.reduce((sum, item) => sum + item.tasks, 0);
    const avgLatency = Math.round(last24hPerformanceData.reduce((sum, item) => sum + item.latency, 0) / last24hPerformanceData.length);
    return {
      totalTasks,
      avgLatency,
      successRate: '99.91%',
    };
  }, [last24hPerformanceData]);

  // ==================== 1. 平台控制中心 States ====================
  const [allowSignup, setAllowSignup] = useState(true);
  const [trialEnabled, setTrialEnabled] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [readonlyMode, setReadonlyMode] = useState(false);
  const [systemNotice, setSystemNotice] = useState('温馨提示：平台定于 2026-06-12 凌晨 03:00 进行系统路由性能和数据库索引优化升级，届时系统各项功能不受影响。');
  const [isNoticeBroadcasting, setIsNoticeBroadcasting] = useState(false);
  const [upgradeLogs, setUpgradeLogs] = useState<string[]>([]);
  const [isUpgrading, setIsUpgrading] = useState(false);

  // ==================== 2. 租户中心 Extra States ====================
  const [tokenAdjustments, setTokenAdjustments] = useState<Record<string, number>>({});
  const [selectedTenantData, setSelectedTenantData] = useState<TenantConfig | null>(null);

  // ==================== 3. 数据查询中心 States ====================
  const [selectedTable, setSelectedTable] = useState<'orders' | 'products' | 'customers' | 'tenants'>('orders');
  const [queryInput, setQueryInput] = useState('SELECT * FROM orders LIMIT 20;');
  const [searchQuery, setSearchQuery] = useState('');
  const [queryError, setQueryError] = useState<string | null>(null);

  // Real Database Extraction
  const allOrders = useMemo(() => {
    if (!tenantDB) return [];
    return Object.keys(tenantDB).flatMap(industry => {
      const db = tenantDB[industry];
      return (db.orders || []).map((o: any) => ({ ...o, industry }));
    });
  }, [tenantDB]);

  const allProducts = useMemo(() => {
    if (!tenantDB) return [];
    return Object.keys(tenantDB).flatMap(industry => {
      const db = tenantDB[industry];
      return (db.products || []).map((p: any) => ({ ...p, industry }));
    });
  }, [tenantDB]);

  const allCustomers = useMemo(() => {
    if (!tenantDB) return [];
    return Object.keys(tenantDB).flatMap(industry => {
      const db = tenantDB[industry];
      return (db.customers || []).map((c: any) => ({ ...c, industry }));
    });
  }, [tenantDB]);

  // Handle data querying based on selections/CLI commands
  const processedQueryResult = useMemo(() => {
    let sourceData: any[] = [];
    if (selectedTable === 'orders') sourceData = allOrders;
    else if (selectedTable === 'products') sourceData = allProducts;
    else if (selectedTable === 'customers') sourceData = allCustomers;
    else if (selectedTable === 'tenants') sourceData = tenants;

    if (!searchQuery.trim()) {
      return sourceData;
    }

    const term = searchQuery.toLowerCase().trim();
    return sourceData.filter(item => {
      return Object.values(item).some(val => {
        if (!val) return false;
        return String(val).toLowerCase().includes(term);
      });
    });
  }, [selectedTable, allOrders, allProducts, allCustomers, tenants, searchQuery]);

  // ==================== 4. 支付通道 States ====================
  const [paymentGateways, setPaymentGateways] = useState([
    { id: 'stripe', name: 'Stripe 境外信用卡渠道网关', apiKey: 'sk_live_51Msz8pG9Ap82K...', webhook: 'https://SaaS-api.shopify.net/webhooks/stripe', status: true, syncTime: '2026-06-08 14:15:30', errorLogs: ['Webhook signature verification warning (2026-06-08 10:22)'] },
    { id: 'paypal', name: 'PayPal 贝宝数字金融对账网关', apiKey: 'client_id_live_A98F...', webhook: 'https://SaaS-api.shopify.net/webhooks/paypal', status: true, syncTime: '2026-06-08 13:58:12', errorLogs: [] },
    { id: 'adyen', name: 'Adyen 欧陆多币种快捷清算宿主', apiKey: 'ws_prod_z87y90aK772B...', webhook: 'https://SaaS-api.shopify.net/webhooks/adyen', status: true, syncTime: '2026-06-08 12:44:09', errorLogs: [] },
    { id: 'klarna', name: 'Klarna 境外先买后付账款信托', apiKey: 'pk_klarna_de_8b244...', webhook: 'https://SaaS-api.shopify.net/webhooks/klarna', status: false, syncTime: '从未同步', errorLogs: ['API credentials revoked by Klarna gateway sandbox issuer'] }
  ]);
  const [isSyncingGateway, setIsSyncingGateway] = useState<string | null>(null);

  // ==================== 5. AI 大脑中心 States ====================
  const [aiCentralTab, setAiCentralTab] = useState<'dashboard' | 'execution_center' | 'discovery' | 'monitoring' | 'optimizer' | 'strategic' | 'cognitive' | 'nervous' | 'memory' | 'boardroom' | 'system_map'>('dashboard');
  const [aiOpTab, setAiOpTab] = useState<'revenue' | 'fraud' | 'campaign'>('revenue');
  const [dispatchedCampaign, setDispatchedCampaign] = useState(false);
  const [dispatchedSettlement, setDispatchedSettlement] = useState(false);
  const [lockedRisk, setLockedRisk] = useState(false);

  const [agentsList, setAgentsList] = useState([
    { id: 'inventory_agent', name: '库存调控代理 (Inventory Control Agent)', status: 'Active', version: 'v3.2.1', runs: 124, lastTime: '2.5s' },
    { id: 'pricing_agent', name: '实时调价智能体 (Pricing Adjustment Agent)', status: 'Active', version: 'v3.1.8', runs: 85, lastTime: '1.8s' },
    { id: 'marketing_agent', name: '客户挽留智能体 (Loyalty Re-engager Agent)', status: 'Active', version: 'v2.9.4', runs: 215, lastTime: '3.1s' },
    { id: 'support_agent', name: '智能客服专家 (Support Operations Expert)', status: 'Active', version: 'v4.0.2', runs: 412, lastTime: '0.9s' },
    { id: 'risk_agent', name: '风控拦截智能网 (Risk & Fraud Defensor)', status: 'Disabled', version: 'v2.1.0', runs: 18, lastTime: '4.2s' }
  ]);

  // Global Decisive AI Chat State (总后台 AI 智能运维)
  const [globalAIChatMessages, setGlobalAIChatMessages] = useState<any[]>([
    {
      role: 'assistant',
      content: `系统正常运行中。当前已对接全网活跃隔离商户，所有通道运行平稳。

我可以协助您执行全平台财务对账、风控高危商户筛选、联合战役效果评估。比如您可以问我：
- “过去7天全平台表现怎么样？”
- “哪些商铺的异常争议退款风险最高？”
- “当前全网各隔离商户的利润表现与 MRR 汇总”`
    }
  ]);
  const [globalAIChatInput, setGlobalAIChatInput] = useState('');
  const [isGlobalAIThinking, setIsGlobalAIThinking] = useState(false);

  // Fetch real agent task list
  const realAgentTasks = useMemo(() => {
    return agentTasks.length > 0 ? agentTasks : [
      { id: 'tsk_0091', agentId: 'inventory_agent', name: '服装保税仓库存缺料核查与补货命令', executionTime: '2026-06-08 14:12', result: '已补货提交至审批', status: 'WAIT_FOR_APPROVAL' },
      { id: 'tsk_0088', agentId: 'pricing_agent', name: '外卖披萨热销峰值竞品调价核算', executionTime: '2026-06-08 13:40', result: '平均单价上调 €1.2 加权通过', status: 'FINISHED' }
    ];
  }, [agentTasks]);

  // ==================== ECOS Enterprise Cognitive Operating System States ====================
  const [selectedDebateId, setSelectedDebateId] = useState<number>(1);
  const [humanRulingText, setHumanRulingText] = useState('');
  const [humanResolutionPath, setHumanResolutionPath] = useState('');
  const [showAnalysisPathId, setShowAnalysisPathId] = useState<number | null>(null);

  // ECOS Memories (DNA Memory Constraints Database)
  const [memories, setMemories] = useState<any[]>([
    { id: 1, category: 'Brand Alignment', fact: '核心定位中高端服饰线。全集群任何单品由于换季折扣导致毛净利率严禁穿透 35% 红线。', importance: 'critical' },
    { id: 2, category: 'Pricing Protection', fact: '法国及意区特定自然冬季蚕丝特制品必须锚定高附加值定价，避开大众化廉价红波段。', importance: 'critical' },
    { id: 3, category: 'Geographical Boundary', fact: '核心市场物理隔离区划：目前主力覆盖法国、意大利。任何非常规物流阻尼应自动向两端分摊决策。', importance: 'normal' }
  ]);
  const [newMemoryCategory, setNewMemoryCategory] = useState('Brand Alignment');
  const [newMemoryImportance, setNewMemoryImportance] = useState<'normal' | 'critical'>('critical');
  const [newMemoryFact, setNewMemoryFact] = useState('');

  // ECOS Debates (Level 7 multi-agent board disputation)
  const [debates, setDebates] = useState<any[]>([
    {
      id: 1,
      topicTitle: '阿尔卑斯冬季山路滑溜阻尼增加导致法国仓蚕丝/羊毛系列爆款在12天内极缺的库存自适应调拨对冲策略',
      status: 'pending',
      opinions: [
        {
          agentName: 'WMS Supply Chain Sentry',
          agentCategory: 'Inventory',
          recommendation: '紧急启用意大利 Rome 保税二级大库的 300 件蚕丝成品物料，一键保税调拨分摊至法国 Lyon 主力库房。',
          rationale: '法国巴黎备库在 12 天内 100% 出现物理断供。意大利由于前期过剩备仓，可以完美分摊该溢出流量。',
          financialImpact: '提振净利+€5,200',
          confidenceScore: 89,
          isDominantAlternative: true
        },
        {
          agentName: 'Campaign Optimizer Sentry',
          agentCategory: 'Marketing',
          recommendation: '立即对法国里昂、巴黎等高流量沸点区全网用户限停发放“冬季系列”折扣优惠，调高毛净溢价率。',
          rationale: '通过局部价格歧视阻尼压制购买热度，拉长货架销售时长，规避物理断货的客户流失创伤。',
          financialImpact: '利润保全+€3,100',
          confidenceScore: 78,
          isDominantAlternative: false
        },
        {
          agentName: 'Financial Liquidity Sentry',
          agentCategory: 'Financial',
          recommendation: '暂缓法国仓调物物料行动。将储备资金全数转入清分结转高收益对冲债，保持 MRR 账期现金流最高安全分值。',
          rationale: '目前多租户跨国结汇因关税波动出现 1.5% 阻尼攀升，在银行清分窗口调运物料容易带来瞬时透支。',
          financialImpact: '理财收益+€1,800',
          confidenceScore: 65,
          isDominantAlternative: false
        },
        {
          agentName: 'Sovereign Sentry',
          agentCategory: 'Risk',
          recommendation: '物理冻结苏黎世大车物理路线。由于瑞士本周由于气象波幅产生高额临时关税（18.5%），必须重定向调拨轨迹。',
          rationale: '严格效忠 ECOS 宪规关税保全红线，宁愿空转 24h 也不可让多租户资金暴露在高危关税罚单概率中。',
          financialImpact: '规避流失+€18,600',
          confidenceScore: 92,
          isDominantAlternative: false
        }
      ]
    },
    {
      id: 2,
      topicTitle: '多租户法国店面谷歌广告投放 ROI 本周下滑 18.2% 与广告支出削减 25% 的联合应对论证',
      status: 'ruled',
      opinions: [
        {
          agentName: 'Campaign Optimizer Sentry',
          agentCategory: 'Marketing',
          recommendation: '立即消减法国低转换 Ad Group 广告开支 25%，向意大利优质引流人群重定向分派 15,000 欧元。',
          rationale: '法国获客成本（CAC）超出毛利容忍极值。将优质预算转移至意大利可以使全局 ROI 恢复 12%。',
          financialImpact: '挽回流量+€4,500',
          confidenceScore: 84,
          isDominantAlternative: true
        },
        {
          agentName: 'Financial Liquidity Sentry',
          agentCategory: 'Financial',
          recommendation: '全局冻结广告预算。将 25% 广告开支直接计入本季利润，防止跨国流动性发生负向偏离。',
          rationale: '由于外部结清利率调换，多租户在现汇期暴露，削减预算直接回款是保证现金流最好的自适应防线。',
          financialImpact: '纯利留存+€6,000',
          confidenceScore: 71,
          isDominantAlternative: false
        }
      ],
      ceoRuling: {
        decision: 'Sovereign Ruling Overrides Action Plans. Reject marketing scaling; freeze low efficiency Ad campaigns. Enforce localized dispatching path.',
        justification: 'Issued manually via Central AI Brain Core overriding automated standoffs to protect net margins above 35% and avoid Alpine border transit tariffs.',
        confidenceScore: 99,
        actionPlan: [
          '第一步：锁死瑞士海关大车物料运行。',
          '第二步：意大利罗马本地快速物流启动，调拨120件蚕丝。',
          '第三步：消减法国18%低ROI投放，结余进入清分池。'
        ]
      }
    }
  ]);

  // ECOS Operator simulated tasks tracer
  const [operatorTasks, setOperatorTasks] = useState<any[]>([
    {
      id: 1,
      taskName: 'ECOS Background Real-time Sentry Alignment (大仓备货水位与潜在缺货断货巡诊)',
      status: 'completed',
      subSteps: [
        { name: '多维数据库拉取主力大仓 (巴黎、里昂、罗马) 实时结余水位物理值', status: 'completed' },
        { name: '调用霍尔特-温特斯 (Exponential Smoothing) 时间序列拟合销量斜率', status: 'completed' },
        { name: '判定安全囤积天数 (Safety Limit) 穿透，发送紧急缺货中断命令 (OK)', status: 'completed' }
      ]
    },
    {
      id: 2,
      taskName: 'Ad Conversion Yield & Multi-Tenant Isolated Ad ROI Balance check (跨隔离租户广告投放转换分析纠偏)',
      status: 'running',
      subSteps: [
        { name: '自动解离隔离租户 (Tenant_id: e1a3b9) 支付通道中 Adyen 的物理数据', status: 'completed' },
        { name: '分析该隔离租户在法国、意区的引流转化 ROI 与竞品指数偏位', status: 'running' },
        { name: '计算高维 Bayesian 归因图谱，纠正是由于山路交通阻尼导致的履约率延迟导致的流失', status: 'pending' }
      ]
    },
    {
      id: 3,
      taskName: 'Reverse Logistics Optimization & Fraud Refund Denial (跨境逆向物流分析与异常退单欺诈防护)',
      status: 'pending',
      subSteps: [
        { name: '捕获全网异常跨区退货、非合规多次索赔的用户物理签名', status: 'pending' },
        { name: '启动三方信用预估评级核查，防止跨租户穿透刷单', status: 'pending' },
        { name: '自动拉黑并自主下达拒付答辨书制备 (Sovereign Shield On)', status: 'pending' }
      ]
    }
  ]);

  // ECOS Insights Ledger (Level 5 learning log)
  const [insights, setInsights] = useState<any[]>([
    { id: 1, insightCategory: 'User Purchasing Path', factLearned: '法国本土中高端VIP老客的冬季购买爆发点在周四下午 14:00 - 17:00，此时进行个性化邮件触达，转化密度平均提纯 18.25%。', impactScore: '+18.25%', validatedAt: '2026-06-05' },
    { id: 2, insightCategory: 'Margin Safeguard Rule', factLearned: '为了追求GMV大促而使单品综合折扣超越 20% 时，将物理击穿 35% 集团净利底线，并且用户在之后 90 天内复购意愿产生 22.4% 的贬损。', impactScore: 'Margin Protected', validatedAt: '2026-05-28' },
    { id: 3, insightCategory: 'Logistics Mountain Impedance', factLearned: '阿尔卑斯冬季降雪大范围封路情况下，由米兰保税区向巴黎发货的履约时效延迟 4.2天，平均每票损耗提升 €12.5。重定向至热那亚港口海运时效稳定且成本降低 9%。', impactScore: 'Cost Offset 9%', validatedAt: '2026-05-12' }
  ]);

  // ECOS Hypotheses diagnostic console
  const [hypotheses, setHypotheses] = useState<any[]>([
    {
      id: 1,
      hypothesisLabel: '高利润拉升契机：由特定冬季气温降幅诱导的服装板块意向度上扬',
      description: '大区天气监测核算，法国及欧陆在 7 天内气温面临 4.8 摄氏度骤降，VIP用户寻找防风呢大衣搜索转化率有 89% 概率急剧上冲。建议一键启用备用调拨路线。',
      confidenceScore: 89,
      status: 'dominant',
      logicalChain: ['气象气温骤落 4.8°C', '特定词搜索点击上扬 22%', '高溢价蚕丝/羊毛需求井喷', '意大利保税仓成品分拨'],
      supportingEvidence: [
        '实时欧陆气象哨所 (Meteo-France) 冬季锋面移动跟踪数据。',
        '多租户法国区本周搜索“大衣”、“羊毛”、“蚕丝”点击频次较上世纪上扬 22%。',
        '意大利 Rome 保税二级库目前成品储备饱和率达 142.5%，具有高富余空间。',
      ],
      refutationTrigger: '如果法国各隔离店面内自然库存水位在 5 天内无法得到物流批准，则该机会演化为硬饥饿缺货创伤。'
    }
  ]);

  // ECOS Interactivities
  const handleAddNewMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryFact.trim()) return;
    const item = {
      id: memories.length + 1,
      category: newMemoryCategory,
      fact: newMemoryFact,
      importance: newMemoryImportance
    };
    setMemories([item, ...memories]);
    setNewMemoryFact('');
    onAddSystemLog('AI Central Core - Memories', '写入企业DNA原则', `添加长期认知守则: [${newMemoryCategory}] "${newMemoryFact}"`, 'success');
    alert('DNA 新认知记忆条例已成功写入核心模型规则引擎底座！');
  };

  const handleDeleteMemory = (id: number) => {
    setMemories(memories.filter((m) => m.id !== id));
    onAddSystemLog('AI Central Core - Memories', '清除企业记忆', `擦除了 DNA 条例 #${id}`, 'warning');
  };

  const handleEnforceHumanRuling = (debateId: number) => {
    if (!humanRulingText.trim()) return;
    const actionPlans = humanResolutionPath.trim() 
      ? humanResolutionPath.split('\n').filter(Boolean) 
      : ['Manually override standoff.', 'Force immediate dispatch.'];

    setDebates(debates.map(d => {
      if (d.id === debateId) {
        return {
          ...d,
          status: 'ruled',
          ceoRuling: {
            decision: humanRulingText,
            justification: 'Issued manually via Central Strategic Control Core overriding automated standoff.',
            confidenceScore: 99,
            actionPlan: actionPlans
          }
        };
      }
      return d;
    }));

    onAddSystemLog('AI Central Command', '最高特批裁决', `仲裁纠纷 #${debateId}: "${humanRulingText}"`, 'success');
    setHumanRulingText('');
    setHumanResolutionPath('');
    alert('⚖ 最高总裁执行令已成功签署！底层 AI Boardroom 意见僵持已被打破，逻辑指令已下发至隔离节点。');
  };

  const handleSimulateOperatorTask = () => {
    setOperatorTasks(operatorTasks.map((t) => {
      if (t.status === 'running') {
        const nextSteps = t.subSteps.map((s) => {
          if (s.status === 'running') {
            return { ...s, status: 'completed' as const };
          } else if (s.status === 'pending') {
            return { ...s, status: 'running' as const };
          }
          return s;
        });
        const hasRunningNow = nextSteps.some(s => s.status === 'running');
        return {
          ...t,
          subSteps: nextSteps,
          status: hasRunningNow ? 'running' as const : 'completed' as const
        };
      } else if (t.status === 'pending') {
        const nextSteps = [...t.subSteps];
        if (nextSteps.length > 0) nextSteps[0].status = 'running';
        return {
          ...t,
          subSteps: nextSteps,
          status: 'running' as const
        };
      }
      return t;
    }));
    onAddSystemLog('AI Central Core - Simulator', '步骤自仿真运行', '点击触发推进中央巡航自演算步骤', 'info');
  };

  const selectedDebate = debates.find(d => d.id === selectedDebateId);

  // ==================== 6. 权限中心 States ====================
  const [rolesList, setRolesList] = useState([
    { id: 'owner', name: '系统拥有者 (Owner)', desc: '拥有平台的完整底座管理、账期结算、物理网格配置与财务支配权', permissions: { product: true, order: true, finance: true, ai_ops: true, sys_config: true } },
    { id: 'admin', name: '系统管理员 (Super Admin)', desc: '运维级管理主控台、租户配额动态调拨、日志安全回放审计', permissions: { product: true, order: true, finance: true, ai_ops: true, sys_config: false } },
    { id: 'manager', name: '服务主管级 (Manager)', desc: '管理客户产品合规发布、纠纷订单退款仲裁拦截安全限额控制', permissions: { product: true, order: true, finance: false, ai_ops: true, sys_config: false } },
    { id: 'staff', name: '运营专员组 (Staff)', desc: '可查询租户日常统计数据、对账流水，一般无任何配置更改审批权限', permissions: { product: true, order: false, finance: false, ai_ops: false, sys_config: false } },
    { id: 'support', name: '客服保障组 (Support)', desc: '可协助查询退款详情状态与日志轨迹，但无修改商品价格或支付密钥权限', permissions: { product: false, order: true, finance: false, ai_ops: false, sys_config: false } }
  ]);

  const [settingsForm, setSettingsForm] = useState({
    maxCommissionCap: 5.0,
    sessionTimeout: 3600
  });

  // ==================== 8. 系统诊断中心 States ====================
  const [dbDiagnostic, setDbDiagnostic] = useState({ name: 'PostgreSQL Database Cluster', status: 'Connected', delay: '12ms', msg: '主从节点同步顺畅，空闲连接池池容量：94%' });
  const [redisDiagnostic, setRedisDiagnostic] = useState({ name: 'Redis Cache Memory Host', status: 'Connected', delay: '2ms', msg: '热缓存命中率：98.4%，物理占用内存：840 KB / 2 GB' });
  const [stripeHookDiagnostic, setStripeHookDiagnostic] = useState({ name: 'Stripe Webhook Pipeline', status: 'Healthy', delay: '45ms', msg: '事件转发通畅，最新心跳包签名验证 200 OK' });
  const [geminiDiagnostic, setGeminiDiagnostic] = useState({ name: 'LLM Model Gateway (Gemini API)', status: 'Connected', delay: '880ms', msg: '并发配额剩余 99.8%，安全审计围栏层正常防御' });
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  // ==================== Helper Functions ====================
  const handleNoticeBroadcast = () => {
    setIsNoticeBroadcasting(true);
    setTimeout(() => {
      setIsNoticeBroadcasting(false);
      onAddSystemLog('平台公告发布', '发布网站公告', `更新并广播全网公告: "${systemNotice}"`, 'success');
      alert('公告已成功广播至全网多租户前台与后台顶栏！');
    }, 800);
  };

  const handleSystemUpgrade = () => {
    setIsUpgrading(true);
    setUpgradeLogs(['[1/4] 🚀 正在关闭外部网格注册，防止状态中断...', '[2/4] 🔍 备份主物理卷表 products/orders/tenants 并刷新事务提交...']);
    setTimeout(() => {
      setUpgradeLogs(prev => [...prev, '[3/4] 🛠️ 热重载 System Router 并更新 Ollama / Gemini 模型反演安全红线...']);
      setTimeout(() => {
        setUpgradeLogs(prev => [...prev, '[4/4] 🟢 底层物理安全模块重新加载完毕！租户物理隔离网格恢复。升级成功！']);
        setIsUpgrading(false);
        onAddSystemLog('平台升级控制', '底座物理系统升级', '全流程无缝热重载成功率 100%，数据库无缝切换', 'success');
        alert('全网物理底座集群及路由算法性能优化升级完毕！');
      }, 1000);
    }, 1000);
  };

  const handleTestConnection = (id: string, gatewayName: string) => {
    onAddSystemLog('支付中心', '测试链接', `触发网关 [${gatewayName}] 的 API 安全连接性能校验`, 'info');
    alert(`测试连接中...\n网关「${gatewayName}」安全握手连接校验通过！延迟 32ms`);
  };

  const handleSyncNow = (id: string, gatewayName: string) => {
    setIsSyncingGateway(id);
    setTimeout(() => {
      setIsSyncingGateway(null);
      setPaymentGateways(prev => prev.map(g => {
        if (g.id === id) {
          return { ...g, syncTime: new Date().toISOString().replace('T', ' ').substring(0, 19) };
        }
        return g;
      }));
      onAddSystemLog('支付中心', '数据对账同步', `完成网关 [${gatewayName}] 账账核对事务处理`, 'success');
      alert(`网关「${gatewayName}」与后端账房结算中心自动同步完毕！账单对账已物理同步至最新时刻。`);
    }, 1200);
  };

  const handleDiagnoseAll = () => {
    setIsDiagnosing(true);
    setTimeout(() => {
      setDbDiagnostic(prev => ({ ...prev, delay: `${Math.floor(Math.random() * 5) + 8}ms`, status: 'Connected' }));
      setRedisDiagnostic(prev => ({ ...prev, delay: `${Math.floor(Math.random() * 3) + 1}ms`, status: 'Connected' }));
      setStripeHookDiagnostic(prev => ({ ...prev, delay: `${Math.floor(Math.random() * 20) + 30}ms`, status: 'Healthy' }));
      setGeminiDiagnostic(prev => ({ ...prev, delay: `${Math.floor(Math.random() * 200) + 700}ms`, status: 'Connected' }));
      setIsDiagnosing(false);
      onAddSystemLog('系统诊断引擎', '全网综合体检', '物理网格、高速缓存、海关网关全链路健康体检满分', 'success');
      alert('全网 4 颗核心宿主物理服务器、中间件及 API 出入口线路全面诊断，体检结果: 🟢 优秀！');
    }, 1200);
  };

  const handleToggleAgent = (id: string, name: string) => {
    setAgentsList(prev => prev.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'Active' ? 'Disabled' : 'Active';
        onAddSystemLog('AI大脑控制', nextStatus === 'Active' ? '激活代理' : '停用代理', `更改智能体 「${name}」运行状态为 ${nextStatus}`, nextStatus === 'Active' ? 'success' : 'warning');
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  return (
    <div className="w-full text-slate-800 font-sans animate-fadeIn">
      
      {/* 2. Top Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">平台总后台 · SYSTEM</h1>
            <span className="bg-[#07C2E3]/10 text-[#07C2E3] text-[9px] px-2 py-0.5 rounded font-black tracking-wider uppercase border border-[#07C2E3]/20">SUPER_ADMIN</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#07C2E3] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#07C2E3]"></span>
          </span>
          <span className="text-xs font-bold text-[#07C2E3] bg-[#07C2E3]/5 border border-[#07C2E3]/20 rounded-lg px-3 py-1.5 font-mono">
            SYS: ACTIVE_ONLINE
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MENU 1: 📊 平台控制中心 */}
      {/* ========================================================= */}
      {activeSubTab === 'stats' && (
        <div className="space-y-6 text-left">
          
          {/* Section Summary Row - derived purely from local DB! */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">全网多租户累计 GMV</span>
                <span className="p-1 px-1.5 bg-slate-50 text-slate-500 rounded text-[9px] font-bold font-mono">Real-DB</span>
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
                € {allOrders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 1 })}
              </p>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1">自动累加 {allOrders.length} 笔实际单据</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">活跃租户数</span>
                <span className="p-1 px-1.5 bg-slate-50 text-slate-500 rounded text-[9px] font-bold font-mono">Live</span>
              </div>
              <p className="text-xl font-black text-slate-900 mt-2 font-mono">
                {tenants.filter(t => t.status === 'active').length} <span className="text-xs font-medium text-slate-400">/ {tenants.length} 家</span>
              </p>
              <div className="text-[10px] text-amber-600 font-semibold mt-1">{tenants.filter(t => t.status === 'suspended').length} 家停运隔离</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">平台 API 算力消耗</span>
                <span className="p-1 px-1.5 bg-slate-50 text-slate-500 rounded text-[9px] font-bold font-mono">Audit</span>
              </div>
              <p className="text-xl font-black text-slate-900 mt-2 font-mono">
                ${tenants.reduce((sum, t) => sum + (t.aiSpent || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 1 })}
              </p>
              <div className="text-[10px] text-[#07C2E3] font-semibold mt-1">
                配额上限总额
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">底座版本</span>
                <span className="p-1 px-1.5 bg-[#07C2E3]/10 text-[#07C2E3] rounded text-[9px] font-bold font-mono">Firmware</span>
              </div>
              <p className="text-sm font-black text-[#07C2E3] mt-2 font-mono truncate">
                VER_OS_3.5_STABLE
              </p>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                欧洲中部节点 (Swiss Node)
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Controller Left Body */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5 lg:col-span-2">
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
                <Sliders className="w-4 h-4 text-[#07C2E3]" />
                <h3 className="text-xs font-black text-slate-900 uppercase">系统开关</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="p-4 bg-slate-50 hover:bg-slate-100/50 rounded-lg border border-slate-150 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">自主注册通道</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">控制外来企业自主入驻</p>
                    </div>
                    <button
                      onClick={() => {
                        setAllowSignup(!allowSignup);
                        onAddSystemLog('平台控制室', '注册通道', `${!allowSignup ? '建立并开放' : '熔断并拦截'}新入驻注册接口`, 'warning');
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${allowSignup ? 'bg-[#07C2E3]' : 'bg-slate-300'}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${allowSignup ? 'left-6.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 hover:bg-slate-100/50 rounded-lg border border-slate-150 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">30天体验额度</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">允许免费白名单用户额度体验</p>
                    </div>
                    <button
                      onClick={() => {
                        setTrialEnabled(!trialEnabled);
                        onAddSystemLog('平台控制室', '试用规则', `试用状态变更为: ${!trialEnabled ? '允许' : '屏蔽'}`, 'info');
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${trialEnabled ? 'bg-[#07C2E3]' : 'bg-slate-300'}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${trialEnabled ? 'left-6.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-rose-50/40 hover:bg-rose-50 rounded-lg border border-rose-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-rose-950">系统维护锁定模式</p>
                      <p className="text-[10px] text-rose-600 mt-0.5">强弹维护提示，禁止交易更改</p>
                    </div>
                    <button
                      onClick={() => {
                        setMaintenanceMode(!maintenanceMode);
                        onAddSystemLog('平台控制室', '安全维护锁', `${!maintenanceMode ? '🚨 强行维护' : '🔓 一键复位恢复'}`, 'error');
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${maintenanceMode ? 'bg-rose-600' : 'bg-slate-300'}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${maintenanceMode ? 'left-6.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-amber-50/40 hover:bg-amber-50 rounded-lg border border-amber-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-amber-950">商户配置只读锁</p>
                      <p className="text-[10px] text-amber-600 mt-0.5">锁定全网支付、密钥与权限数据库</p>
                    </div>
                    <button
                      onClick={() => {
                        setReadonlyMode(!readonlyMode);
                        onAddSystemLog('平台控制室', '只读锁', `${!readonlyMode ? '⚠️ 开启只读保护' : '🔓 解除只读保护'}`, 'warning');
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${readonlyMode ? 'bg-amber-[#07C2E3]' : 'bg-slate-300'}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${readonlyMode ? 'left-6.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>

              </div>

              {/* Maintenance Warning Banner if active */}
              {maintenanceMode && (
                <div className="bg-rose-50 border border-rose-200 text-rose-900 rounded-xl p-4 flex gap-3 text-xs font-semibold">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-rose-950 block">高危维护</span>
                    <span className="font-normal block mt-1 text-rose-700">系统已挂起拦截全部交易及自动化指令。</span>
                  </div>
                </div>
              )}

              {/* Global System notice setting - REAL ACTION */}
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">📢 广播全局系统公告</span>
                  <span className="text-[10px] text-[#07C2E3] font-mono">SYS_ALERT</span>
                </div>
                <textarea
                  rows={2}
                  value={systemNotice}
                  onChange={(e) => setSystemNotice(e.target.value)}
                  placeholder="请输入公告内容..."
                  className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-[#07C2E3]"
                />
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400">通告即刻广播部署至所有租户店铺后台顶部。</span>
                  <button
                    onClick={handleNoticeBroadcast}
                    disabled={isNoticeBroadcasting}
                    className="bg-[#07C2E3] hover:bg-[#06B2D0] disabled:opacity-50 text-slate-950 font-extrabold text-[11px] px-4 py-2 rounded-lg cursor-pointer transition-all"
                  >
                    {isNoticeBroadcasting ? '下发中...' : '发布通告'}
                  </button>
                </div>
              </div>

            </div>

            {/* Controller Right Body: Database & Upgrades */}
            <div className="bg-slate-900 text-white rounded-xl p-5 shadow-lg space-y-5 flex flex-col justify-between">
              
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 border-b border-slate-800 pb-3">
                  <Terminal className="w-4 h-4 text-[#07C2E3]" />
                  <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-widest">底层运行模块重组</h3>
                </div>
                
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[9px] text-[#07C2E3] min-h-24 max-h-32 overflow-y-auto space-y-1">
                  <div>[SYS_INIT] Loader ready.</div>
                  <div>[SYS_INIT] Database cluster match: OK</div>
                  {upgradeLogs.map((log, idx) => (
                    <div key={idx} className="text-emerald-400">{log}</div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleSystemUpgrade}
                  disabled={isUpgrading}
                  className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] disabled:opacity-50 text-slate-950 font-black text-xs py-3 rounded-xl cursor-pointer transition-all border border-[#07C2E3]/20 shadow"
                >
                  {isUpgrading ? '重组中...' : '重载物理模块'}
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MENU 2: 👥 租户管理中心 */}
      {/* ========================================================= */}
      {activeSubTab === 'tenants' && (
        <div className="space-y-6 text-left">
          
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">租户店铺列表</h3>
              <span className="text-[10px] font-mono text-slate-400">Total: {tenants.length} Tenants</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                    <th className="p-4">租户 ID</th>
                    <th className="p-4">企业主体名称</th>
                    <th className="p-4">行业类型</th>
                    <th className="p-4">创建时间</th>
                    <th className="p-4">额度使用 (消耗 / 预算)</th>
                    <th className="p-4">运行状态</th>
                    <th className="p-4 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {tenants.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#07C2E3]">{t.id.toUpperCase()}</td>
                      <td className="p-4 font-bold text-slate-800">{t.companyName}</td>
                      <td className="p-4 font-semibold uppercase">{t.industry}</td>
                      <td className="p-4">{t.createdAt}</td>
                      <td className="p-4 font-mono font-semibold">
                        <span className="text-emerald-700 font-bold">${t.aiSpent.toFixed(2)}</span>
                        <span className="text-slate-300 mx-1">/</span>
                        <span className="text-slate-400">${t.aiBudget}</span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                           t.status === 'active' 
                             ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                             : 'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                          {t.status === 'active' ? '独立运行中' : '服务已挂起'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          
                          <div className="flex items-center gap-1">
                            <input 
                              type="number" 
                              placeholder="配额($)"
                              value={tokenAdjustments[t.id] ?? ''} 
                              onChange={e => setTokenAdjustments({ ...tokenAdjustments, [t.id]: Number(e.target.value) })}
                              className="w-20 bg-white border border-slate-200 text-slate-800 text-[11px] px-2 py-1 rounded font-mono focus:ring-1 focus:ring-[#07C2E3] focus:outline-none"
                            />
                            <button 
                              onClick={() => {
                                const adj = tokenAdjustments[t.id];
                                if (adj !== undefined && adj > 0) {
                                  onUpdateTenantAiBudget(t.id, adj);
                                  setTokenAdjustments({ ...tokenAdjustments, [t.id]: 0 });
                                  onAddSystemLog('商户管理', '分配额度', `手动调配商户 ${t.companyName} 月上限预算为 $${adj}`, 'success');
                                  alert(`商户 [${t.companyName}] 自动预算调整为 $${adj}`);
                                }
                              }}
                              className="bg-[#07C2E3] hover:bg-[#06B2D0] text-[#0f172a] font-bold px-2 py-1.5 rounded text-[10px] cursor-pointer transition-all"
                            >
                              调配
                            </button>
                          </div>

                          <button 
                            onClick={() => {
                              const targetStatus = t.status === 'active' ? 'suspended' : 'active';
                              onUpdateTenantStatus(t.id, targetStatus);
                              onAddSystemLog('商户管理', targetStatus === 'active' ? '解冻商户' : '挂起商户', `调整商家 「${t.companyName}」状态为 ${targetStatus === 'active' ? '活跃' : '挂起'}`, targetStatus === 'active' ? 'success' : 'error');
                            }}
                            className={`px-2.5 py-1.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                              t.status === 'active'
                                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {t.status === 'active' ? '挂起服务' : '放行启用'}
                          </button>

                          <button 
                            onClick={() => {
                              setSelectedTenantData(t);
                            }}
                            className="bg-slate-50 hover:bg-slate-100 text-slate-750 font-bold border border-slate-200 px-2.5 py-1.5 rounded text-[10px] cursor-pointer transition-all"
                          >
                            配置
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tenant Sandbox Detail Modal */}
          {selectedTenantData && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 relative">
              <button 
                onClick={() => setSelectedTenantData(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-extrabold text-sm"
              >
                ✕
              </button>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <span>商家配置 [租户: {selectedTenantData.id.toUpperCase()}]</span>
                <span className="bg-[#07C2E3]/10 text-[#07C2E3] px-2 py-0.5 rounded font-mono text-[9px] font-black">ACTIVE</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-white border p-3 rounded-lg">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">对公账户</span>
                  <span className="font-mono font-bold text-slate-800 break-all block mt-1">CH93 0000 8392 1082 8137 9</span>
                </div>
                <div className="bg-white border p-3 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">安全密钥 Token</span>
                    <span className="font-mono text-[10px] text-emerald-700 block mt-1">ACTIVE_TRUST_TOKEN</span>
                  </div>
                  <button 
                    onClick={() => {
                      onAddSystemLog('商户管理', '重置管理员密钥', `重置租户 ${selectedTenantData.companyName} 后台密钥`, 'warning');
                      alert(`已重新生成，安全密钥已更新。`);
                    }}
                    className="bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-950 px-3 py-1.5 rounded font-bold text-[10px] cursor-pointer"
                  >
                    重置
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* MENU 3: 🔍 数据查询中心 */}
      {/* ========================================================= */}
      {activeSubTab === 'query' && (
        <div className="space-y-6 text-left">
          
          <div className="bg-slate-900 border border-slate-800 text-white p-5 rounded-xl space-y-4 shadow-md">
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-3">
              <Search className="w-5 h-5 text-[#07C2E3]" />
              <div>
                <h3 className="text-sm font-extrabold tracking-wider text-slate-100">全网数据查询器</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">管理员直接查询平台级单据与主体状态。</p>
              </div>
            </div>

            {/* Selector Options */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
              <div className="flex items-center gap-3">
                <span className="text-slate-400">选择数据表:</span>
                <div className="flex gap-1.5">
                  {(['orders', 'products', 'customers', 'tenants'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => {
                        setSelectedTable(tab);
                        setQueryInput(`SELECT * FROM ${tab} LIMIT 20;`);
                        setQueryError(null);
                      }}
                      className={`px-3 py-1.5 rounded font-bold uppercase transition-all text-[11px] cursor-pointer ${selectedTable === tab ? 'bg-[#07C2E3] text-slate-950 border border-[#07C2E3]' : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-800'}`}
                    >
                      {tab === 'orders' ? '📋 订单' : tab === 'products' ? '🛍️ 商品' : tab === 'customers' ? '👥 客户' : '🏢 租户'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Template clicks */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase">预置对账模版:</span>
                <button
                  onClick={() => {
                    setSelectedTable('orders');
                    setSearchQuery('payment_failed');
                    setQueryInput(`SELECT * FROM orders WHERE payment_status = 'failed';`);
                    onAddSystemLog('查询中心', '对账检索', '一键抓取异常支付账单', 'info');
                  }}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-2 py-1 rounded text-[10px] cursor-pointer"
                >
                  ⚠️ 异常订单
                </button>
                <button
                  onClick={() => {
                    setSelectedTable('products');
                    setSearchQuery('');
                    setQueryInput(`SELECT * FROM products ORDER BY price DESC;`);
                    onAddSystemLog('查询中心', '数据检索', '检索产品物料价目库', 'info');
                  }}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-2 py-1 rounded text-[10px] cursor-pointer"
                >
                  🔥 高单价商品
                </button>
                <button
                  onClick={() => {
                    setSelectedTable('tenants');
                    setSearchQuery('suspended');
                    setQueryInput(`SELECT * FROM tenants WHERE status = 'suspended';`);
                    onAddSystemLog('查询中心', '网格审计', '检索暂时挂起的商户', 'warning');
                  }}
                  className="bg-slate-800 hover:bg-slate-705 border border-slate-700 text-slate-300 px-2 py-1 rounded text-[10px] cursor-pointer"
                >
                  🚨 挂起商户
                </button>
              </div>
            </div>

            {/* Search inputs */}
            <div className="flex gap-2 text-xs">
              <input
                type="text"
                placeholder="键入关键字，如 姓名, 租户, 交易ID, SKU 进行秒级物料行匹配..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 text-slate-100 rounded-lg p-3 font-mono focus:outline-none focus:ring-1 focus:ring-[#07C2E3] placeholder-slate-600"
              />
              <button
                onClick={() => {
                  onAddSystemLog('查询中心', '数据检索', `检索 ${selectedTable} 匹配 ${searchQuery}`, 'info');
                  alert(`读取成功！已抓取到 ${processedQueryResult.length} 行匹配数据记录。`);
                }}
                className="bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-950 px-5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
              >
                直接搜索
              </button>
            </div>
          </div>

          {/* Results grid */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-850 font-extrabold uppercase">📊 读取记录数：{processedQueryResult.length} 行</span>
              <span className="font-mono text-slate-400">READ_MODE: BYPASS_ROUTER</span>
            </div>

            <div className="overflow-x-auto">
              {processedQueryResult.length === 0 ? (
                <div className="p-10 text-center text-slate-400 space-y-2 text-xs">
                  <p>未在当前选择的数据表中检索到符合条件的对账单记录。</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs font-medium text-slate-700">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-250 font-bold text-slate-505">
                      {selectedTable === 'orders' && (
                        <>
                          <th className="p-4">订单号 (ID)</th>
                          <th className="p-4">所属租户</th>
                          <th className="p-4">买家客户</th>
                          <th className="p-4">结算货款</th>
                          <th className="p-4">支付方式</th>
                          <th className="p-4">支付状态</th>
                          <th className="p-4">下单日期</th>
                        </>
                      )}
                      {selectedTable === 'products' && (
                        <>
                          <th className="p-4">物品 ID</th>
                          <th className="p-4">所属租户</th>
                          <th className="p-4">商品名称</th>
                          <th className="p-4">系统成本</th>
                          <th className="p-4">公允销售价</th>
                          <th className="p-4">库存余量</th>
                          <th className="p-4">状态</th>
                        </>
                      )}
                      {selectedTable === 'customers' && (
                        <>
                          <th className="p-4">客户 ID</th>
                          <th className="p-4">所属租户</th>
                          <th className="p-4">姓名</th>
                          <th className="p-4">绑定邮箱</th>
                          <th className="p-4">国家</th>
                          <th className="p-4">累计消费</th>
                          <th className="p-4">层级</th>
                        </>
                      )}
                      {selectedTable === 'tenants' && (
                        <>
                          <th className="p-4">租户 ID</th>
                          <th className="p-4">签约主体企业</th>
                          <th className="p-4">挂载行业</th>
                          <th className="p-4">状态</th>
                          <th className="p-4">创建日期</th>
                          <th className="p-4">已结提存额</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {processedQueryResult.map((row: any, idx: number) => (
                      <tr key={row.id || idx} className="hover:bg-slate-50/50 transition-colors">
                        
                        {/* Selected Orders schema */}
                        {selectedTable === 'orders' && (
                          <>
                            <td className="p-4 font-bold text-[#07C2E3]">{row.id || 'ord_n/a'}</td>
                            <td className="p-4 font-bold text-slate-800 uppercase font-sans text-[11px]">{row.industry || 'global'}</td>
                            <td className="p-4 font-sans">{row.customerName || row.customerId || '匿名买家'}</td>
                            <td className="p-4 font-bold text-slate-900">€{row.total ?? 0.0}</td>
                            <td className="p-4 uppercase text-[10px] font-sans font-extrabold">{row.paymentMethod || 'Stripe_Card'}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-sans ${row.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : row.paymentStatus === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                {row.paymentStatus || 'unknown'}
                              </span>
                            </td>
                            <td className="p-4 text-slate-500 text-[10px]">{row.createdAt || '2026-06-08'}</td>
                          </>
                        )}

                        {/* Selected Products schema */}
                        {selectedTable === 'products' && (
                          <>
                            <td className="p-4 font-bold text-[#07C2E3]">{row.id || 'sku_n/a'}</td>
                            <td className="p-4 font-bold text-slate-800 uppercase font-sans text-[11px]">{row.industry || 'global'}</td>
                            <td className="p-4 font-sans font-bold text-slate-900">{row.name || '商品档案'}</td>
                            <td className="p-4 text-slate-500">€{(row.costPrice || (row.price ? row.price * 0.6 : 10)).toFixed(2)}</td>
                            <td className="p-4 text-[#07C2E3] font-bold">€{(row.price || 0.0).toFixed(2)}</td>
                            <td className="p-4 font-bold text-slate-900">{row.stock ?? 0} 件</td>
                            <td className="p-4 font-sans text-slate-500 text-[10px]">
                              {(row.stock ?? 0) <= 10 ? '🔴 跌至补货线' : '🟢 配备充足'}
                            </td>
                          </>
                        )}

                        {/* Selected Customers schema */}
                        {selectedTable === 'customers' && (
                          <>
                            <td className="p-4 font-bold text-[#07C2E3]">{row.id || 'cust_n/a'}</td>
                            <td className="p-4 font-bold text-slate-800 uppercase font-sans text-[11px]">{row.industry || 'global'}</td>
                            <td className="p-4 font-sans font-bold text-slate-900">{row.name || '客商档案'}</td>
                            <td className="p-4 text-slate-500 break-all">{row.email || 'n/a'}</td>
                            <td className="p-4 font-sans">{row.country || 'EU / EUR'}</td>
                            <td className="p-4 text-slate-900 font-bold">€{(row.totalSpent || 0).toFixed(2)}</td>
                            <td className="p-4 font-bold text-emerald-700">VIP_Active</td>
                          </>
                        )}

                        {/* Selected Tenants schema */}
                        {selectedTable === 'tenants' && (
                          <>
                            <td className="p-4 font-bold text-[#07C2E3] uppercase">{row.id}</td>
                            <td className="p-4 font-sans font-bold text-slate-900">{row.companyName}</td>
                            <td className="p-4 uppercase text-slate-600 font-sans text-[10px] font-extrabold">{row.industry}</td>
                            <td className="p-4 font-sans">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.status === 'active' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'bg-rose-50 text-rose-700 font-bold'}`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="p-4 text-slate-500 text-[10px]">{row.createdAt}</td>
                            <td className="p-4 text-slate-900 font-bold">€{(row.aiSpent * 10).toFixed(2)}</td>
                          </>
                        )}

                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MENU 4: 💳 支付中心 */}
      {/* ========================================================= */}
      {activeSubTab === 'gateways' && (
        <div className="space-y-6 text-left">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentGateways.map(g => (
              <div key={g.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#07C2E3]" />
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider">{g.name}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${g.status ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                    {g.status ? '● 收单正常' : '○ 通道暂停'}
                  </span>
                </div>

                <div className="space-y-3.5 text-xs font-semibold text-slate-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">物理通信安全 API 秘钥 Key</label>
                      <div className="relative">
                        <input
                          type="password"
                          value={g.apiKey}
                          readOnly
                          className="w-full bg-slate-50 border border-slate-200 text-slate-500 font-mono rounded px-2 text-[11px] py-1.5 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">WebHook 配送应答域目录</label>
                      <input
                        type="text"
                        value={g.webhook}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPaymentGateways(prev => prev.map(item => item.id === g.id ? { ...item, webhook: val } : item));
                        }}
                        className="w-full bg-white border border-slate-200 text-slate-800 font-mono rounded text-[11px] py-1.5 focus:outline-none focus:ring-1 focus:ring-[#07C2E3]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-50 pt-2 font-mono">
                    <span>最近一期财务对账划拨时间:</span>
                    <span className="font-bold text-slate-800">{g.syncTime}</span>
                  </div>

                  {g.errorLogs.length > 0 && (
                    <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 rounded-lg text-[10px] space-y-1">
                      <span className="font-bold uppercase tracking-wider block text-rose-950">Gateway System Diagnostics (通道诊断异常):</span>
                      {g.errorLogs.map((err, idx) => (
                        <span key={idx} className="block font-mono font-medium">✕ {err}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleTestConnection(g.id, g.name)}
                        className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-extrabold text-[11px] px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                      >
                        ⚡ 连通测试
                      </button>
                      <button
                        onClick={() => handleSyncNow(g.id, g.name)}
                        disabled={isSyncingGateway === g.id}
                        className="bg-[#07C2E3]/10 hover:bg-[#07C2E3]/25 text-[#07C2E3] font-bold text-[11px] px-3 py-1.5 rounded-lg border border-[#07C2E3]/20 tracking-wider cursor-pointer"
                      >
                        {isSyncingGateway === g.id ? '正在对账同步...' : '🔄 即刻对账'}
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        const nextState = !g.status;
                        setPaymentGateways(prev => prev.map(item => item.id === g.id ? { ...item, status: nextState } : item));
                        onAddSystemLog('支付中心', nextState ? '开启收单网关' : '吊销收单网关', `变更支付网关渠道 ${g.name} 的运行状态为 ${nextState ? '启用' : '废弃中断'}`, nextState ? 'success' : 'error');
                      }}
                      className={`text-[11px] font-extrabold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${g.status ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'}`}
                    >
                      {g.status ? '🚨 吊销通道' : '🔓 激活通道'}
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MENU 5: 🧠 AI大脑中心 */}
      {/* ========================================================= */}
      {activeSubTab === 'ai-ops' && (
        <div className="space-y-6 text-left">
          
          {/* AI Central Inner Tabs Selector */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 mb-4">
            {[
              { id: 'dashboard', name: '总裁驾驶舱', icon: LayoutDashboard },
              { id: 'execution_center', name: '执行控制', icon: Play },
              { id: 'discovery', name: '诊断发现', icon: Search },
              { id: 'monitoring', name: '调度监控', icon: BarChart3 },
              { id: 'optimizer', name: '效能优化', icon: Sliders },
              { id: 'strategic', name: '宏观决策', icon: Brain },
              { id: 'cognitive', name: '安全治理', icon: Shield },
              { id: 'nervous', name: '数据突触', icon: Network },
              { id: 'memory', name: '规则宪章', icon: Database },
              { id: 'boardroom', name: '议事中心', icon: Scale },
              { id: 'system_map', name: '系统地图', icon: Layers }
            ].map(sub => {
              const SubIcon = sub.icon;
              const isSubActive = aiCentralTab === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setAiCentralTab(sub.id as any)}
                  className={`px-3.5 py-2 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSubActive 
                      ? 'bg-[#07C2E3] text-zinc-950 border-[#07C2E3]' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <SubIcon className="w-3.5 h-3.5" />
                  <span>{sub.name}</span>
                </button>
              );
            })}
          </div>

          {aiCentralTab === 'dashboard' && (
            <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 animate-fadeIn text-left text-slate-900 shadow-sm">
              <EcosCEODashboard setAiCentralTab={setAiCentralTab} onAddSystemLog={onAddSystemLog} />
            </div>
          )}

          {aiCentralTab === 'execution_center' && (
            <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 animate-fadeIn text-left text-slate-900 shadow-sm animate-fadeIn">
              <AIExecutionControlCenter onAddSystemLog={onAddSystemLog} />
            </div>
          )}

          {aiCentralTab === 'discovery' && (
            <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 animate-fadeIn text-left text-slate-900 shadow-sm">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-slate-900 font-extrabold text-[13px] uppercase tracking-wider">诊断发现中枢</h3>
                  <p className="text-xs text-slate-500 mt-1">自动诊断并显示高价值平台事件与链路推荐。</p>
                </div>
              </div>
              <AIDiscoveryCenter onAddSystemLog={onAddSystemLog} />
            </div>
          )}

          {aiCentralTab === 'monitoring' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* KPI卡片面盘 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between text-left">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">智脑状态</span>
                  <p className="text-lg font-black text-[#07C2E3] mt-1 font-mono">🟢 正常运行</p>
                  <span className="text-[10px] text-slate-500 font-mono mt-1">集群连接：100%</span>
                </div>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between text-left">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">调度频次</span>
                  <p className="text-lg font-black text-white mt-1 font-mono">854 次</p>
                  <span className="text-[10px] text-slate-500 font-mono mt-1">今日自动调度总数</span>
                </div>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-850 shadow-sm flex flex-col justify-between text-left">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">隔离租户</span>
                  <p className="text-lg font-black text-white mt-1 font-mono">{tenants.filter(t => t.status==='active').length} 活跃 / 共 {tenants.length} 家</p>
                  <span className="text-[10px] text-slate-500 font-mono mt-1">沙箱物理隔开锁死</span>
                </div>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between text-left">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">异常防御</span>
                  <p className="text-lg font-black text-rose-500 mt-1 font-mono">{lockedRisk ? '拦截运行中' : '拦截预备中'}</p>
                  <span className="text-[10px] text-slate-500 font-mono mt-1">防止租户越权穿透</span>
                </div>
              </div>

              {/* 🎯 平台级统控与对账战略大脑 */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5 text-left mb-6 font-semibold">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2 text-left">
                      <span>决策中枢</span>
                      <span className="text-[9.5px] bg-[#07C2E3]/10 text-[#07C2E3] border border-[#07C2E3]/20 px-1.5 py-0.5 rounded font-mono font-black uppercase">智能大脑</span>
                    </h3>
                  </div>
                  
                  {/* Action subtabs */}
                  <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setAiOpTab('revenue')}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded transition-all cursor-pointer uppercase ${aiOpTab === 'revenue' ? 'bg-white text-slate-950 shadow' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      财务对账
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiOpTab('fraud')}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded transition-all cursor-pointer uppercase ${aiOpTab === 'fraud' ? 'bg-white text-slate-950 shadow' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      风控审计
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiOpTab('campaign')}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded transition-all cursor-pointer uppercase ${aiOpTab === 'campaign' ? 'bg-white text-slate-950 shadow' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      大促调度
                    </button>
                  </div>
                </div>

                {/* Operations workspace */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[220px] flex flex-col justify-between text-left">
                  
                  {aiOpTab === 'revenue' && (
                    <div className="space-y-4 text-xs font-sans">
                      <div className="flex justify-between items-center text-left">
                        <span className="font-bold text-slate-800 text-xs">经营对账数据</span>
                        <span className="font-mono text-[10px] text-slate-400">状态：已验证</span>
                      </div>

                      <div className="overflow-x-auto text-left">
                        <table className="w-full text-left border-collapse bg-white border border-slate-200 rounded-lg overflow-hidden text-[11px]">
                          <thead>
                            <tr className="bg-slate-100 border-b border-slate-200 text-slate-500 font-bold font-sans">
                              <th className="p-2.5">行业分类</th>
                              <th className="p-2.5">对账流水</th>
                              <th className="p-2.5">平均毛利</th>
                              <th className="p-2.5">结算状态</th>
                              <th className="p-2.5">物理隔离</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-semibold font-mono text-slate-700">
                            <tr>
                              <td className="p-2.5 font-sans">服饰零售</td>
                              <td className="p-2.5">€ 58,290.00</td>
                              <td className="p-2.5 text-emerald-600">72.1%</td>
                              <td className="p-2.5 text-slate-500">正常结算循环</td>
                              <td className="p-2.5 text-emerald-600">🟢 隔离安全</td>
                            </tr>
                            <tr>
                              <td className="p-2.5 font-sans">食品配餐</td>
                              <td className="p-2.5">€ 12,410.00</td>
                              <td className="p-2.5 text-emerald-600">64.8%</td>
                              <td className="p-2.5 text-slate-500">正常结算循环</td>
                              <td className="p-2.5 text-emerald-600">🟢 隔离安全</td>
                            </tr>
                            <tr>
                              <td className="p-2.5 font-sans">基础通用</td>
                              <td className="p-2.5">€ 109,500.00</td>
                              <td className="p-2.5 text-emerald-600">55.0%</td>
                              <td className="p-2.5 text-slate-500">正常结算循环</td>
                              <td className="p-2.5 text-emerald-600">🟢 隔离安全</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                        <span className="text-[11px] text-slate-500">对账评估：租户资金完全隔离，安全隔离通过。</span>
                        <div className="flex items-center gap-2">
                          {dispatchedSettlement && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-1 rounded">
                              ✔️ 已打款结算
                            </span>
                          )}
                          <button
                            onClick={() => {
                              setDispatchedSettlement(true);
                              onAddSystemLog('AI决策中心', '平台全网结算', '由智脑汇总分析并自动调拨打款各物理租户账款', 'success');
                              alert('对账完成！已成功确认对账结算，完成资金清算。');
                            }}
                            className="bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] text-slate-950 font-black text-xs px-4 py-2 rounded-lg cursor-pointer transition-all"
                          >
                            一键清算
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {aiOpTab === 'fraud' && (
                    <div className="space-y-4 text-xs font-sans text-left">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800 text-xs">支付风控审计</span>
                        <span className="font-mono text-[10px] text-[#07C2E3]">防护等级：高级</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1">
                          <span className="text-[11px] text-slate-400 font-bold block">网关安全防护</span>
                          <span className="text-emerald-600 font-extrabold font-mono block">100% 正常</span>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1">
                          <span className="text-[11px] text-slate-400 font-bold block">多币种拦截</span>
                          <span className="text-emerald-600 font-extrabold font-mono block">实时监控中</span>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1">
                          <span className="text-[11px] text-slate-400 font-bold block">异常大额争议</span>
                          <span className="text-slate-800 font-extrabold font-mono block">{lockedRisk ? '0 笔' : '1 笔 (待处理)'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                        <span className="text-[11px] text-slate-500">安全声明：物理防穿透机制部署完毕。</span>
                        <button
                          onClick={() => {
                            setLockedRisk(!lockedRisk);
                            onAddSystemLog('AI决策中心', lockedRisk ? '解除风控锁' : '开启风控拦截', '一键置下安全防欺诈大额交易红线机制', lockedRisk ? 'warning' : 'success');
                            alert(lockedRisk ? '风控解除。' : '风控锁全面部署！');
                          }}
                          className={`font-black text-xs px-4 py-2 rounded-lg cursor-pointer transition-all ${lockedRisk ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-slate-900 hover:bg-slate-850 text-[#07C2E3]'}`}
                        >
                          {lockedRisk ? '解除风控锁' : '开启风控锁'}
                        </button>
                      </div>
                    </div>
                  )}

                  {aiOpTab === 'campaign' && (
                    <div className="space-y-4 text-xs font-sans text-left">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800 text-xs">联促部署</span>
                        <span className="font-mono text-[10px] text-[#07C2E3]">网关广播就绪</span>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between font-mono py-1 border-b">
                          <span className="text-slate-400 text-[11px]">大促代号</span>
                          <span className="font-bold text-slate-800 text-[11px]">CAMP_GLOBAL_2026</span>
                        </div>
                        <div className="flex justify-between font-mono py-1 border-b">
                          <span className="text-slate-400 text-[11px]">推荐受众</span>
                          <span className="font-bold text-slate-800 text-[11px]">欧洲服饰、食品健康</span>
                        </div>
                        <div className="flex justify-between font-mono py-1">
                          <span className="text-slate-400 text-[11px]">大促折率</span>
                          <span className="font-bold text-[#07C2E3] text-[11px]">七折优惠 + 跨国免费配</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                        <span className="text-[11px] text-slate-500">大促说明：联合大促仅提供对商家的营销配置。</span>
                        <div className="flex items-center gap-2">
                          {dispatchedCampaign && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-1 rounded">
                              ✔️ 已广播
                            </span>
                          )}
                          <button
                            onClick={() => {
                              setDispatchedCampaign(true);
                              onAddSystemLog('AI决策中心', '联合营销发布', '一键广播大促通用接口', 'success');
                              alert('大促广播配置已下发！');
                            }}
                            className="bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] text-slate-950 font-black text-xs px-4 py-2 rounded-lg cursor-pointer transition-all"
                          >
                            一键发布
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              <div className="space-y-4 text-left">
                <span className="text-xs text-slate-500 font-bold tracking-wider uppercase block">
                  命令中心
                </span>

                {/* 对话消息容器 */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-h-[350px] overflow-y-auto space-y-4 shadow-inner">
                  {globalAIChatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <span className="text-[10px] font-bold text-slate-400">
                        {msg.role === 'user' ? '管理员' : '智脑核心'}
                      </span>
                      <div className={`p-3.5 rounded-xl text-xs max-w-[85%] leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-slate-900 border border-slate-800 text-white font-mono' 
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                       }`}>
                        <div className="whitespace-pre-line prose prose-slate max-w-none prose-xs font-semibold">
                          {msg.content}
                        </div>
                        {msg.actions && msg.actions.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2 pt-3 border-t border-slate-100">
                            {msg.actions.map((act: any, aIdx: number) => (
                              <button
                                key={aIdx}
                                onClick={() => {
                                  if (act.action === 'view_tenants') {
                                    onChangeSubTab?.('tenants');
                                  } else if (act.action === 'view_gateways') {
                                    onChangeSubTab?.('gateways');
                                  } else if (act.action === 'lock_risk') {
                                    setLockedRisk(true);
                                    onAddSystemLog('风控审计', '全局安全防护', '由决策智脑一键提升并锁死异常交易退款监控阈值', 'success');
                                    alert('网关隔离开启！');
                                  } else if (act.action === 'view_query_products') {
                                    setSelectedTable('products');
                                    onChangeSubTab?.('query');
                                  } else if (act.action === 'alert_restock') {
                                    onAddSystemLog('供应链协调', '库存跨区分拨', '决策中枢一键调度自动向隔离保税商铺调配物资', 'info');
                                    alert('库存补充已完成！');
                                  } else if (act.action === 'deploy_campaign') {
                                    setDispatchedCampaign(true);
                                    onAddSystemLog('营销指挥', '联合API广播', '全局广播 CAM_GLOBAL_SUMMER_2026 大促活动底座', 'success');
                                    alert('活动发布完毕！');
                                  } else if (act.action === 'alert_marketing') {
                                    alert('大促配置已下发。');
                                  } else if (act.action === 'view_ai_revenue') {
                                    setAiOpTab('revenue');
                                  } else if (act.action === 'view_ai_fraud') {
                                    setAiOpTab('fraud');
                                  }
                                }}
                                className="bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] text-slate-950 font-extrabold text-[11px] px-2.5 py-1.5 rounded transition-all flex items-center gap-1 shadow-sm uppercase cursor-pointer"
                              >
                                ⚡ {act.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isGlobalAIThinking && (
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-[10px] font-bold text-slate-400">智脑核心</span>
                      <div className="bg-white border border-slate-200 text-slate-500 rounded-xl rounded-tl-none p-3 text-xs flex items-center gap-2">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#07C2E3] animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#07C2E3] animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#07C2E3] animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="font-mono">智脑中枢正在审计中...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 快捷推荐指令卡 */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] text-zinc-500 font-bold block">快捷决策指令：</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setGlobalAIChatInput('过去7天全平台表现怎么样？')}
                      className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 border border-slate-200 text-slate-605 text-xs cursor-pointer font-bold transition-all"
                    >
                      📈 经营大盘
                    </button>

                    <button
                      type="button"
                      onClick={() => setGlobalAIChatInput('哪些商铺的异常争议退款风险最高？')}
                      className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 border border-slate-200 text-slate-605 text-xs cursor-pointer font-bold transition-all"
                    >
                      🚨 风控拦截
                    </button>

                    <button
                      type="button"
                      onClick={() => setGlobalAIChatInput('全网多租户高压力 SKU 库存分析')}
                      className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 border border-slate-200 text-slate-605 text-xs cursor-pointer font-bold transition-all"
                    >
                      🍕 补货物资
                    </button>
                  </div>
                </div>

                {/* 命令行表单 */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!globalAIChatInput.trim() || isGlobalAIThinking) return;
                    const userT = globalAIChatInput.trim();
                    setGlobalAIChatInput('');
                    setGlobalAIChatMessages(prev => [...prev, { role: 'user', content: userT }]);
                    setIsGlobalAIThinking(true);

                    setTimeout(() => {
                      setIsGlobalAIThinking(false);
                      const lowerInput = userT.toLowerCase();
                      let aiReply = '';
                      let actions: any[] = [];
                      
                      const isGreeting = /^(你好|hi|在吗|在|测试|测试一下|ok|hello|test)$/i.test(
                        lowerInput.replace(/[\s\p{P}]/gu, '')
                      );

                      if (isGreeting) {
                        aiReply = '已处于指令调度状态。您可以询问跨隔离沙箱安全、退款纠纷漏洞、或者全网夏季联合大促情况。';
                      } else if (lowerInput.includes('7天') || lowerInput.includes('表现') || lowerInput.includes('gmv') || lowerInput.includes('业绩')) {
                        aiReply = `全网过去 7 天经营表现优异：\n- 🟢 全平台 GMV 总计: € 180,200.00（环比上升 12.4%）。\n- 💳 支付核算：各账户完成隔离财务验证。\n- 👥 新增账户：新增 3 家活跃隔离商户。`;
                        actions = [
                          { label: '租户清算', action: 'view_tenants' },
                          { label: '支付对账', action: 'view_gateways' }
                        ];
                      } else if (lowerInput.includes('退款') || lowerInput.includes('争议') || lowerInput.includes('风险') || lowerInput.includes('纠纷') || lowerInput.includes('风控') || lowerInput.includes('拦截')) {
                        aiReply = `全网纠纷拦截率处于 0.15% 的安全区，隔离中枢已执行物理校验：\n- 🚨 注意：法国巴黎服饰店存在一笔大额争议有待处理。\n- 🛡️ 安全隔离机制运行正常。`;
                        actions = [
                          { label: '开启防护', action: 'lock_risk' },
                          { label: '活跃商户', action: 'view_tenants' }
                        ];
                      } else if (lowerInput.includes('sku') || lowerInput.includes('库存') || lowerInput.includes('配额') || lowerInput.includes('断货') || lowerInput.includes('补')) {
                        aiReply = `全平台大部分商铺供货稳定。但在食品配餐隔离区：\n- 🍕 极少部分食品辅料当前库存已跌破警戒线。\n- 📦 已配置自动向相关保税商铺补充配额。`;
                        actions = [
                          { label: '查看库存', action: 'view_query_products' },
                          { label: '一键调配', action: 'alert_restock' }
                        ];
                      } else if (lowerInput.includes('战役') || lowerInput.includes('大促') || lowerInput.includes('营销')) {
                        aiReply = `大促联合代号 CAMP_GLOBAL_2026：\n- 📣 活动广播完毕，目前有 6 个网关已准备就绪。\n- ⏳ 预计夏季大促将推动多店成交量上升 35% 以上。`;
                        actions = [
                          { label: '部署API', action: 'deploy_campaign' },
                          { label: '一键广播', action: 'alert_marketing' }
                        ];
                      } else {
                        aiReply = `已对指令进行跨沙箱多维审计。当前平台租户情况：\n- 利润与资金完全隔离正常，大局流动正常。\n- Stripe 验证及 Adyen 分账一切安全。您可以随时在下方选择指令一键执行。`;
                        actions = [
                          { label: '财务对账', action: 'view_ai_revenue' },
                          { label: '风控拦截', action: 'view_ai_fraud' }
                        ];
                      }

                      setGlobalAIChatMessages(prev => [...prev, {
                        role: 'assistant',
                        content: aiReply,
                        actions: actions
                      }]);
                    }, 700);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="作为系统管理员，输入对跨租户利润、纠纷监控或者全局大促的命令..."
                    value={globalAIChatInput}
                    onChange={(e) => setGlobalAIChatInput(e.target.value)}
                    className="flex-1 bg-white border border-[#07C2E3] rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-[#07C2E3] focus:outline-none focus:ring-1 focus:ring-[#07C2E3]"
                  />
                  <button
                    type="submit"
                    disabled={!globalAIChatInput.trim() || isGlobalAIThinking}
                    className="bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] text-[#0b1329] font-black text-xs px-4 py-2 rounded-lg disabled:opacity-40 cursor-pointer shadow transition-all"
                  >
                    发送
                  </button>
                </form>
              </div>
            </div>
          )}


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            
            {/* AI Agents state column */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-[#07C2E3]" />
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">底座内嵌多智能体大脑引擎 (Core AI Agents Status)</h3>
                </div>
                <span className="font-mono text-[10px] text-slate-400">Total: {agentsList.length} AI Employees</span>
              </div>

              {/* Table listing */}
              <div className="overflow-x-auto text-xs font-semibold">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b text-slate-405">
                      <th className="p-3">系统标号 ID / Agent 角色</th>
                      <th className="p-3">底层模型版本</th>
                      <th className="p-3">累计调用频段（本周期）</th>
                      <th className="p-3">单次指令平均推理耗时</th>
                      <th className="p-3">安全诊断状态</th>
                      <th className="p-3 text-center">指令调配与生命期控制</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                    {agentsList.map(a => (
                      <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3">
                          <span className="font-bold text-slate-900 block">{a.name}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Role ID: system_{a.id}</span>
                        </td>
                        <td className="p-3 font-normal text-slate-500">{a.version}</td>
                        <td className="p-3 font-bold text-slate-800 text-center">{a.runs} 次调阅</td>
                        <td className="p-3 text-slate-600">{a.lastTime}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-sans ${a.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-slate-100 text-slate-500 border'}`}>
                            {a.status === 'Active' ? '🟢 RAG_ONLINE' : '⚪ SYSTEM_OFFLINE'}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                onAddSystemLog('AI大脑中心', '重启模型', `重启智能大脑 ${a.name}，清理上下文缓冲区`, 'info');
                                alert(`已物理清除智能体「${a.name}」在本地 RAG 内存中的向量上下文，模型完成热插配置重启。`);
                              }}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-extrabold text-[10px] px-2 py-1 rounded transition-all cursor-pointer"
                            >
                              🔄 重启
                            </button>
                            <button
                              onClick={() => handleToggleAgent(a.id, a.name)}
                              className={`font-extrabold text-[10px] px-2 py-1 rounded border transition-all cursor-pointer ${a.status === 'Active' ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-750 border-emerald-200'}`}
                            >
                              {a.status === 'Active' ? '🚨 挂起下线' : '🔓 下派干预'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

            {/* AI Runs Table right column */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-1">
                    <Activity className="w-4 h-4 text-[#07C2E3]" />
                    <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider">实时 RAG 数据任务流 (Live AI Task Flow)</h3>
                  </div>
                  <span className="font-extrabold text-[9px] bg-[#07C2E3]/15 text-[#059BBC] rounded px-1.5 border border-[#07C2E3]/20">Active</span>
                </div>

                <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                  展示由平台各租户触发的多路分布式任务。当客户行为触发 IF-THEN 决策时，对应 Agent 会自动组装向量上下文进行 RAG 分析：
                </p>

                <div className="space-y-2.5 text-xs">
                  {realAgentTasks.map(t => (
                    <div key={t.id} className="p-3 bg-slate-50 border rounded-lg space-y-1.5 hover:bg-slate-100/50 transition-colors">
                      <div className="flex justify-between items-center font-mono">
                        <span className="font-bold text-[#059BBC]">{t.id}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${t.status === 'FINISHED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          {t.status}
                        </span>
                      </div>
                      <p className="font-sans font-bold text-slate-800 leading-snug">{t.name}</p>
                      <div className="flex justify-between items-center text-[10px] text-slate-450 pt-1 font-mono border-t border-slate-100">
                        <span>执勤时间: {t.executionTime}</span>
                        <span className="text-[#059BBC] font-bold max-w-[150px] truncate">Result: {t.result}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 text-[10px] text-slate-400 font-sans flex justify-between items-center">
                <span>智能体指令运行全部处于严格容器物理域隔离状态。</span>
                <span className="font-mono text-[#07C2E3] font-bold">SANDBOXED_OK</span>
              </div>

            </div>

          </div>

          {aiCentralTab === 'optimizer' && (
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 animate-fadeIn text-left text-slate-100">
              <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-sm">⚡ Ecos 智脑优化中枢 (Ecos Optimizer Core)</h3>
                  <p className="text-xs text-slate-400 mt-1">跨多租户的大并发算法智能调优运行期，自动调控 CPU 资源并保障租户沙箱运行极速</p>
                </div>
              </div>
              <EcosPerformanceOptimizer 
                tenantDB={tenantDB} 
                selectedIndustry={selectedIndustry} 
                setTenantDB={setTenantDB} 
                addLog={addLog || onAddSystemLog} 
              />
            </div>
          )}

          {aiCentralTab === 'strategic' && (
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 animate-fadeIn text-left text-slate-100">
              <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-sm">🧭 ECOS 战略大脑中枢 (Ecos Strategic Intelligence System)</h3>
                  <p className="text-xs text-slate-400 mt-1">分析全网宏观大盘资金状态与宏观调拨大单分配安全级别</p>
                </div>
              </div>
              <EcosStrategicIntelligence />
            </div>
          )}

          {aiCentralTab === 'cognitive' && (
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 animate-fadeIn text-left text-slate-100">
              <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-sm">🧠 ECOS 认知治理中枢 (Ecos Cognitive Governance)</h3>
                  <p className="text-xs text-slate-400 mt-1">最高主权审计层多智能体意识自我纠偏与物理沙盒安全状态核验阵列</p>
                </div>
              </div>
              <EcosCognitiveGovernance />
            </div>
          )}

          {aiCentralTab === 'nervous' && (
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 animate-fadeIn text-left text-slate-100">
              <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-sm">🔌 Ecos 多维企业神经系统 (Ecos Active Nervous Architecture)</h3>
                  <p className="text-xs text-slate-400 mt-1">物理容器消息突触，打通集群大局统筹与微观商户高可靠业务指令分发</p>
                </div>
              </div>
              <EcosEnterpriseNervousSystem />
            </div>
          )}

          {/* ========================================================= */}
          {/* 🧠 平台级 ECOS ENTERPRISE COGNITIVE BRAIN CENTER */}
          {/* ========================================================= */}
          {aiCentralTab === 'memory' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 animate-fadeIn">

              {/* Panel 1: DNA Memory Center (1/3 width) */}
              <div className="bg-slate-900 text-slate-100 p-5 rounded-xl border border-slate-800 shadow-sm space-y-5 text-left">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#07C2E3]" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">DNA Memory Center & Memory DNA</span>
                </div>
                <span className="text-[8.5px] font-mono bg-[#07C2E3]/15 text-[#07C2E3] px-1.5 py-0.5 rounded border border-[#07C2E3]/20 uppercase">
                  Constitution Core
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                此处沉淀全平台商户通行的 ECOS 经营大宪章守则，作为模型底座最高原则机制。凡在此写入的 DNA 约束，AI 决策时拥有最高一票否决权，绝对规避违反店主利益。
              </p>

              {/* Memory List */}
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                {memories.map((m) => (
                  <div key={m.id} className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg space-y-2 text-left relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-[9.5px] font-bold text-zinc-300 font-mono uppercase bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-855">
                        {m.category}
                      </span>
                      <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 rounded ${
                        m.importance === 'critical' ? 'bg-rose-950/45 text-rose-400 border border-rose-900/30' : 'bg-slate-800 text-slate-405'
                      }`}>
                        {m.importance}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-mono font-medium">{m.fact}</p>
                    <button
                      type="button"
                      onClick={() => handleDeleteMemory(m.id)}
                      className="absolute top-2.5 right-2 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-0.5 rounded hover:bg-zinc-900"
                      title="清除记忆"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Memory Form */}
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-850 space-y-3 text-left">
                <span className="text-[10px] text-slate-450 font-black tracking-wider uppercase block">新增大宪章认知断言 (Add DNA Memory)</span>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[8.5px] text-slate-500 font-bold uppercase mb-1">条例维度 Category</label>
                    <select
                      value={newMemoryCategory}
                      onChange={(e) => setNewMemoryCategory(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-300 text-[10.5px] rounded p-1 font-mono focus:outline-none"
                    >
                      <option value="Brand Alignment">Brand Alignment</option>
                      <option value="Pricing Protection">Pricing Protection</option>
                      <option value="Geographical Boundary">Geographical Boundary</option>
                      <option value="Model Alignment">Model Alignment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[8.5px] text-slate-505 font-bold uppercase mb-1">保障烈度 Priority</label>
                    <select
                      value={newMemoryImportance}
                      onChange={(e) => setNewMemoryImportance(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-300 text-[10.5px] rounded p-1 font-mono focus:outline-none"
                    >
                      <option value="critical">Critical (一票否决)</option>
                      <option value="normal">Normal (推荐采纳)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[8.5px] text-slate-500 font-bold uppercase mb-1">断言陈述 Fact text (100% 物理注入推理链路)</label>
                  <textarea
                    rows={2}
                    value={newMemoryFact}
                    onChange={(e) => setNewMemoryFact(e.target.value)}
                    placeholder="例如：禁止任何商品无理由包邮至高通胀阻尼极点区域..."
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#07C2E3] font-sans"
                  />
                </div>

                <form onSubmit={handleAddNewMemory}>
                  <button
                    type="submit"
                    disabled={!newMemoryFact.trim()}
                    className={`w-full py-1.5 rounded text-xs font-black uppercase tracking-wider transition-all ${
                      newMemoryFact.trim()
                        ? 'bg-[#07C2E3] hover:bg-[#06B2D0] hover:scale-98 text-zinc-950 cursor-pointer'
                        : 'bg-zinc-805 text-slate-505 cursor-not-allowed border border-zinc-900'
                    }`}
                  >
                    📥 灌注大宪章长期记忆 DNA
                  </button>
                </form>
              </div>
            </div>

            {/* Continuous Learning Insights Ledger (2/3 width) - Relocated to Memory & Knowledge Base Tab */}
            <div className="p-5 bg-slate-900 border border-slate-800 text-slate-100 rounded-xl space-y-4 lg:col-span-2 text-left md:h-[650px] overflow-hidden flex flex-col justify-between">
              <div className="border-b border-zinc-800 pb-2.5 space-y-0.5">
                <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#07C2E3]" />
                  <span>Continuous Learning Insights Ledger (智脑自适应学习数据库)</span>
                </h4>
                <p className="text-[10px] text-zinc-400 leading-relaxed font-semibold font-sans">记录全网各隔离租户深度元学习循环下自动提取的商铺见识与经营规则</p>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {insights.map((ins) => (
                  <div key={ins.id} className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg space-y-2 text-left shadow-md">
                    <div className="flex items-center justify-between border-b border-zinc-900/60 pb-1.5 font-mono">
                      <span className="text-[9.5px] font-bold text-[#07C2E3] uppercase tracking-wider">
                        ⚙ 学成契机 Category: {ins.insightCategory}
                      </span>
                      <span className="text-[9px] text-zinc-500 font-normal">Verified {ins.validatedAt}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-mono font-medium">{ins.factLearned}</p>
                    <div className="flex items-center justify-between text-[9px] font-mono font-bold text-zinc-400 pt-1 border-t border-zinc-900/45">
                      <span>决策增量估测: <span className="text-emerald-400">{ins.insightCategory === 'User Purchasing Path' ? '+18.25%' : ins.insightCategory === 'Margin Safeguard Rule' ? 'Margin Protected' : 'Cost Offset 9%'}</span></span>
                      <span className="text-emerald-500">🟢 Physical Confirmed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
          )}

          {aiCentralTab === 'boardroom' && (
            <React.Fragment>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 animate-fadeIn">

              {/* Panel 2: Boardroom Disputes & Decision Forum (2/3 width) */}
              <div className="bg-slate-900 text-slate-100 p-5 rounded-xl border border-slate-800 shadow-sm space-y-5 lg:col-span-2 text-left">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#07C2E3]" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">Multi-Agent Boardroom & Decision Forum</span>
                </div>
                <span className="text-[8.5px] font-mono bg-amber-500/15 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/20 uppercase">
                  Sovereign Override Unit
                </span>
              </div>

              {/* Debate Index Selector Tabs */}
              <div className="flex flex-wrap gap-2">
                {debates.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDebateId(d.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold max-w-xs truncate transition-all cursor-pointer ${
                      selectedDebateId === d.id
                        ? 'bg-zinc-950 text-[#07C2E3] border-[#07C2E3]/50 shadow-md'
                        : 'bg-zinc-955/40 text-slate-400 border-zinc-900 hover:text-slate-200'
                    }`}
                  >
                    【议题 #{d.id}】 {d.topicTitle}
                  </button>
                ))}
              </div>

              {/* Active Selected Debate Workspace */}
              {selectedDebate ? (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-900 space-y-3.5">
                    <div className="flex items-start justify-between border-b border-zinc-900 pb-2">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-[#07C2E3] tracking-widest uppercase font-black">ACTIVE BOARD DISPUTATION</span>
                        <h4 className="text-xs font-bold text-slate-200 leading-relaxed font-mono">{selectedDebate.topicTitle}</h4>
                      </div>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider border ${
                        selectedDebate.status === 'ruled'
                          ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/40'
                          : 'bg-amber-950/30 text-amber-400 border-amber-900/40 animate-pulse'
                      }`}>
                        {selectedDebate.status === 'ruled' ? 'Sovereign Ruled (已签总统仲裁令)' : 'Disputing (多方僵持商讨中)'}
                      </span>
                    </div>

                    {/* Standoff Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {selectedDebate.opinions.map((op: any, oIdx: number) => (
                        <div key={oIdx} className="p-3 bg-zinc-900 w-full rounded-lg border border-zinc-850/80 space-y-2 relative">
                          {op.isDominantAlternative && (
                            <span className="absolute top-2.5 right-2 bg-[#07C2E3]/15 text-[#07C2E3] border border-[#07C2E3]/25 font-bold font-mono text-[8.5px] px-1.5 py-0.2 rounded uppercase">
                              Dominant Alternative (占优推荐方案)
                            </span>
                          )}
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#07C2E3]"></span>
                            <span className="text-[10px] font-black text-slate-100 uppercase tracking-widest font-mono">{op.agentName}</span>
                          </div>
                          <p className="text-[11px] font-bold text-[#07C2E3] leading-relaxed font-mono">📍 核心建议: {op.recommendation}</p>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">原因层: {op.rationale}</p>
                          <div className="flex items-center justify-between text-[9.5px] font-mono font-bold text-slate-500 pt-1.5 border-t border-zinc-900/50">
                            <span>利润增益预估: <span className="text-emerald-500">{op.financialImpact}</span></span>
                            <span>因果置信分: {op.confidenceScore}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sovereign Overwrite Section */}
                  <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-850 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest flex items-center gap-1">
                        Sovereign Power Overwrite (最高主权裁判干预中心)
                      </h4>
                      <span className="text-[9px] font-mono text-zinc-500">PRESIDENTIAL VETO LAYER</span>
                    </div>

                    {selectedDebate.status === 'ruled' ? (
                      <div className="p-4 bg-emerald-950/20 border-2 border-emerald-800/40 rounded-xl space-y-3 animate-fadeIn">
                        <div className="flex items-start gap-2 text-[11px] font-bold text-emerald-400 tracking-wide font-mono">
                          <span className="bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 text-[9px] uppercase font-black select-none shrink-0">Presidential signed</span>
                          <span>最高意志判词已存证注入集群内核:</span>
                        </div>
                        <p className="text-xs font-black text-white px-3.5 py-2.5 bg-zinc-950 rounded border border-zinc-850 font-mono italic">
                          "{selectedDebate.ceoRuling?.decision}"
                        </p>
                        <div className="space-y-1">
                          <span className="text-[9.5px] font-bold text-zinc-405 uppercase font-mono tracking-wider">执行指令细则路径 / Automated Actions Enforced:</span>
                          <ol className="list-decimal pl-5 text-xs text-slate-300 font-medium font-mono space-y-0.5">
                            {selectedDebate.ceoRuling?.actionPlan?.map((p: string, pIdx: number) => (
                              <li key={pIdx}>{p}</li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        <p className="text-[11px] text-zinc-400 font-semibold leading-relaxed">
                          多智能体大脑在此议题推荐发生相互利益阻尼，陷入算法僵局。超级管理员可在此强制裁定最高 sovereign 指引，并重写全链路自动化的子执行细则，强行下达执行：
                        </p>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-[9px] text-[#07C2E3] font-bold uppercase tracking-wider mb-1">最高总裁特判干预裁决词 / Supreme Ruling Dictum</label>
                            <input
                              type="text"
                              value={humanRulingText}
                              onChange={(e) => setHumanRulingText(e.target.value)}
                              placeholder="例：裁定执行 Supply Sentry 第一调拨方案并消减 20% 多租户在法广告预算，锁定法国市场风险。"
                              className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] text-[#07C2E3] font-bold uppercase tracking-wider mb-1">总裁自动化特派指令细则 (按换行分隔 / Action steps)</label>
                            <textarea
                              rows={2.5}
                              value={humanResolutionPath}
                              onChange={(e) => setHumanResolutionPath(e.target.value)}
                              placeholder="第一步：启动 Rome 意大利库房 300 件针织调拨大车...&#10;第二步：限期消减低转换 ROI Google Ads 组..."
                              className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end pt-2 border-t border-zinc-850/40">
                          <button
                            type="button"
                            onClick={() => handleEnforceHumanRuling(selectedDebate.id)}
                            disabled={!humanRulingText.trim()}
                            className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                              humanRulingText.trim()
                                ? 'bg-amber-500 text-zinc-950 shadow-md active:scale-95 hover:bg-amber-600 cursor-pointer'
                                : 'bg-zinc-805 text-slate-550 cursor-not-allowed border border-zinc-900'
                            }`}
                          >
                            签发最高总裁执行令 / Enforce Sovereign Verdict
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 text-xs font-mono">No active debates index loaded.</div>
              )}
            </div>

            {/* Panel 3: Digital Twin & Meta Learning Engine (1/3 width inside Boardroom Tab) */}
            <div className="bg-slate-900 text-slate-100 p-5 rounded-xl border border-slate-800 shadow-sm space-y-5 lg:col-span-1 text-left flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#07C2E3]" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">Digital Twin Console, Meta Tuning & continuous Learning</span>
                </div>
                <span className="text-[8.5px] font-mono bg-emerald-500/15 text-emerald-500 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase">
                  Meta Analytics Platform
                </span>
              </div>

              {/* Advanced Technical Indicators Gauge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3.5 space-y-1 text-left">
                  <span className="text-[9.5px] text-zinc-400 font-bold block uppercase tracking-wider">贝叶斯置信收敛 (Bayesian Converge Score)</span>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-xl font-black text-white font-mono">96.5%</span>
                    <span className="text-[9.5px] text-emerald-400 font-mono">↑ 1.2% (Steady)</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden mt-2">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '96.5%' }} />
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3.5 space-y-1 text-left">
                  <span className="text-[9.5px] text-zinc-400 font-bold block uppercase tracking-wider">神经网络自拟合损失 (Neural Loss Curve)</span>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-xl font-black text-white font-mono">0.024</span>
                    <span className="text-[9.5px] text-emerald-400 font-mono">↓ 0.003 (Optimal)</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden mt-2">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '12%' }} />
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3.5 space-y-1 text-left">
                  <span className="text-[9.5px] text-zinc-400 font-bold block uppercase tracking-wider">自主知识图谱关联密度 (KG Concept Density)</span>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-xl font-black text-white font-mono">924 Nodes</span>
                    <span className="text-[9.5px] text-[#07C2E3] font-mono">+12/hrs (Exploring)</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden mt-2">
                    <div className="bg-[#07C2E3] h-full rounded-full" style={{ width: '84%' }} />
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3.5 space-y-1 text-left">
                  <span className="text-[9.5px] text-zinc-400 font-bold block uppercase tracking-wider">证据链核对置信底分 (Evidence Check Yield)</span>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-xl font-black text-white font-mono">98.15%</span>
                    <span className="text-[9.5px] text-emerald-400 font-mono">Verified 9/9</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden mt-2">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '98%' }} />
                  </div>
                </div>
              </div>

               {/* Simulated Tracer Block */}
               <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-850 space-y-4 text-left mt-5">
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-900 pb-2.5 gap-2.5">
                   <div className="space-y-0.5">
                     <h4 className="text-[10.5px] font-black text-white uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                       Autonomous Operator Simulated Task Tracer (背景深度自演进仿真器)
                     </h4>
                   </div>
                   <button
                     type="button"
                     onClick={handleSimulateOperatorTask}
                     className="px-2.5 py-1 bg-[#07C2E3] hover:bg-[#06B2D0] active:scale-95 text-zinc-950 font-black text-[9.5px] rounded tracking-wider uppercase flex items-center gap-1 cursor-pointer transition-all shrink-0"
                   >
                     <Play className="w-2.5 h-2.5 fill-current" />
                     <span>推进仿真</span>
                   </button>
                 </div>

                 {/* Tracer List */}
                 <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                   {operatorTasks.map((tk) => (
                     <div key={tk.id} className="p-2.5 bg-zinc-900 border border-zinc-950 rounded-lg space-y-1.5 text-left text-xs text-slate-350">
                       <div className="flex items-center justify-between">
                         <span className="text-[8.5px] font-black text-zinc-500 font-mono">#{tk.id}</span>
                         <span className={`text-[8px] font-black px-1 rounded uppercase ${
                           tk.status === 'completed' ? 'bg-emerald-950/45 text-emerald-400' :
                           tk.status === 'running' ? 'bg-[#07C2E3]/15 text-[#07C2E3] animate-pulse' :
                           'bg-zinc-805 text-slate-500'
                         }`}>
                           {tk.status}
                         </span>
                       </div>
                       <h5 className="font-bold text-[10px] text-slate-200 leading-tight font-mono">{tk.taskName}</h5>
                       <div className="space-y-1 pt-1.5 border-t border-zinc-900/40">
                         {tk.subSteps.map((step: any, sIdx: number) => {
                           const isDone = step.status === 'completed';
                           const isActive = step.status === 'running';
                           return (
                             <div key={sIdx} className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                               <span>{sIdx + 1}. {step.name}</span>
                               <span className={isDone ? 'text-emerald-500 font-bold' : isActive ? 'text-[#07C2E3] font-black' : 'text-slate-650'}>
                                 {isDone ? '✓ COMPLETED' : isActive ? '● SIMULATING' : '○ PEND'}
                               </span>
                             </div>
                           );
                         })}
                       </div>
                     </div>
                   ))}
                </div>
             </div>

           </div>

          {/* Level 2 Bayesian Hypothesis Diagnostic details (Full-Width below grid in Boardroom Tab) */}
          <div className="bg-zinc-950 rounded-xl p-5 border border-zinc-850/80 space-y-4 text-left mt-6 animate-fadeIn text-slate-100">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2 col-span-2">
                  <div className="space-y-0.5">
                    <span className="text-[9.5px] font-bold text-[#07C2E3] font-mono uppercase tracking-wider block">Enterprise Dominant Bayesian Hypothesis (置信度最大因果拟合链)</span>
                    <p className="text-[10px] text-zinc-500 leading-relaxed font-semibold">展示当前全网络因气象、物流时变、价格歧视综合影响，由智脑拟合的最优因果分析图谱。支持查看全量正面支持证据与阻断对冲事实：</p>
                  </div>
                  <span className="text-[9px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 rounded font-bold uppercase shrink-0">Confidence Score: 89%</span>
                </div>

                {hypotheses.map((hyp) => (
                  <div key={hyp.id} className="space-y-3 font-semibold text-xs text-slate-300 leading-relaxed">
                    <h5 className="font-bold text-white text-xs font-mono">🔍 诊断假说：{hyp.hypothesisLabel}</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">{hyp.description}</p>

                    {/* Logical chain diagram */}
                    <div className="bg-zinc-900 w-full rounded-lg p-3 border border-zinc-900 space-y-2 text-left">
                      <span className="text-[9px] text-[#07C2E3] uppercase font-bold tracking-widest font-mono">因果溯源推链 (Causal Bayesian Threading)</span>
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono font-black text-slate-300">
                        {hyp.logicalChain.map((step: string, sIdx: number) => (
                          <React.Fragment key={sIdx}>
                            <span className="bg-zinc-950 px-2.5 py-0.8 rounded border border-zinc-900 whitespace-nowrap">{step}</span>
                            {sIdx < hyp.logicalChain.length - 1 && <span className="text-slate-600">→</span>}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Evidence expander button */}
                    <div className="pt-1.5 text-left">
                      <button
                        type="button"
                        onClick={() => setShowAnalysisPathId(showAnalysisPathId === hyp.id ? null : hyp.id)}
                        className="text-xs text-[#07C2E3] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                      >
                        <span>{showAnalysisPathId === hyp.id ? '收起逻辑推导验证审计' : '展开多视域深度论证核对证据 / View Supporting Evidence'}</span>
                        <span className="text-[10px] font-mono">[{hyp.supportingEvidence.length} 条正面核对事实]</span>
                      </button>

                      {showAnalysisPathId === hyp.id && (
                        <div className="mt-3 bg-zinc-900 w-full p-4 rounded-lg border border-zinc-900 space-y-3.5 font-mono animate-fadeIn text-left">
                          <div className="space-y-1.5 text-left">
                            <h6 className="text-[10px] text-emerald-400 font-black uppercase tracking-wider flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                              Positive Fact Evidence (全量正面关联事实证据)
                            </h6>
                            <ul className="list-disc pl-5 text-xs text-slate-300 space-y-1">
                              {hyp.supportingEvidence.map((ev: string, evIdx: number) => <li key={evIdx}>{ev}</li>)}
                            </ul>
                          </div>
                          <div className="space-y-1.5 pt-2.5 border-t border-zinc-800 text-left">
                            <h6 className="text-[10px] text-rose-500 font-black uppercase tracking-wider flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              Negative Refutation Triggers (假说伪证穿透阻断触发条件)
                            </h6>
                            <p className="text-xs text-slate-450 leading-relaxed">{hyp.refutationTrigger}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
            </React.Fragment>
          )}

          {aiCentralTab === 'system_map' && (
            <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 animate-fadeIn text-left text-slate-900 shadow-sm">
              <EcosMasterDirectory />
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* MENU 6: 🔐 权限中心 */}
      {/* ========================================================= */}
      {activeSubTab === 'roles' && (
        <div className="space-y-6 text-left">
          
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">系统级运行人员 角色权限控制矩阵</h3>
                <p className="text-[10px] text-slate-400 mt-1">精细化管理多租户 SaaS 系统的后台人员资产身份配置（Owner/SuperAdmin/Staff）</p>
              </div>
              <span className="text-[11px] font-mono text-slate-405 font-bold">Platform-Level Guardrails</span>
            </div>

            <div className="overflow-x-auto text-xs font-semibold">
              <table className="w-full text-left border-collapse text-slate-700">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-250 font-bold text-slate-505">
                    <th className="p-4">角色标识符 / 职能描述</th>
                    <th className="p-4 text-center">商品发布管理 (Product)</th>
                    <th className="p-4 text-center">订单退款审计 (Order)</th>
                    <th className="p-4 text-center">收单结算及银行划拨 (Finance)</th>
                    <th className="p-4 text-center">智能配置指令下发 (AI Ops)</th>
                    <th className="p-4 text-center">物理底座服务器管理 (Sys Admin)</th>
                    <th className="p-4 text-center">安全隔离状态修改</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rolesList.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-slate-900 block">{r.name}</span>
                        <span className="text-[10px] text-slate-405 font-normal block mt-1 leading-normal max-w-sm font-sans">{r.desc}</span>
                      </td>
                      
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={r.permissions.product}
                          onChange={() => {
                            const updated = rolesList.map(item => {
                              if (item.id === r.id) {
                                const nextPerm = { ...item.permissions, product: !item.permissions.product };
                                onAddSystemLog('权限变更', '更改商品读写权', `更改角色 [${r.name}] 的商品修改权限为 ${!item.permissions.product}`, 'warning');
                                return { ...item, permissions: nextPerm };
                              }
                              return item;
                            });
                            setRolesList(updated);
                          }}
                          className="w-4 h-4 accent-[#07C2E3] cursor-pointer"
                        />
                      </td>

                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={r.permissions.order}
                          onChange={() => {
                            const updated = rolesList.map(item => {
                              if (item.id === r.id) {
                                const nextPerm = { ...item.permissions, order: !item.permissions.order };
                                onAddSystemLog('权限变更', '更改退货审单权', `更改角色 [${r.name}] 的退单审核权限为 ${!item.permissions.order}`, 'warning');
                                return { ...item, permissions: nextPerm };
                              }
                              return item;
                            });
                            setRolesList(updated);
                          }}
                          className="w-4 h-4 accent-[#07C2E3] cursor-pointer"
                        />
                      </td>

                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={r.permissions.finance}
                          onChange={() => {
                            const updated = rolesList.map(item => {
                              if (item.id === r.id) {
                                const nextPerm = { ...item.permissions, finance: !item.permissions.finance };
                                onAddSystemLog('权限变更', '更改银行划拔权', `更改角色 [${r.name}] 的财务打款及划拔权限为 ${!item.permissions.finance}`, 'error');
                                return { ...item, permissions: nextPerm };
                              }
                              return item;
                            });
                            setRolesList(updated);
                          }}
                          className="w-4 h-4 accent-[#07C2E3] cursor-pointer"
                        />
                      </td>

                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={r.permissions.ai_ops}
                          onChange={() => {
                            const updated = rolesList.map(item => {
                              if (item.id === r.id) {
                                const nextPerm = { ...item.permissions, ai_ops: !item.permissions.ai_ops };
                                onAddSystemLog('权限变更', '更改AI控制权', `更改角色 [${r.name}] 的智能自动化控制权限为 ${!item.permissions.ai_ops}`, 'warning');
                                return { ...item, permissions: nextPerm };
                              }
                              return item;
                            });
                            setRolesList(updated);
                          }}
                          className="w-4 h-4 accent-[#07C2E3] cursor-pointer"
                        />
                      </td>

                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={r.permissions.sys_config}
                          onChange={() => {
                            const updated = rolesList.map(item => {
                              if (item.id === r.id) {
                                const nextPerm = { ...item.permissions, sys_config: !item.permissions.sys_config };
                                onAddSystemLog('权限变更', '更改核心底座支配权', `更改角色 [${r.name}] 的宿主控制级别权限为 ${!item.permissions.sys_config}`, 'error');
                                return { ...item, permissions: nextPerm };
                              }
                              return item;
                            });
                            setRolesList(updated);
                          }}
                          className="w-4 h-4 accent-[#07C2E3] cursor-pointer"
                        />
                      </td>

                      <td className="p-4 text-center font-mono">
                        <button
                          onClick={() => {
                            onAddSystemLog('权限审计', '保存身份矩阵', `确定保存角色 ${r.name} 的运行机制描述`, 'success');
                            alert(`角色「${r.name}」权限规则修改已物理生效并落库！`);
                          }}
                          className="bg-[#07C2E3]/15 hover:bg-[#07C2E3] text-slate-800 hover:text-slate-950 border border-[#07C2E3]/35 font-extrabold text-[10px] px-2.5 py-1.5 rounded-lg cursor-pointer transition-all"
                        >
                          💾 保存生效
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MENU 7: 📜 审计中心 */}
      {/* ========================================================= */}
      {activeSubTab === 'logs' && (
        <div className="space-y-6 text-left">
          
          {/* Recharts System Task Performance over the last 24 hours */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-3.5 bg-[#07C2E3] rounded-xs inline-block"></span>
                  系统任务执能分析 (24小时性能监测)
                </h3>
                <p className="text-[10px] text-slate-400 mt-1">监测全域多智能体底座任务吞吐节奏、平均时延指标，及系统动态高可用率</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#07C2E3] rounded-sm inline-block"></span>
                  <span className="text-slate-500 font-bold">任务吞吐量 (次/h)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm inline-block"></span>
                  <span className="text-slate-500 font-bold">平均响应延时 (ms)</span>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-left">
                <span className="text-[9px] text-slate-400 uppercase font-black block">24h 累计任务吞吐量</span>
                <span className="text-lg font-black text-slate-900 font-mono mt-0.5 block">{performanceStats.totalTasks.toLocaleString()} <span className="text-xs text-slate-400 font-normal font-sans">次任务</span></span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-left">
                <span className="text-[9px] text-slate-400 uppercase font-black block">24h 平均内核响应延迟</span>
                <span className="text-lg font-black text-[#07C2E3] font-mono mt-0.5 block">{performanceStats.avgLatency} <span className="text-xs text-[#07C2E3]/70 font-normal font-sans">ms</span></span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-left">
                <span className="text-[9px] text-slate-400 uppercase font-black block">系统综合 SLA 高可用率</span>
                <span className="text-lg font-black text-emerald-600 font-mono mt-0.5 block">{performanceStats.successRate}</span>
              </div>
            </div>

            {/* Line Chart Grid */}
            <div className="h-[220px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={last24hPerformanceData}
                  margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace' }} 
                  />
                  <YAxis 
                    yAxisId="left"
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace' }} 
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace' }} 
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg shadow-xl text-[10px] font-mono text-slate-200">
                            <p className="font-bold mb-1 text-slate-400">时间: {label}</p>
                            <p className="text-[#07C2E3] flex items-center justify-between gap-4">
                              <span>任务量:</span>
                              <span className="font-extrabold text-white">{payload[0]?.value} 次/h</span>
                            </p>
                            {payload[1] && (
                              <p className="text-amber-500 flex items-center justify-between gap-4 mt-0.5">
                                <span>延迟:</span>
                                <span className="font-extrabold text-white">{payload[1]?.value} ms</span>
                              </p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="tasks" 
                    stroke="#07C2E3" 
                    strokeWidth={2} 
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0, fill: '#07C2E3' }} 
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="latency" 
                    stroke="#f59e0b" 
                    strokeWidth={1.5} 
                    dot={false} 
                    activeDot={{ r: 3, strokeWidth: 0, fill: '#f59e0b' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">系统物理全域 综合安全审计中心 (Audit Registry Master)</h3>
                <p className="text-[10px] text-slate-400 mt-1">100% 记录来自于底座服务器热加载、支付秘钥变更、网格隔离拦截的日志归档</p>
              </div>
              <span className="font-mono text-[#07C2E3] text-[10px] font-bold">SEC_AUDIT_STABLE</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                    <th className="p-4">审计时间点</th>
                    <th className="p-4">执勤运维模块</th>
                    <th className="p-4">安全防线审计细节 specs</th>
                    <th className="p-4 font-mono">操作人身份 ID</th>
                    <th className="p-4 text-center">底座隔离存档签名</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {auditLogs.map((l: any, idx: number) => {
                    const typeColor = l.type === 'error' ? 'text-red-600' : l.type === 'warning' ? 'text-amber-600' : 'text-emerald-700';
                    return (
                      <tr key={l.id || idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 text-slate-500">{l.createdAt || '2026-06-08 14:56'}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-black ${l.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : l.type === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-emerald-50 text-emerald-700'}`}>
                            {l.module || 'SYS_CONTROLLER'}
                          </span>
                        </td>
                        <td className={`p-4 truncate max-w-md font-sans ${typeColor}`}>{l.details || '系统管理员对账审查完毕并存档'}</td>
                        <td className="p-4 text-slate-800 font-bold font-mono">{(l.userId || 'SuperAdmin').toUpperCase()}</td>
                        <td className="p-4 text-center">
                          <span className="bg-slate-10s0 text-slate-400 text-[9px] px-1.5 py-0.5 rounded border border-slate-200 font-bold">
                            #{Math.floor(Math.sin(idx + 1) * 90000) + 10000}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="hover:bg-slate-50/50 transition-colors text-slate-505">
                    <td className="p-4">2026-06-08 14:12:01</td>
                    <td className="p-4"><span className="px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 rounded text-[10px] font-sans">多租户安全网格</span></td>
                    <td className="p-4 font-sans text-emerald-700">米兰风尚服装批发集团 沙箱隔离鉴权通过，数据库连接网格验证无越权溢出。</td>
                    <td className="p-4 text-slate-800 font-bold font-mono">SYSTEM_AUTO</td>
                    <td className="p-4 text-center"><span className="bg-slate-100 text-slate-400 text-[9px] px-1.5 py-0.5 rounded border border-slate-200 font-bold">#48192</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors text-slate-505">
                    <td className="p-4">2026-06-08 13:58:12</td>
                    <td className="p-4"><span className="px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 rounded text-[10px] font-sans">支付中继调度</span></td>
                    <td className="p-4 font-sans text-emerald-700">财务对账：通过 Adyen 网关安全拆算欧洲零售物理账户 1.2% 并提划入平台瑞士对公托管行。</td>
                    <td className="p-4 text-slate-800 font-bold font-mono">SYSTEM_AUTO</td>
                    <td className="p-4 text-center"><span className="bg-slate-100 text-slate-400 text-[9px] px-1.5 py-0.5 rounded border border-slate-200 font-bold">#59218</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MENU 8: 🩺 系统诊断中心 */}
      {/* ========================================================= */}
      {activeSubTab === 'diagnostics' && (
        <div className="space-y-6 text-left">
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-3">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">底座物理组件全网健康体检 diagnostic</h3>
                <p className="text-[10px] text-slate-400 mt-1">诊断包含数据库集群、高速 Redis 缓存、API 网关及第三方收单接口握手性能</p>
              </div>
              <button
                onClick={handleDiagnoseAll}
                disabled={isDiagnosing}
                className="bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] disabled:opacity-50 text-slate-950 font-black text-[11px] px-4 py-2.5 rounded-lg cursor-pointer transition-all shadow-sm"
              >
                {isDiagnosing ? '🔍 正在高精密度扫轨诊断中...' : '🔄 运行系统全域高维诊断'}
              </button>
            </div>

            {/* Diagnostics Cards Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 block">{dbDiagnostic.name}</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded font-mono text-[9px] font-bold">
                    {dbDiagnostic.status} | {dbDiagnostic.delay}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">{dbDiagnostic.msg}</p>
                <div className="text-[9px] text-slate-400 font-mono">CONNECTION_URI: postgresql://SaaS_user:***@swiss-pg-host-1:5432/db</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 block">{redisDiagnostic.name}</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded font-mono text-[9px] font-bold">
                    {redisDiagnostic.status} | {redisDiagnostic.delay}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">{redisDiagnostic.msg}</p>
                <div className="text-[9px] text-slate-400 font-mono">MEM_EVICTION_POLICY: volatile-lru | MASTER_HOST</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 block">{stripeHookDiagnostic.name}</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded font-mono text-[9px] font-bold">
                    {stripeHookDiagnostic.status} | {stripeHookDiagnostic.delay}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">{stripeHookDiagnostic.msg}</p>
                <div className="text-[9px] text-slate-400 font-mono">API_GATEWAY: public_https_listener_stripe (200_OK_VERIF)</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 block">{geminiDiagnostic.name}</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded font-mono text-[9px] font-bold">
                    {geminiDiagnostic.status} | {geminiDiagnostic.delay}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">{geminiDiagnostic.msg}</p>
                <div className="text-[9px] text-slate-400 font-mono">MODEL_PROOFS: @google/genai TypeScript Native Endpoint</div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MENU 9: ⚙️ 平台设置中心 */}
      {/* ========================================================= */}
      {activeSubTab === 'settings' && (
        <div className="space-y-6 text-left animate-fadeIn">
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <Settings className="w-4 h-4 text-[#07C2E3]" />
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">平台全局规则与底座高保设置 specs</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-semibold text-slate-705">
              
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-450 uppercase mb-1">系统对公开扣点佣金上限比例 (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={settingsForm.maxCommissionCap}
                  onChange={(e) => setSettingsForm({ ...settingsForm, maxCommissionCap: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#07C2E3]/80"
                />
                <span className="text-[9px] text-slate-400 block font-normal">设定所有商家套餐中最大自动对账手续费率提点硬上限，当前: 5.0%</span>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-450 uppercase mb-1">系统管理员 Session 会话注销超时 (秒)</label>
                <input
                  type="number"
                  value={settingsForm.sessionTimeout}
                  onChange={(e) => setSettingsForm({ ...settingsForm, sessionTimeout: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#07C2E3]/80"
                />
                <span className="text-[9px] text-slate-400 block font-normal">无操作超时注销会话的时常。对账密钥保护红线。</span>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-450 uppercase mb-1">全网默认底座大语言智算模型 (LLM Model Name)</label>
                <select
                  value={globalDefaultModel}
                  onChange={(e) => onChangeGlobalModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:outline-none font-sans"
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (推荐：标准对账及自动采购高速度)</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro (推荐：跨境高奢大订单风险综合评估)</option>
                  <option value="ollama-qwen2.5-7b">Ollama Qwen 2.5 7B (本地物理私有环境对账代理)</option>
                </select>
                <span className="text-[9px] text-slate-400 block font-normal">缺省模型将自动作为商户开通营销挽客/采购规则逻辑反思的默认容器。</span>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-450 uppercase mb-1">允许调用所有者权限的运维 IP 白名单列表</label>
                <input
                  type="text"
                  value="127.0.0.1, 82.102.39.*, 45.120.*.*"
                  readOnly
                  className="w-full bg-slate-10s0 border border-slate-200 text-slate-450 font-mono rounded px-2.5 py-1.5 focus:outline-none"
                />
                <span className="text-[9px] text-slate-400 block font-normal">除白名单网段以外的 IP 尝试物理登入 Super Admin 控制台将直接触发底层安全死锁拦截。</span>
              </div>

            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => {
                  onAddSystemLog('平台设置', '保存系统环境 parameters', `由于安全检查核审，保存环境 parameters 并更新默认模型级别为 ${globalDefaultModel}`, 'success');
                  alert('配置 parameters 已持久化保存并且即刻生效！');
                }}
                className="bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] text-slate-950 font-black text-xs px-5 py-2.5 rounded-lg cursor-pointer transition-all shadow-md"
              >
                保存平台全部设置参数
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
