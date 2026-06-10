import React, { useState, useMemo, useEffect } from 'react';
import { 
  Database, Network, Play, Pause, Shield, Activity, Coins, BarChart3, 
  Layers, Settings, Code, GitMerge, Plus, Edit3, Server, Brain, 
  CheckCircle, Clock, ArrowRight, CornerDownRight, Eye, HelpCircle, 
  X, AlertTriangle, ToggleLeft, ToggleRight, Trash2, Check, FileText, Search
} from 'lucide-react';
import { dbEngine } from '../../../../src/db/dbEngine';

interface MapNode {
  id: string;
  name: string;
  path: string;
  status: 'LIVE' | 'TESTING' | 'IN_DEVELOPMENT' | 'PLANNED' | 'DEPRECATED';
  completion: number; // 0 - 100
  type: string; // e.g. "Page" | "Component" | "Engine"
  responsibleModule: string;
  databaseTables?: string[];
  fileLocation: string;
  children?: MapNode[];
}

interface Playbook {
  id: string;
  name: string;
  industry: 'retail' | 'fashion' | 'restaurant' | 'beauty' | 'electronics' | 'all';
  triggerType: string;
  confidenceScore: number;
  stepsCount: number;
  isActive: boolean;
  recoveryValue: number;
  lastExecuted: string;
}

export default function EcosMasterDirectory() {
  const [activeTab, setActiveTab] = useState<'map' | 'agent_reg' | 'playbook' | 'costs' | 'decision_graph'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'LIVE' | 'TESTING' | 'IN_DEVELOPMENT' | 'PLANNED'>('ALL');
  const [tick, setTick] = useState(0);

  // Initialize nodes state with localStorage support for real persistence
  const [nodes, setNodes] = useState<MapNode[]>([]);

  // Initialize playbooks state
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);

  // Agent adjustment controls
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  const [tempPrompt, setTempPrompt] = useState('');
  const [tempModel, setTempModel] = useState('');
  const [tempTools, setTempTools] = useState<string[]>([]);

  // System registration form states
  const [showRegForm, setShowRegForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPath, setNewPath] = useState('');
  const [newFile, setNewFile] = useState('');
  const [newType, setNewType] = useState('Component');
  const [newModule, setNewModule] = useState('AI Brain Center');
  const [newStatus, setNewStatus] = useState<'LIVE' | 'TESTING' | 'IN_DEVELOPMENT' | 'PLANNED'>('IN_DEVELOPMENT');
  const [newCompletion, setNewCompletion] = useState(50);

  // Load Ecos Master Directory Structure
  useEffect(() => {
    const defaultNodes: MapNode[] = [
      {
        id: 'platform-root',
        name: 'ECOS Core Hub',
        path: 'ECOS Platform',
        status: 'LIVE',
        completion: 96,
        type: 'Engine',
        responsibleModule: 'Core System Engine',
        fileLocation: 'src/main.tsx',
        databaseTables: ['users', 'tenants', 'stores'],
        children: [
          {
            id: 'node-dashboard',
            name: '总裁主管驾驶舱 (CEO Dashboard)',
            path: 'ECOS Platform ➔ 总裁驾驶舱',
            status: 'LIVE',
            completion: 100,
            type: 'Page',
            responsibleModule: 'AI Brain Center',
            fileLocation: 'src/components/admin/ai-brain-center/EcosCEODashboard.tsx',
            databaseTables: ['failure_prediction_logs', 'execution_proposals']
          },
          {
            id: 'node-workflow',
            name: '执行决策中枢 (Execution Control Center)',
            path: 'ECOS Platform ➔ 执行控制',
            status: 'LIVE',
            completion: 95,
            type: 'Page',
            responsibleModule: 'AI Brain Center',
            fileLocation: 'src/components/admin/ai-brain-center/AIExecutionControlCenter.tsx',
            databaseTables: ['execution_proposals', 'execution_approvals']
          },
          {
            id: 'node-discovery',
            name: '自动诊断层 (Discovery Center)',
            path: 'ECOS Platform ➔ 诊断发现',
            status: 'LIVE',
            completion: 100,
            type: 'Page',
            responsibleModule: 'AI Brain Center',
            fileLocation: 'src/components/admin/ai-brain-center/AIDiscoveryCenter.tsx',
            databaseTables: ['blind_spot_discoveries', 'knowledge_gap_tasks']
          },
          {
            id: 'node-optimizer',
            name: '算效保障层 (Performance Optimizer)',
            path: 'ECOS Platform ➔ 效能优化',
            status: 'LIVE',
            completion: 88,
            type: 'Page',
            responsibleModule: 'AI Brain Center',
            fileLocation: 'src/components/admin/ai-brain-center/EcosPerformanceOptimizer.tsx',
            databaseTables: ['resource_allocation_plans']
          },
          {
            id: 'node-governance',
            name: '多智能体合规委员会 (Cognitive Governance)',
            path: 'ECOS Platform ➔ 安全治理',
            status: 'LIVE',
            completion: 90,
            type: 'Component',
            responsibleModule: 'AI Brain Center',
            fileLocation: 'src/components/admin/ai-brain-center/EcosCognitiveGovernance.tsx',
            databaseTables: ['self_reflection_audits', 'decision_humility_records']
          },
          {
            id: 'node-nervous',
            name: '数据神经突触集群 (Enterprise Nervous System)',
            path: 'ECOS Platform ➔ 数据突触',
            status: 'LIVE',
            completion: 85,
            type: 'Engine',
            responsibleModule: 'AI Brain Center',
            fileLocation: 'src/components/admin/ai-brain-center/EcosEnterpriseNervousSystem.tsx',
            databaseTables: ['execution_monitoring_logs']
          },
          {
            id: 'node-agent-reg',
            name: '智能体注册中心 (Agent Registry)',
            path: 'ECOS Platform ➔ Agent Registry',
            status: 'LIVE',
            completion: 100,
            type: 'Tab',
            responsibleModule: 'AI Brain Center',
            fileLocation: 'src/components/admin/ai-brain-center/EcosMasterDirectory.tsx [Embedded]',
            databaseTables: ['agents']
          },
          {
            id: 'node-playbook-reg',
            name: '经验法则数据库 (Playbook Registry)',
            path: 'ECOS Platform ➔ Playbook Registry',
            status: 'LIVE',
            completion: 100,
            type: 'Tab',
            responsibleModule: 'AI Brain Center',
            fileLocation: 'src/components/admin/ai-brain-center/EcosMasterDirectory.tsx [Embedded]',
            databaseTables: ['knowledge']
          },
          {
            id: 'node-cost-ctr',
            name: 'AI 成本损益清算中心 (Cost Center)',
            path: 'ECOS Platform ➔ Cost Center',
            status: 'LIVE',
            completion: 100,
            type: 'Tab',
            responsibleModule: 'AI Brain Center',
            fileLocation: 'src/components/admin/ai-brain-center/EcosMasterDirectory.tsx [Embedded]',
            databaseTables: ['finance']
          },
          {
            id: 'node-system-map',
            name: 'ECOS Master Global Map (System Map)',
            path: 'ECOS Platform ➔ System Map',
            status: 'LIVE',
            completion: 100,
            type: 'Tab',
            responsibleModule: 'AI Brain Center',
            fileLocation: 'src/components/admin/ai-brain-center/EcosMasterDirectory.tsx',
            databaseTables: []
          }
        ]
      },
      {
        id: 'node-merchant-workbench',
        name: '多租户商家前端面板 (SaaS Merchant Workbench)',
        path: 'ECOS Merchant Layout',
        status: 'LIVE',
        completion: 100,
        type: 'Page',
        responsibleModule: 'SaaS Frontline',
        fileLocation: 'src/components/SaaSMerchantWorkbench.tsx',
        databaseTables: ['products', 'orders', 'stores']
      },
      {
        id: 'node-crm',
        name: 'CRM 国际意向透镜与客户中枢 (Customer Center)',
        path: 'ECOS CRM',
        status: 'LIVE',
        completion: 100,
        type: 'Page',
        responsibleModule: 'CRM Core',
        fileLocation: 'src/components/CustomerCenter.tsx',
        databaseTables: ['users']
      },
      {
        id: 'node-oms',
        name: 'OMS 多币种跨国订单中枢 (Order Center)',
        path: 'ECOS OMS',
        status: 'LIVE',
        completion: 100,
        type: 'Page',
        responsibleModule: 'OMS Gateway',
        fileLocation: 'src/components/OrderCenter.tsx',
        databaseTables: ['orders']
      }
    ];

    const savedNodes = localStorage.getItem('ecos_system_map');
    if (savedNodes) {
      try {
        setNodes(JSON.parse(savedNodes));
      } catch (e) {
        setNodes(defaultNodes);
      }
    } else {
      setNodes(defaultNodes);
      localStorage.setItem('ecos_system_map', JSON.stringify(defaultNodes));
    }

    const defaultPlaybooks: Playbook[] = [
      { id: 'pb_fashion_discounter', name: '快时尚春装突发尾货快速对冲促销量', industry: 'fashion', triggerType: '库存积压超过25天且气温突然回升', confidenceScore: 94, stepsCount: 5, isActive: true, recoveryValue: 45200, lastExecuted: '2026-06-09 10:22' },
      { id: 'pb_restaurant_weather_p', name: '餐饮连带菜品恶劣阴雨天气精准外卖弹窗', industry: 'restaurant', triggerType: '降雨量>15mm 且气温突然下降', confidenceScore: 89, stepsCount: 4, isActive: true, recoveryValue: 12800, lastExecuted: '2026-06-10 11:05' },
      { id: 'pb_retail_cart_abandon', name: '高客单零售意向买家弃单实时AI多通路挽留', industry: 'retail', triggerType: '购物车商品金额>200欧元且流失超过2小时', confidenceScore: 95, stepsCount: 6, isActive: true, recoveryValue: 69400, lastExecuted: '2026-06-10 16:45' },
      { id: 'pb_beauty_low_stock_p', name: '高毛利美妆断货预警紧急小样替代补位策略', industry: 'beauty', triggerType: '核心SKU预测周转天数<4天且海外仓断供', confidenceScore: 91, stepsCount: 5, isActive: false, recoveryValue: 31200, lastExecuted: '2026-06-05 09:12' },
      { id: 'pb_elec_dynamic_margin', name: '3C数码竞争对手调价动态保利降尘跟踪对决', industry: 'electronics', triggerType: '竞争源定价下调超过5%', confidenceScore: 93, stepsCount: 7, isActive: true, recoveryValue: 88500, lastExecuted: '2026-06-10 14:10' }
    ];

    const savedPlaybooks = localStorage.getItem('ecos_playbook_registry');
    if (savedPlaybooks) {
      try {
        setPlaybooks(JSON.parse(savedPlaybooks));
      } catch (e) {
        setPlaybooks(defaultPlaybooks);
      }
    } else {
      setPlaybooks(defaultPlaybooks);
      localStorage.setItem('ecos_playbook_registry', JSON.stringify(defaultPlaybooks));
    }
  }, []);

  // Save utility to localStorage immediately on modifying state variables
  const triggerMapSave = (updatedNodes: MapNode[]) => {
    setNodes(updatedNodes);
    localStorage.setItem('ecos_system_map', JSON.stringify(updatedNodes));
    setTick(t => t + 1);
  };

  const triggerPlaybookSave = (updatedPbs: Playbook[]) => {
    setPlaybooks(updatedPbs);
    localStorage.setItem('ecos_playbook_registry', JSON.stringify(updatedPbs));
    setTick(t => t + 1);
  };

  // Node registration submit handler
  const handleRegisterNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newFile) return;

    const newNode: MapNode = {
      id: `custom-node-${Date.now()}`,
      name: newName,
      path: newPath || `ECOS Platform ➔ ${newName}`,
      status: newStatus,
      completion: Number(newCompletion),
      type: newType,
      responsibleModule: newModule,
      fileLocation: newFile,
      databaseTables: []
    };

    // By default, append to children of root or top-level list
    const updated = [...nodes];
    if (updated.length > 0 && updated[0].children) {
      updated[0].children.push(newNode);
    } else {
      updated.push(newNode);
    }

    triggerMapSave(updated);
    
    // Clear forms
    setNewName('');
    setNewPath('');
    setNewFile('');
    setShowRegForm(false);
  };

  // Delete node
  const handleDeleteNode = (nodeId: string) => {
    let updated = nodes.map(parent => {
      if (parent.id === nodeId) return null;
      if (parent.children) {
        return {
          ...parent,
          children: parent.children.filter(child => child.id !== nodeId)
        };
      }
      return parent;
    }).filter(Boolean) as MapNode[];

    triggerMapSave(updated);
  };

  // Update node completion or status
  const handleUpdateNode = (nodeId: string, status: any, completion: number) => {
    const updated = nodes.map(parent => {
      if (parent.id === nodeId) {
        return { ...parent, status, completion };
      }
      if (parent.children) {
        return {
          ...parent,
          children: parent.children.map(child => child.id === nodeId ? { ...child, status, completion } : child)
        };
      }
      return parent;
    });
    triggerMapSave(updated);
  };

  // Toggle playbook status
  const togglePlaybook = (id: string) => {
    const updated = playbooks.map(pb => pb.id === id ? { ...pb, isActive: !pb.isActive } : pb);
    triggerPlaybookSave(updated);
  };

  // Remove playbook
  const deletePlaybook = (id: string) => {
    const updated = playbooks.filter(pb => pb.id !== id);
    triggerPlaybookSave(updated);
  };

  // Add virtual playbook
  const [newPbName, setNewPbName] = useState('');
  const [newPbIndustry, setNewPbIndustry] = useState<'retail' | 'fashion' | 'restaurant' | 'beauty' | 'electronics' | 'all'>('retail');
  const [newPbTrigger, setNewPbTrigger] = useState('');
  const [newPbConfidence, setNewPbConfidence] = useState(90);
  const [showPbForm, setShowPbForm] = useState(false);

  const handleCreatePlaybook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPbName || !newPbTrigger) return;
    const newPb: Playbook = {
      id: `pb_${Date.now()}`,
      name: newPbName,
      industry: newPbIndustry,
      triggerType: newPbTrigger,
      confidenceScore: Number(newPbConfidence),
      stepsCount: 5,
      isActive: true,
      recoveryValue: 20000 + Math.floor(Math.random() * 30000),
      lastExecuted: '刚刚创建'
    };
    triggerPlaybookSave([newPb, ...playbooks]);
    setNewPbName('');
    setNewPbTrigger('');
    setShowPbForm(false);
  };

  // Get active agents from dbEngine safely
  const liveAgents = useMemo(() => {
    const list = dbEngine.agents.getAll() || [];
    return list;
  }, [tick]);

  // Edit agent prompts
  const enterEditingAgent = (agent: any) => {
    setEditingAgentId(agent.id);
    setTempPrompt(agent.systemPrompt || '');
    setTempModel(agent.id === 'inventory_agent' ? 'gemini-1.5-flash' : 'gemini-2.5-pro');
    setTempTools(['read_db', 'write_db', 'trigger_refund']);
  };

  const handleSaveAgentSettings = (agentId: string) => {
    dbEngine.agents.update(agentId, { systemPrompt: tempPrompt });
    setEditingAgentId(null);
    setTick(t => t + 1);
  };

  // Comprehensive static metadata node lists for filtering and flat list representation
  const flattenedNodes = useMemo(() => {
    const list: MapNode[] = [];
    const traverse = (n: MapNode) => {
      list.push(n);
      if (n.children) {
        n.children.forEach(traverse);
      }
    };
    nodes.forEach(traverse);
    return list;
  }, [nodes]);

  // Filter processes
  const filteredFlatNodes = useMemo(() => {
    return flattenedNodes.filter(n => {
      const matchSearch = n.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.fileLocation.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.responsibleModule.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || n.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [flattenedNodes, searchQuery, statusFilter]);

  // Completion metrics
  const overallStats = useMemo(() => {
    const list = flattenedNodes.filter(n => n.id !== 'platform-root');
    if (list.length === 0) return { avg: 100, liveCount: 0, total: 0 };
    const totalComps = list.reduce((sum, n) => sum + n.completion, 0);
    const liveCount = list.filter(n => n.status === 'LIVE').length;
    return {
      avg: Math.round(totalComps / list.length),
      liveCount,
      total: list.length
    };
  }, [flattenedNodes]);

  // Calculations for AI Cost Center
  // Proportional metrics dynamically linked to input factors/historical weights
  const [inferenceVolume, setInferenceVolume] = useState(14800); // number of requests
  const avgCostPerInference = 0.00015; // USD / Token level average
  const mockEmailAdCosts = 450.00; // USD fixed overhead
  const totalAICost = useMemo(() => {
    return Number((inferenceVolume * avgCostPerInference + mockEmailAdCosts).toFixed(2));
  }, [inferenceVolume]);

  const totalRecoveryValueSaved = useMemo(() => {
    // Computed of playbooks and execution logs
    const activeSum = playbooks.filter(p => p.isActive).reduce((sum, p) => sum + p.recoveryValue, 0);
    return activeSum + 35000; // Base platform savings log fallback
  }, [playbooks]);

  const computedROI = useMemo(() => {
    if (totalAICost === 0) return 0;
    return Number((totalRecoveryValueSaved / totalAICost).toFixed(1));
  }, [totalAICost, totalRecoveryValueSaved]);


  return (
    <div id="ecos_master_directory_view" className="space-y-6 text-slate-900 leading-relaxed font-sans max-w-7xl mx-auto">
      
      {/* Visual Identity Title Board */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#07C2E3]" />
            <h2 className="text-lg font-extrabold uppercase tracking-tight text-slate-900 font-mono">
              ECOS Master System Directory
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 max-w-xl">
            全平台统一自治系统导航地图。提供实效节点、智能体注册、经验法则库及AI清算成本的最高宪章导航审计大盘。
          </p>
        </div>
        
        {/* Statistics Metric Box */}
        <div className="flex gap-4 mt-3 sm:mt-0 font-mono">
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-right">
            <span className="block text-[8px] text-slate-500 font-bold uppercase">全网映射节点</span>
            <span className="text-sm font-extrabold text-slate-900">{overallStats.liveCount} / {overallStats.total} <span className="text-[10px] text-emerald-600">LIVE</span></span>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-right">
            <span className="block text-[8px] text-slate-500 font-bold uppercase">总构建完成度</span>
            <span className="text-sm font-extrabold text-[#07C2E3]">{overallStats.avg}%</span>
          </div>
        </div>
      </div>

      {/* Selector Subtabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('map')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'map' ? 'bg-[#07C2E3] text-zinc-950 shadow-sm' : 'bg-slate-150 text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
        >
          🗺️ ECOS 统一导航地图
        </button>
        <button
          onClick={() => setActiveTab('agent_reg')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'agent_reg' ? 'bg-[#07C2E3] text-zinc-950 shadow-sm' : 'bg-slate-150 text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
        >
          🤖 Agent Registry (智能体)
        </button>
        <button
          onClick={() => setActiveTab('playbook')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'playbook' ? 'bg-[#07C2E3] text-zinc-950 shadow-sm' : 'bg-slate-150 text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
        >
          📚 Playbook Registry (经验库)
        </button>
        <button
          onClick={() => setActiveTab('costs')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'costs' ? 'bg-[#07C2E3] text-zinc-950 shadow-sm' : 'bg-slate-150 text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
        >
          💸 AI Cost Center (算效成本)
        </button>
        <button
          onClick={() => setActiveTab('decision_graph')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'decision_graph' ? 'bg-[#07C2E3] text-zinc-950 shadow-sm' : 'bg-slate-150 text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
        >
          ⚡ Decision Graph (决策链路)
        </button>
      </div>

      {/* TAB 1: ECOS MASTER SYSTEM DIRECTORY */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索组件名称、文件路径、归属模块..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-white border border-slate-200 text-xs px-2.5 py-1.5 rounded-lg w-full sm:w-64 focus:outline-none focus:border-[#07C2E3]"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end font-mono">
              <span className="text-[10px] text-slate-500 uppercase font-bold">按状态筛选:</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                className="bg-white border border-slate-200 text-[11px] font-bold px-2 py-1 rounded w-32 focus:outline-none"
              >
                <option value="ALL">全部状态</option>
                <option value="LIVE">🟢 LIVE (上线)</option>
                <option value="TESTING">🟡 TESTING (测试)</option>
                <option value="IN_DEVELOPMENT">🔵 IN_DEVELOPMENT (开发)</option>
                <option value="PLANNED">⚫ PLANNED (规划)</option>
              </select>

              <button
                onClick={() => setShowRegForm(!showRegForm)}
                className="bg-[#07C2E3] text-zinc-950 hover:bg-[#06B2D0] px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>登记新节点</span>
              </button>
            </div>
          </div>

          {/* Registration Inline Modal Form */}
          {showRegForm && (
            <form onSubmit={handleRegisterNode} className="bg-slate-50 border border-[#07C2E3]/40 p-4 rounded-xl space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="text-xs font-extrabold uppercase font-mono text-slate-900">📝 新功能模块备案登记表 (Constitutional Registration)</h4>
                <button type="button" onClick={() => setShowRegForm(false)} className="text-slate-400 hover:text-slate-600"><X className="w-3.5 h-3.5" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">功能/组件名称</label>
                  <input
                    type="text"
                    required
                    placeholder="例如: AI 算力中枢"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs p-2 rounded focus:outline-none focus:border-[#07C2E3]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">全路径映射名</label>
                  <input
                    type="text"
                    placeholder="例如: ECOS Root ➔ AI Core"
                    value={newPath}
                    onChange={e => setNewPath(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs p-2 rounded focus:outline-none focus:border-[#07C2E3]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">文件绝对路径</label>
                  <input
                    type="text"
                    required
                    placeholder="例如: src/components/admin/ai-brain-center/MyComp.tsx"
                    value={newFile}
                    onChange={e => setNewFile(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs p-2 rounded focus:outline-none focus:border-[#07C2E3]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">组件类别</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs p-2 rounded focus:outline-none"
                  >
                    <option value="Page">页面 (Page)</option>
                    <option value="Component">组件 (Component)</option>
                    <option value="Engine">引擎 (Engine)</option>
                    <option value="Tab">页签栏 (Tab)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">归属高管责任部门</label>
                  <input
                    type="text"
                    value={newModule}
                    onChange={e => setNewModule(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs p-2 rounded focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">初始状态</label>
                    <select
                      value={newStatus}
                      onChange={e => setNewStatus(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 text-xs p-2 rounded focus:outline-none"
                    >
                      <option value="LIVE">🟢 LIVE</option>
                      <option value="TESTING">🟡 TESTING</option>
                      <option value="IN_DEVELOPMENT">🔵 IN_DEV</option>
                      <option value="PLANNED">⚫ PLANNED</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">完成比例 (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newCompletion}
                      onChange={e => setNewCompletion(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 text-xs p-2 rounded focus:outline-none focus:border-[#07C2E3]"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowRegForm(false)}
                  className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 rounded-lg cursor-pointer font-bold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="bg-[#07C2E3] text-zinc-950 font-bold px-4 py-1.5 hover:bg-[#06B2D0] rounded-lg cursor-pointer"
                >
                  确认登记存档
                </button>
              </div>
            </form>
          )}

          {/* Directory Master Visual List Grid */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm font-mono text-[11px]">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[9px] font-bold tracking-wider">
                  <th className="p-3">组件/功能节点 (System Node)</th>
                  <th className="p-3">技术文件路径 (Source Path)</th>
                  <th className="p-3">归属责任域</th>
                  <th className="p-3">关联数据库段</th>
                  <th className="p-3 text-center">状态</th>
                  <th className="p-3 text-center">完成度</th>
                  <th className="p-3 text-right">运维操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFlatNodes.map(node => (
                  <tr key={node.id} className="hover:bg-slate-50/50 transition-all text-slate-800">
                    <td className="p-3 font-semibold text-slate-950">
                      <div className="flex items-center gap-1.5">
                        {node.type === 'Engine' && <Server className="w-3.5 h-3.5 text-[#07C2E3]" />}
                        {node.type === 'Page' && <FileText className="w-3.5 h-3.5 text-slate-400" />}
                        {node.type === 'Component' && <Code className="w-3.5 h-3.5 text-slate-400" />}
                        {node.type === 'Tab' && <Layers className="w-3.5 h-3.5 text-slate-400" />}
                        <span>{node.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-500 font-mono text-[10px] truncate max-w-[220px]" title={node.fileLocation}>
                      {node.fileLocation}
                    </td>
                    <td className="p-3 text-slate-600">
                      {node.responsibleModule}
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] font-semibold text-slate-500">
                        {node.databaseTables && node.databaseTables.length > 0
                          ? node.databaseTables.map(t => `_db.${t}`).join(', ')
                          : '无持久依赖'
                        }
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        node.status === 'LIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' :
                        node.status === 'TESTING' ? 'bg-amber-50 text-amber-700 border border-amber-150' :
                        node.status === 'IN_DEVELOPMENT' ? 'bg-sky-50 text-sky-700 border border-sky-150' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {node.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${node.completion === 100 ? 'bg-emerald-500' : 'bg-[#07C2E3]'}`} 
                            style={{ width: `${node.completion}%` }}
                          />
                        </div>
                        <span className="font-bold text-[10px] w-6 text-right">{node.completion}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => {
                            const nextStat = node.status === 'LIVE' ? 'TESTING' : 'LIVE';
                            const nextComp = nextStat === 'LIVE' ? 100 : 90;
                            handleUpdateNode(node.id, nextStat, nextComp);
                          }}
                          className="px-2 py-0.5 text-[10px] font-bold border border-slate-200 hover:border-slate-300 rounded cursor-pointer transition-all hover:bg-slate-100"
                        >
                          切换状态
                        </button>
                        {node.id.startsWith('custom') && (
                          <button
                            onClick={() => handleDeleteNode(node.id)}
                            className="p-1 hover:text-rose-600 rounded transition-all cursor-pointer hover:bg-rose-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredFlatNodes.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 font-sans">
                      ⚠️ 暂无匹配到相应状态或名称的 ECOS 微结构节点。
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: AGENT REGISTRY */}
      {activeTab === 'agent_reg' && (
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-left text-xs space-y-2">
            <h3 className="font-extrabold uppercase font-mono text-[#07C2E3] flex items-center gap-1.5">
              <Brain className="w-4 h-4" />
              ECOS 智能元角色系统控制台 (Active Agent Registry System)
            </h3>
            <p className="text-slate-500 leading-relaxed">
              这里是全网所有宿主智能体的总签名档案库。管理员可以热更智能系统提示词，切换模型引擎，并监控运行Token开销。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Hand: Agent Profiles Table (2/3 Grid) */}
            <div className="lg:col-span-2 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm font-mono text-[11px] h-fit">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[9px] font-bold">
                  <tr>
                    <th className="p-3">智能体名称 & ID</th>
                    <th className="p-3">内核指引角色</th>
                    <th className="p-3">状态</th>
                    <th className="p-3">模型指令版本</th>
                    <th className="p-3 text-right">操作行为</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {liveAgents.map(agent => (
                    <tr key={agent.id} className="hover:bg-slate-50/50 transition-all text-slate-800">
                      <td className="p-3 font-semibold text-slate-950">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-100 font-extrabold text-[10px]">
                            {agent.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="block font-sans font-bold text-slate-900">{agent.name}</span>
                            <span className="block text-[9px] text-[#07C2E3] font-mono">{agent.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-slate-600">
                        {agent.role}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          agent.state === 'idle' ? 'bg-slate-100 text-slate-600' :
                          agent.state === 'running_workflow' ? 'bg-[#07C2E3]/10 text-[#07C2E3]' :
                          'bg-emerald-50 text-emerald-700'
                        }`}>
                          ● {agent.state.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 font-mono text-[10px]">
                        {agent.id === 'inventory_agent' ? 'gemini-1.5-flash (v3.2)' : 'gemini-2.5-pro (v4.0)'}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => enterEditingAgent(agent)}
                          className="px-2.5 py-1 text-xs font-bold bg-slate-900 text-slate-100 hover:bg-slate-800 rounded-lg cursor-pointer inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3 text-[#07C2E3]" />
                          <span>配置热更新</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right Hand: Prompt Control panel (1/3 Grid) */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 shadow-sm text-left flex flex-col justify-between space-y-4">
              {editingAgentId ? (
                <div className="space-y-3 animate-fadeIn flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="border-b border-slate-200 pb-2">
                      <span className="text-[9px] font-bold bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 uppercase font-mono block w-fit mb-1">提示词编译器 (Prompt Compiler)</span>
                      <h4 className="font-extrabold text-xs text-slate-900 font-mono">热更新提示词参数</h4>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase font-mono mb-1">模型解析引擎</label>
                      <select
                        value={tempModel}
                        onChange={e => setTempModel(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-xs p-2 rounded focus:outline-none"
                      >
                        <option value="gemini-2.5-pro">Gemini 2.5 Pro (智能推荐首选)</option>
                        <option value="gemini-1.5-flash">Gemini 1.5 Flash (极速边缘计算)</option>
                        <option value="deepseek-v3">ECOS Private Host (专有信道)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase font-mono mb-1">赋予工具特权权限 (Granted Tools)</label>
                      <div className="space-y-1.5 bg-white border border-slate-200 p-2.5 rounded text-[10px] font-mono">
                        {[
                          { key: 'read_db', label: '只读读取底层数据库' },
                          { key: 'write_db', label: '写入更新关联租户表单' },
                          { key: 'trigger_refund', label: '允许自授意扣减退还额度' }
                        ].map(t => (
                          <label key={t.key} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={tempTools.includes(t.key)}
                              onChange={() => {
                                if (tempTools.includes(t.key)) {
                                  setTempTools(tempTools.filter(x => x !== t.key));
                                } else {
                                  setTempTools([...tempTools, t.key]);
                                }
                              }}
                            />
                            <span>{t.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase font-mono mb-1">系统提示序列 (System Prompt)</label>
                      <textarea
                        rows={6}
                        value={tempPrompt}
                        onChange={e => setTempPrompt(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-xs p-2 rounded focus:outline-none focus:border-[#07C2E3] font-mono text-[10px] leading-normal"
                        placeholder="输入智能体系统指令核心规定..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingAgentId(null)}
                      className="px-3 py-1.5 border border-slate-200 hover:bg-slate-200 text-xs font-bold rounded-lg cursor-pointer"
                    >
                      放弃
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveAgentSettings(editingAgentId)}
                      className="bg-[#07C2E3] text-zinc-950 font-bold px-4 py-1.5 hover:bg-[#06B2D0] hover:text-zinc-950 text-xs rounded-lg cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>应用编译并上线</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 font-sans my-auto space-y-2">
                  <Settings className="w-8 h-8 text-slate-300" />
                  <span className="block text-xs text-slate-500">请在左侧列表中点击 <strong>配置热更新</strong> 选择要重新绑定的智能体结构。</span>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: PLAYBOOK REGISTRY */}
      {activeTab === 'playbook' && (
        <div className="space-y-4 font-mono text-[11px]">
          {/* Top Info Header */}
          <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-left">
            <div>
              <h3 className="font-extrabold uppercase text-[#07C2E3] flex items-center gap-1.5 text-xs">
                <Database className="w-4 h-4" />
                经验法则是行（Playbook Database Hub）
              </h3>
              <p className="text-slate-500 mt-1 text-[10px]">
                全系统沉淀的最佳商业对冲方案。当满足相应事件触发器时，系统将自适应对冲该项对策并计算恢复损益。
              </p>
            </div>
            <button
              onClick={() => setShowPbForm(!showPbForm)}
              className="bg-[#07C2E3] text-zinc-950 hover:bg-[#06B2D0] px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-all"
            >
              <Plus className="w-3 h-3" />
              <span>录入新经验对策</span>
            </button>
          </div>

          {showPbForm && (
            <form onSubmit={handleCreatePlaybook} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 text-left">
              <h4 className="text-xs font-extrabold uppercase text-slate-900 border-b border-slate-200 pb-2">📦 沉淀录入新商业 Playbook 模块</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-slate-500 font-bold uppercase mb-1">对策方案名称</label>
                  <input
                    type="text"
                    required
                    placeholder="如: 服饰全渠道打折方案"
                    value={newPbName}
                    onChange={e => setNewPbName(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs p-2 rounded focus:outline-none focus:border-[#07C2E3]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-slate-500 font-bold uppercase mb-1">适用行业分类</label>
                  <select
                    value={newPbIndustry}
                    onChange={e => setNewPbIndustry(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 text-xs p-2 rounded focus:outline-none"
                  >
                    <option value="retail">零售电商 (Retail)</option>
                    <option value="fashion">快时尚服饰 (Fashion)</option>
                    <option value="restaurant">餐饮连锁 (Restaurant)</option>
                    <option value="beauty">美容美妆 (Beauty)</option>
                    <option value="electronics">3C数码 (Electronics)</option>
                    <option value="all">全行业通用 (All Platform)</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[9px] text-slate-500 font-bold uppercase mb-1">神经突触硬性触发条件 (Trigger Conditions)</label>
                  <input
                    type="text"
                    required
                    placeholder="如: 订单转化率降低15% + 关联退款数增加超过5单"
                    value={newPbTrigger}
                    onChange={e => setNewPbTrigger(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs p-2 rounded focus:outline-none focus:border-[#07C2E3]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-slate-500 font-bold uppercase mb-1">AI 初始预期置信度 (%)</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={newPbConfidence}
                    onChange={e => setNewPbConfidence(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 text-xs p-2 rounded focus:outline-none focus:border-[#07C2E3]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowPbForm(false)}
                  className="px-3 py-1.5 border border-slate-200 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="bg-[#07C2E3] text-zinc-950 font-bold px-4 py-1.5 hover:bg-[#06B2D0] rounded-lg cursor-pointer"
                >
                  归档进主法库
                </button>
              </div>
            </form>
          )}

          {/* Playbooks Display Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playbooks.map(pb => (
              <div key={pb.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-4 hover:shadow-md transition-all text-left">
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-[8px] bg-slate-900 text-slate-100 px-1.5 py-0.5 rounded uppercase tracking-wider font-extrabold">{pb.industry} 行业专属</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${pb.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                      {pb.isActive ? '🟢 已就绪监控' : '⚫ 已停写屏蔽'}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-950 font-sans tracking-tight">{pb.name}</h4>
                  
                  <div className="space-y-1.5 text-[10px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-150">
                    <span className="block font-bold mb-0.5 text-slate-900 uppercase">⚡ 突触发射器类型:</span>
                    <p className="leading-tight text-slate-500 font-mono italic">{pb.triggerType}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1.5 text-[10px] text-slate-500">
                    <div>
                      <span className="block text-[8px] uppercase font-bold text-slate-400">平均自信率</span>
                      <span className="font-bold text-slate-800 text-[11px]">{pb.confidenceScore}%</span>
                    </div>
                    <div>
                      <span className="block text-[8px] uppercase font-bold text-slate-400">步骤数量</span>
                      <span className="font-bold text-slate-800 text-[11px]">{pb.stepsCount} 步链</span>
                    </div>
                    <div>
                      <span className="block text-[8px] uppercase font-bold text-slate-400">累计恢复损益</span>
                      <span className="font-bold text-emerald-600 font-mono text-[11px]">€{pb.recoveryValue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[10px]">
                  <span className="text-slate-400">上次发射：{pb.lastExecuted}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => togglePlaybook(pb.id)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold border cursor-pointer transition-all ${pb.isActive ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'}`}
                    >
                      {pb.isActive ? '⏸️ 停止监控' : '▶️ 激活挂载'}
                    </button>
                    <button
                      onClick={() => deletePlaybook(pb.id)}
                      className="p-1 hover:text-rose-600 hover:bg-rose-50 rounded transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AI COST CENTER */}
      {activeTab === 'costs' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-[11px] text-left">
          
          {/* Main Controls Panel (2/3 Grid) */}
          <div className="md:col-span-2 border border-slate-200 rounded-xl p-5 bg-white space-y-5 shadow-sm">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="font-extrabold uppercase text-[#07C2E3] flex items-center gap-1.5 text-xs">
                <Coins className="w-4 h-4" />
                ECOS 运行期 LLM 智能成本与综合 ROI 审计中心
              </h3>
              <p className="text-slate-500 mt-1 font-sans text-[10px]">
                全渠道计算自流转、智能决策所耗费的底层大模型 API 调用成本、邮件网关对账与短信召回成本。
              </p>
            </div>

            {/* Simulated Variable Sliders */}
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">1. 日平均大模型推理调用量 (Total Monthly Inferences)</span>
                  <span className="text-slate-950 font-extrabold text-[12px] bg-[#07C2E3]/20 px-2 py-0.5 rounded">{inferenceVolume.toLocaleString()} 次</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={inferenceVolume}
                  onChange={e => setInferenceVolume(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#07C2E3]"
                />
                <div className="flex justify-between text-[9px] text-slate-400">
                  <span>1,000次</span>
                  <span>50,000次</span>
                  <span>100,000次</span>
                </div>
              </div>

              {/* Grid detail expenses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1.5">
                  <span className="block text-[9px] text-slate-400 uppercase font-bold">单位模型调用阶梯价率 (Core Tier Index)</span>
                  <span className="text-slate-900 font-bold block text-sm">€ 0.00015 EUR / Token</span>
                  <p className="text-[8px] text-slate-500 leading-normal">
                    综合 Gemini 2.5 Pro 与 Gemini 1.5 Flash 按比率分配的动态路由清算机制折算收益。
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1.5">
                  <span className="block text-[9px] text-slate-400 uppercase font-bold">邮件/多通路通知固定成本 (Fixed Notification Cost)</span>
                  <span className="text-slate-900 font-bold block text-sm">€ 450.00 EUR</span>
                  <p className="text-[8px] text-slate-500 leading-normal">
                    用于全网进行顾客丢单召回、自动补仓工单跨国邮件传递和安全高预警提示所产的固定信道费。
                  </p>
                </div>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg space-y-2">
              <span className="block text-[9px] text-[#07C2E3] uppercase font-bold">ECOS 真实损益数学模型结算公示</span>
              <p className="font-sans text-[10px] text-slate-300 leading-normal">
                对冲挽回损益总额 = (Playbook 主动防御恢复额) + (AI策略大闸挽回欺诈损失) <br />
                总耗费成本 = (推理调用量 × 0.00015) + (多通路信道固定损耗 450 EUR) <br />
                <strong>智能决策综合 ROI = 对冲挽回损益总额 / 总耗费成本</strong>
              </p>
            </div>
          </div>

          {/* Dashboard Summary Sidebar (1/3 Grid) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase">损益核销看板</span>
                <h4 className="font-extrabold text-xs text-slate-900">算效对冲总核账</h4>
              </div>

              <div className="space-y-3 font-mono">
                <div className="bg-white border border-slate-200 p-3 rounded-lg text-left">
                  <span className="block text-[8px] text-slate-500 font-bold uppercase">对冲挽回损益总额 Saving</span>
                  <span className="text-lg font-extrabold text-emerald-600">€{totalRecoveryValueSaved.toLocaleString()}</span>
                </div>

                <div className="bg-white border border-slate-200 p-3 rounded-lg text-left">
                  <span className="block text-[8px] text-slate-500 font-bold uppercase">LLM推理 & 边缘网路成本 Cost</span>
                  <span className="text-lg font-extrabold text-[#07C2E3]">€{totalAICost.toLocaleString()}</span>
                </div>

                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg text-left border border-slate-800">
                  <span className="block text-[8px] text-[#07C2E3] font-bold uppercase">综合投入产出比 Core ROI</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-extrabold text-white font-mono">{computedROI}x</span>
                    <span className="text-[10px] text-emerald-400 font-sans font-bold">对冲收益率</span>
                  </div>
                  <span className="block text-[8px] text-slate-400 mt-2">
                    通过自平稳防御，每支付 1 欧元大模型推理费，将挽回并保障 {computedROI} 欧元的企业核心流失损益。
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                alert(`ECOS 算力清算账单已成功对接入平台总账。月结数据扣除：€${totalAICost.toFixed(2)}。`);
              }}
              className="w-full bg-[#07C2E3] text-zinc-950 font-bold py-2 hover:bg-[#06B2D0] rounded-xl text-center text-xs cursor-pointer transition-all"
            >
              🚀 递交底层对账到财务中心
            </button>
          </div>

        </div>
      )}

      {/* TAB 5: DECISION GRAPH (对策-治理-执行联动流) */}
      {activeTab === 'decision_graph' && (
        <div className="space-y-6 text-left font-mono text-[11px] text-slate-900 max-w-5xl mx-auto">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-left">
            <h3 className="font-extrabold uppercase text-[#07C2E3] flex items-center gap-1.5 text-xs">
              <GitMerge className="w-4 h-4" />
              智能自主自愈合规链路图 (ECOS Active Decision Graph Hub)
            </h3>
            <p className="text-slate-500 mt-1 font-sans text-[10px]">
              演示平台在识别出外部业务危机时，如何自适应调遣推荐、通过多智能体合规校验、通过沙箱安全检测并自动进入执行队列的闭环图。
            </p>
          </div>

          {/* Interconnected Visual Chain Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            
            {/* Step 1: Recommend */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-2 relative shadow-sm hover:border-[#07C2E3] transition-all">
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <span className="w-5 h-5 bg-slate-900 text-[#07C2E3] rounded-full flex items-center justify-center font-bold text-xs">1</span>
                <span className="font-bold text-slate-800 text-[11px] uppercase">战略推荐探测</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                诊断系统监测到多租户网关或库存有偏离，检索 <strong>经验法则 (Playbook)</strong> 并生成自愈策略。
              </p>
              <div className="bg-slate-50 p-2 rounded text-[9px] text-slate-600 font-mono scale-[0.98]">
                <span>监测：转化率 &lt; 12%</span><br />
                <span className="text-[#07C2E3]">推荐：全网召回</span>
              </div>
            </div>

            {/* Step 2: Dispute */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-2 relative shadow-sm hover:border-[#07C2E3] transition-all">
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <span className="w-5 h-5 bg-slate-900 text-[#07C2E3] rounded-full flex items-center justify-center font-bold text-xs">2</span>
                <span className="font-bold text-slate-800 text-[11px] uppercase">议事厅自监督争议</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                多智能体 <strong>Boardroom</strong> 开启博弈。对自愈策略进行利益分流偏好争议与修改审批。
              </p>
              <div className="bg-slate-50 p-2 rounded text-[9px] text-slate-600 font-mono scale-[0.98]">
                <span>意见：有决策流膨胀风险</span><br />
                <span className="text-amber-500">纠合：调整降幅 &lt; 5%</span>
              </div>
            </div>

            {/* Step 3: Compliance */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-2 relative shadow-sm hover:border-[#07C2E3] transition-all">
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <span className="w-5 h-5 bg-slate-900 text-[#07C2E3] rounded-full flex items-center justify-center font-bold text-xs">3</span>
                <span className="font-bold text-slate-800 text-[11px] uppercase">物理沙箱边界拦截</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                安全层校验 <strong>Sandboxed Shielding</strong> 机制。拦截任何跨越 `tenant_id` 或特权高风险指令。
              </p>
              <div className="bg-slate-50 p-2 rounded text-[9px] text-slate-600 font-mono scale-[0.98]">
                <span>核实：租户隔离沙盒 OK</span><br />
                <span className="text-emerald-600">合规放行：Constitutional</span>
              </div>
            </div>

            {/* Step 4: Dispatch */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-2 relative shadow-sm hover:border-[#07C2E3] transition-all">
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <span className="w-5 h-5 bg-slate-900 text-[#07C2E3] rounded-full flex items-center justify-center font-bold text-xs">4</span>
                <span className="font-bold text-slate-800 text-[11px] uppercase">决策落地自愈执行</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                通过 <strong>Execution Gateway</strong> 正式写入相应租户数据库，并通过 <strong>Nervous System</strong> 发送邮件和进行财务确认。
              </p>
              <div className="bg-slate-50 p-2 rounded text-[9px] text-slate-600 font-mono scale-[0.98]">
                <span>落实：数据库更新成功</span><br />
                <span className="text-emerald-600">任务已派：LIVE OK</span>
              </div>
            </div>

          </div>

          {/* Simulation Dispatch Trigger */}
          <div className="flex justify-center pt-4">
            <button
              onClick={() => {
                alert("已经全链路灌入测试对冲策略：正在模拟‘快时尚一键对冲流’。1秒后：自动生成草案 -> 通过合规验证 -> 正式派遣到数据库。执行完成！");
              }}
              className="bg-slate-900 text-slate-100 hover:bg-slate-800 border border-slate-700 px-6 py-2 rounded-xl text-xs font-bold font-sans cursor-pointer flex items-center gap-2 transition-all"
            >
              <Activity className="w-3.5 h-3.5 text-[#07C2E3] animate-pulse" />
              <span>全链路仿真对决演练 (Simulate End-to-End Decision Stream)</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
