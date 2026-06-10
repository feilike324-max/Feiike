import React, { useState, useMemo } from 'react';
import { 
  Bot, Network, Activity, Database, Sliders, Check, HelpCircle,
  BarChart3, Send, ShieldAlert, FileText, AlertTriangle, Play, Pause, Trash, ArrowRight, Plus, Terminal
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface IntelligenceCenterProps {
  tenants: any[];
  onAddSystemLog: (module: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  agentsList: any[];
  setAgentsList: React.Dispatch<React.SetStateAction<any[]>>;
  workflows: any[];
  setWorkflows: React.Dispatch<React.SetStateAction<any[]>>;
  failureCases: any[];
  setFailureCases: React.Dispatch<React.SetStateAction<any[]>>;
  automations: any[];
  setAutomations: React.Dispatch<React.SetStateAction<any[]>>;
  kbFiles: any[];
  setKbFiles: React.Dispatch<React.SetStateAction<any[]>>;
  rules: any[];
  setRules: React.Dispatch<React.SetStateAction<any[]>>;
  events: any[];
  setEvents: React.Dispatch<React.SetStateAction<any[]>>;
  tasksList: any[];
  setTasksList: React.Dispatch<React.SetStateAction<any[]>>;
  
  // State from parent
  aiOpsSubTab: 'agents' | 'workflows' | 'automations' | 'kb' | 'rules' | 'events' | 'tasks' | 'monitor' | 'commander';
  setAiOpsSubTab: (tab: 'agents' | 'workflows' | 'automations' | 'kb' | 'rules' | 'events' | 'tasks' | 'monitor' | 'commander') => void;
  
  // Handlers from parent to trigger state triggers directly
  handleCreateFailureCase: (e: React.FormEvent) => void;
  newFcTitle: string;
  setNewFcTitle: (s: string) => void;
  newFcLoss: string;
  setNewFcLoss: (s: string) => void;
  newFcSymptom: string;
  setNewFcSymptom: (s: string) => void;
  newFcRule: string;
  setNewFcRule: (s: string) => void;
  
  handleCreateAutomationRule: (e: React.FormEvent) => void;
  newAutoTrigger: string;
  setNewAutoTrigger: (s: string) => void;
  newAutoAction: string;
  setNewAutoAction: (s: string) => void;
  newAutoCondition: string;
  setNewAutoCondition: (s: string) => void;
  
  handleCreateKbFile: (e: React.FormEvent) => void;
  newKbName: string;
  setNewKbName: (s: string) => void;
  newKbScope: string;
  setNewKbScope: (s: string) => void;

  globalAIChatMessages: any[];
  setGlobalAIChatMessages: React.Dispatch<React.SetStateAction<any[]>>;
  globalAIChatInput: string;
  setGlobalAIChatInput: (s: string) => void;
  isGlobalAIThinking: boolean;
  setIsGlobalAIThinking: (b: boolean) => void;

  // External tab transitions if requested by chat
  onNavigateToSubTab?: (subTab: string) => void;
  setSelectedTable?: (table: any) => void;
}

export default function IntelligenceCenter({
  tenants,
  onAddSystemLog,
  agentsList,
  setAgentsList,
  workflows,
  setWorkflows,
  failureCases,
  setFailureCases,
  automations,
  setAutomations,
  kbFiles,
  setKbFiles,
  rules,
  setRules,
  events,
  setEvents,
  tasksList,
  setTasksList,
  
  aiOpsSubTab,
  setAiOpsSubTab,
  
  handleCreateFailureCase,
  newFcTitle,
  setNewFcTitle,
  newFcLoss,
  setNewFcLoss,
  newFcSymptom,
  setNewFcSymptom,
  newFcRule,
  setNewFcRule,
  
  handleCreateAutomationRule,
  newAutoTrigger,
  setNewAutoTrigger,
  newAutoAction,
  setNewAutoAction,
  newAutoCondition,
  setNewAutoCondition,
  
  handleCreateKbFile,
  newKbName,
  setNewKbName,
  newKbScope,
  setNewKbScope,

  globalAIChatMessages,
  setGlobalAIChatMessages,
  globalAIChatInput,
  setGlobalAIChatInput,
  isGlobalAIThinking,
  setIsGlobalAIThinking,

  onNavigateToSubTab,
  setSelectedTable
}: IntelligenceCenterProps) {

  // ------------------- Performance data for rendering chart -------------------
  const monitorPerformanceData = useMemo(() => {
    const data = [];
    const baseHour = 14; 
    for (let i = 11; i >= 0; i--) {
      const hourVal = (baseHour - i + 24) % 24;
      const hourStr = `${hourVal.toString().padStart(2, '0')}:00`;
      
      const isBusinessHour = hourVal >= 9 && hourVal <= 18;
      const baseTasks = isBusinessHour ? 190 : 105;
      const tasks = Math.floor(baseTasks + Math.sin(i * 1.1) * 35 + Math.random() * 15);
      const latency = Math.floor((isBusinessHour ? 190 : 130) + Math.cos(i * 0.9) * 18 + Math.random() * 10);
      
      data.push({
        time: hourStr,
        tasks,
        latency,
      });
    }
    return data;
  }, []);

  const totalAutomationsRunCount = useMemo(() => {
    return automations.reduce((sum, item) => sum + item.runs, 0);
  }, [automations]);

  return (
    <div className="space-y-6 text-left animate-fadeIn">
      
      {/* 1. Header with Core Telemetries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">系统智脑状态 (Core AI Status)</span>
          <p className="text-lg font-black text-[#07C2E3] mt-1 font-mono">🧠 ONLINE</p>
          <span className="text-[9px] text-slate-500 font-mono mt-1">集群连接可用性 100%</span>
        </div>
        <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">并发自动决策 (Total Runs)</span>
          <p className="text-lg font-black text-white mt-1 font-mono">{totalAutomationsRunCount} Runs</p>
          <span className="text-[9px] text-slate-500 font-mono mt-1">本日自动调度匹配频数</span>
        </div>
        <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-850 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">已沙箱隔离租户 (Tenants Isolated)</span>
          <p className="text-lg font-black text-white mt-1 font-mono">{tenants.filter(t => t.status === 'active').length} active / {tenants.length} total</p>
          <span className="text-[9px] text-slate-500 font-mono mt-1">Tenant-ID 数据物理护航</span>
        </div>
        <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">规则防穿透拦截率 (Sec Net)</span>
          <p className="text-lg font-black text-emerald-400 mt-1 font-mono">100.00%</p>
          <span className="text-[9px] text-slate-500 font-mono mt-1">防止跨库/跨租户流失渗透</span>
        </div>
      </div>

      {/* 2. Sub-tab Bar Navigation */}
      <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 overflow-x-auto gap-1">
        <button
          onClick={() => setAiOpsSubTab('agents')}
          className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${aiOpsSubTab === 'agents' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Bot className="w-3.5 h-3.5 text-[#07C2E3]" />
          <span>🧠 智能体管理</span>
        </button>
        <button
          onClick={() => setAiOpsSubTab('workflows')}
          className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${aiOpsSubTab === 'workflows' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Network className="w-3.5 h-3.5 text-indigo-500" />
          <span>🔄 工作流管理</span>
        </button>
        <button
          onClick={() => setAiOpsSubTab('automations')}
          className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${aiOpsSubTab === 'automations' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Activity className="w-3.5 h-3.5 text-emerald-500" />
          <span>⚡ 自动化管理</span>
        </button>
        <button
          onClick={() => setAiOpsSubTab('kb')}
          className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${aiOpsSubTab === 'kb' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Database className="w-3.5 h-3.5 text-blue-500" />
          <span>📚 知识库管理</span>
        </button>
        <button
          onClick={() => setAiOpsSubTab('rules')}
          className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${aiOpsSubTab === 'rules' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Sliders className="w-3.5 h-3.5 text-amber-500" />
          <span>📏 规则管理</span>
        </button>
        <button
          onClick={() => setAiOpsSubTab('events')}
          className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${aiOpsSubTab === 'events' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Network className="w-3.5 h-3.5 text-[#07C2E3]" />
          <span>📡 事件中心</span>
        </button>
        <button
          onClick={() => setAiOpsSubTab('tasks')}
          className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${aiOpsSubTab === 'tasks' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Check className="w-3.5 h-3.5 text-indigo-600" />
          <span>✅ 任务中心</span>
        </button>
        <button
          onClick={() => setAiOpsSubTab('monitor')}
          className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${aiOpsSubTab === 'monitor' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
          <span>📈 运行监控</span>
        </button>
        <button
          onClick={() => setAiOpsSubTab('commander')}
          className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${aiOpsSubTab === 'commander' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Bot className="w-3.5 h-3.5 text-rose-500" />
          <span>💬 AI 指挥官</span>
        </button>
      </div>

      {/* 3. Conditional Subtab Renderers */}

      {/* -------------------- Tab: 智能体 (Agents) -------------------- */}
      {aiOpsSubTab === 'agents' && (
        <div className="space-y-6 animate-fadeIn text-left">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">智能体列表及其全网生命控制 (Core AI Agents Status)</h4>
                <p className="text-[10px] text-slate-400 mt-1">控制及配置平台常驻 AI 雇员，每一项自主运行数据、异常拦截与决策分析均带有严格的租户物理区隔链护航。</p>
              </div>
              <span className="font-mono text-xs text-slate-400">Total: {agentsList.length} Online</span>
            </div>

            <div className="overflow-x-auto text-xs font-semibold">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b text-slate-500">
                    <th className="p-3">Agent 角色标识符 / ID</th>
                    <th className="p-3">驱动模型版本</th>
                    <th className="p-3 text-center">累计运行 (本周期)</th>
                    <th className="p-3">单次指令平均响应</th>
                    <th className="p-3">状态</th>
                    <th className="p-3 text-center">指令调配与交互</th>
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
                      <td className="p-3 font-sans">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${a.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100 animate-pulse' : 'bg-slate-100 text-slate-500 border'}`}>
                          {a.status === 'Active' ? '🟢 RAG_ONLINE' : '⚪ SYSTEM_OFFLINE'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              onAddSystemLog('AI大脑中心', '重启模型', `重启智能大脑 ${a.name}，清理上下文缓冲区`, 'info');
                              alert(`已成功清除智能体「${a.name}」在本地 RAG 运行环境中的多租户内存上下文，模型重置加载完毕。`);
                            }}
                            className="bg-slate-50 hover:bg-slate-100 text-slate-850 hover:text-slate-950 border border-slate-200 font-bold text-[10px] px-2.5 py-1.5 rounded transition-all cursor-pointer"
                          >
                            🔄 重启
                          </button>
                          <button
                            onClick={() => {
                              const updated = agentsList.map(item => {
                                if (item.id === a.id) {
                                  const nextStatus = item.status === 'Active' ? 'Disabled' : 'Active';
                                  onAddSystemLog('AI大脑中心', nextStatus === 'Active' ? '激活代理' : '停用代理', `更变智能体 「${a.name}」状态为 ${nextStatus}`, nextStatus === 'Active' ? 'success' : 'warning');
                                  return { ...item, status: nextStatus };
                                }
                                return item;
                              });
                              setAgentsList(updated);
                            }}
                            className={`font-bold text-[10px] px-2.5 py-1.5 rounded border transition-all cursor-pointer ${a.status === 'Active' ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'}`}
                          >
                            {a.status === 'Active' ? '🚨 挂起停用' : '🔓 下派执行'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- Tab: 工作流 (Workflows & Failure cases) -------------------- */}
      {aiOpsSubTab === 'workflows' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 p-4 rounded-xl text-xs font-bold leading-relaxed">
            ⚙️ 系统工作流拓扑拓补图 (Active Topologies)：每个商户都可以安装公共工作流，或利用开发者 SDK 注册新拓扑。点击「运行测试执行流」可产生一笔不影响商户资产的仿真流量对账流。
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workflows.map(wf => (
              <div key={wf.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between font-sans">
                <div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2">
                    <span className="font-bold text-slate-800 text-xs">{wf.name}</span>
                    <span className={`w-2 h-2 rounded-full ${wf.active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">{wf.description}</p>
                  
                  {/* Steps indicator */}
                  <div className="mt-3.5 space-y-1">
                    <p className="text-[9px] text-slate-400 font-extrabold uppercase">拓扑流经节点 ({wf.steps.length}):</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {wf.steps.map((st, sidx) => (
                        <span key={sidx} className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-150">
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 font-bold">
                    <span>流程格式: YAML Topology</span>
                    <span>累计触发: {wf.executionCount}次</span>
                  </div>
                  
                  <button 
                    type="button"
                    onClick={() => {
                      onAddSystemLog('Workflow Engine', '测试执行流', `对「${wf.name}」下发全链路仿针对账流量`, 'info');
                      alert(`【拓扑流测试就绪】\n- 本地沙盒对账运行正常，流经节点 ${wf.steps.length} 个均已通过签字核算，未产生实体资金交付。`);
                    }}
                    className="w-full text-center py-1.5 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-indigo-600 font-bold text-[10px] cursor-pointer font-sans"
                  >
                    下派测试仿真流量流
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RAG Failure Cases sandzone */}
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                <span>📑 RAG 失败案例反省事故库 (Failure Learning & RAG Feedback Cases)</span>
                <span className="text-[9px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded font-mono font-black border border-red-500/20">TOTAL: {failureCases.length}</span>
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">收集整个 SaaS 平台在经营决策、防套汇、海运清关中产生的故障与异常。自动对齐 RAG 底座，避免智能体重复在同一个大宗场景踩坑。</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {failureCases.map(fc => (
                <div key={fc.id} className="p-4 bg-slate-50 border border-slate-150 rounded-xl text-xs space-y-2 hover:border-slate-305 transition-colors flex flex-col justify-between font-sans">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                        <span>【{fc.caseCode}】 {fc.title}</span>
                      </span>
                      <span className="font-mono font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 rounded-sm text-[9.5px]">损失: {fc.lossAmount}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200 mt-2 select-text">
                      <span className="font-extrabold text-slate-700">现象：</span>{fc.symptom}
                    </p>
                  </div>
                  <div className="flex justify-between items-center text-[9.5px] font-bold border-t border-slate-100 pt-2 mt-2">
                    <span className="text-emerald-700">🛡️ 预防规则：<span className="font-mono text-indigo-750">{fc.preventingRule}</span></span>
                    <span className="text-indigo-600 text-[10px]">隔离层: {fc.industry}</span>
                  </div>
                </div>
              ))}

              {/* Form to submit a new failure learning case */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 col-span-1 md:col-span-2 text-left font-sans">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wide block">➕ 登记并从错误反面事故中学习 (注入 RAG 向量防线)</span>
                
                <form onSubmit={handleCreateFailureCase} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 mb-1">事故简称 (Title)</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. 美容院技师重叠超载"
                      value={newFcTitle}
                      onChange={e => setNewFcTitle(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-[10px] focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 mb-1">平台预计资产流失或回吐金额 (Loss Amount)</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. $4,200 / Daily"
                      value={newFcLoss}
                      onChange={e => setNewFcLoss(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-[10px] focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[9px] font-bold text-slate-500 mb-1">异常事件与漏洞现象描述 (Symptom Context for Vectorizing)</label>
                    <textarea 
                      required
                      rows={2}
                      placeholder="请还原该特定场景中出现的决策失效、风控断层或者智能体逻辑空转闭环..."
                      value={newFcSymptom}
                      onChange={e => setNewFcSymptom(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-[10px] focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>

                  <div className="md:col-span-2 flex justify-between items-center gap-4 pt-1 flex-wrap md:flex-nowrap">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-[9px] font-bold text-slate-500 mb-1">拟强制拦截或控制的阻滞规则 ID (Preventing Rule ID)</label>
                      <input 
                        type="text"
                        placeholder="e.g. rule_limit_overlap_session"
                        value={newFcRule}
                        onChange={e => setNewFcRule(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-[10px] focus:outline-none focus:border-indigo-500 font-mono font-bold"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="bg-indigo-650 hover:bg-indigo-600 text-white font-extrabold text-[10.5px] px-6 py-2.5 rounded-lg transition-all shadow-sm shrink-0 mt-3 md:mt-0 cursor-pointer"
                    >
                      📝 确认并注入此反向对账故障
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- Tab: 自动化管理 (Automations IF-THEN) -------------------- */}
      {aiOpsSubTab === 'automations' && (
        <div className="space-y-6 animate-fadeIn text-left">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">系统级全局自动化触发引擎 (IF-THEN Rules Engine)</h4>
                <p className="text-[10px] text-slate-400 mt-1">无需任何代码，直接指定业务触发事件，由对应的多租户中继智能体进行事务流对账操作。</p>
              </div>
              <span className="font-mono text-xs text-slate-400">Total Rules: {automations.length}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {automations.map(aut => (
                <div key={aut.id} className="p-4 bg-slate-50 hover:bg-slate-100/50 rounded-xl border border-slate-200 space-y-3 font-sans transition-all">
                  <div className="flex justify-between items-center border-b border-dashed pb-2">
                    <span className={`text-[9.5px] px-2 py-0.5 rounded font-black font-mono ${aut.active ? 'bg-emerald-50 text-emerald-800 border' : 'bg-slate-100 text-slate-400'}`}>
                      {aut.active ? 'ACTIVE' : 'PAUSED'}
                    </span>
                    <button 
                      onClick={() => {
                        const updated = automations.map(item => item.id === aut.id ? { ...item, active: !item.active } : item);
                        setAutomations(updated);
                        onAddSystemLog('自动化引擎', '变更激活状态', `更改规则 ${aut.trigger} 状态为 ${!aut.active ? '激活' : '禁用'}`, aut.active ? 'warning' : 'success');
                      }}
                      className="text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer"
                    >
                      {aut.active ? '暂停规则' : '恢复激活'}
                    </button>
                  </div>
                  
                  <div className="space-y-1.5 text-xs">
                    <p className="font-extrabold text-[#07C2E3] font-mono text-[10.5px]">IF: {aut.trigger}</p>
                    <p className="font-bold text-slate-800">THEN: {aut.action}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">附加判定条件: {aut.condition}</p>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t text-[9.5px] text-slate-400 font-mono">
                    <span>上次捕获: {aut.lastRun}</span>
                    <span className="font-bold text-indigo-600">{aut.runs}次捕获</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Form to submit a new automation trigger */}
            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wide block">➕ 快速添加新的业务自动化连锁反应 (Real Automation Builder)</span>
              
              <form onSubmit={handleCreateAutomationRule} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 mb-1">事件触发源 (IF trigger context)</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. 订单支付失败发生"
                    value={newAutoTrigger}
                    onChange={e => setNewAutoTrigger(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-[10px] focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 mb-1">物理运作动作 (THEN action code)</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. 调度风控智能体进行物流追回"
                    value={newAutoAction}
                    onChange={e => setNewAutoAction(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-[10px] focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 mb-1">局部前置防护过滤条件 (Condition filter)</label>
                  <input 
                    type="text"
                    placeholder="e.g. 单笔打款数超 €500"
                    value={newAutoCondition}
                    onChange={e => setNewAutoCondition(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-[10px] focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="md:col-span-3 flex justify-end">
                  <button 
                    type="submit"
                    className="bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-950 font-black px-6 py-2 rounded-lg transition-all shadow-sm cursor-pointer"
                  >
                    🚀 部署并部署此连锁决策规则
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* -------------------- Tab: 知识库管理 (Knowledge Base / RAG Context) -------------------- */}
      {aiOpsSubTab === 'kb' && (
        <div className="space-y-6 animate-fadeIn text-left">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">向量知识库管理 (RAG Knowledge Vector Database)</h4>
                <p className="text-[10px] text-slate-400 mt-1">商铺SOP、清关法则、对账规则的分词物理索引库。智能体在回答与操作前会自动模糊关联检索该特定租户下的文档。</p>
              </div>
              <span className="font-mono text-xs text-slate-400">Total Docs: {kbFiles.length}</span>
            </div>

            <div className="overflow-x-auto text-xs font-semibold">
              <table className="w-full text-left border-collapse text-slate-700">
                <thead>
                  <tr className="bg-slate-50 border-b text-slate-500">
                    <th className="p-3">知识文件检索命名</th>
                    <th className="p-3">数据区隔与隔离层 (Scopes)</th>
                    <th className="p-3">文件大小</th>
                    <th className="p-3">矢量分块重组时间 (Vectorized)</th>
                    <th className="p-3">向量检索节点节 (Embedding Chunk)</th>
                    <th className="p-3 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {kbFiles.map(file => (
                    <tr key={file.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span>{file.name}</span>
                      </td>
                      <td className="p-3 font-extrabold text-indigo-600 block pt-4">{file.scope}</td>
                      <td className="p-3 font-mono">{file.size}</td>
                      <td className="p-3 font-mono">{file.uploadTime}</td>
                      <td className="p-3 font-mono text-emerald-700 font-bold">{file.vectorizedNodes} chunks</td>
                      <td className="p-3">
                        <div className="flex justify-center">
                          <button
                            onClick={() => {
                              onAddSystemLog('知识中心', '卸载文件', `从 RAG 缓存物理注销并卸除文件: ${file.name}`, 'warning');
                              setKbFiles(prev => prev.filter(f => f.id !== file.id));
                              alert(`已成功将「${file.name}」的所有 Embedding 二进制索引从 PostgreSQL Vector 表及 RAM 内存缓存中隔离卸载！`);
                            }}
                            className="text-rose-600 hover:text-rose-800 hover:underline text-[10px] font-bold cursor-pointer"
                          >
                            物理隔离卸除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add new vector file */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wide block">➕ 加载分词并追加 RAG 底层支撑 (Vector Background Drag-zone)</span>
              
              <form onSubmit={handleCreateKbFile} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 mb-1">SOP 或规则文件名 (name)</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. EU_Customs_SOP_Clean.txt"
                    value={newKbName}
                    onChange={e => setNewKbName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-[10px] focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 mb-1">行业隔离安全归宿域 (Data Isolation Layer)</label>
                  <select 
                    value={newKbScope}
                    onChange={e => setNewKbScope(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-[10px] focus:outline-none focus:border-indigo-500 font-bold"
                  >
                    <option value="fashion_wholesale">服饰零售行业 (Fashion Wholesale Scope)</option>
                    <option value="food_dineout">食品配餐行业 (Food Dineout Scope)</option>
                    <option value="global">全域公共范围 (Shared Tenant Background)</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex justify-between items-center bg-white p-2 border border-dashed text-slate-400 font-medium rounded-lg text-[10px]">
                  <span>拖入本地 .txt / .md / .pdf 材料，前台将执行 SHA256 签字对齐且保证数据不流失。</span>
                  <button 
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-550 text-white font-extrabold text-[10px] px-4 py-1.5 rounded cursor-pointer"
                  >
                    📝 确认并注入此反向对账故障
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- Tab: 规则管理 (Rules Engine) -------------------- */}
      {aiOpsSubTab === 'rules' && (
        <div className="space-y-6 animate-fadeIn text-left">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">平台安全规则与行为硬边界 (Rules Engine Guardrails)</h4>
                <p className="text-[10px] text-slate-400 mt-1">控制系统最底层的安全惩罚及财务上限参数。规则权重越高，系统对此事件做出的防御反应越迅速。</p>
              </div>
              <span className="font-mono text-xs text-slate-400">Rules Active: {rules.filter(r => r.active).length} / {rules.length}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {rules.map(rl => (
                <div key={rl.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between font-sans space-y-3 hover:border-slate-300 transition-all">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="font-extrabold text-slate-800 text-xs block">{rl.name}</span>
                      <span className={`w-2 h-2 rounded-full ${rl.active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono font-bold mt-1">Rule ID: {rl.id}</p>
                    <p className="text-[10.5px] text-slate-505 font-medium leading-relaxed bg-white border border-slate-100 rounded p-2.5 mt-2">
                      {rl.description}
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-2 font-mono text-[10px]">
                    <div className="flex justify-between text-slate-500">
                      <span>规则触发权重: <span className="text-indigo-600 font-bold">{rl.weight}</span></span>
                      <span>已拦截审计: {rl.count}次</span>
                    </div>
                    <div className="flex justify-between">
                      <button 
                        type="button"
                        onClick={() => {
                          const val = Number(prompt(`请输入规则 [${rl.name}] 的调整权重 (0.1 ~ 1.0):`, String(rl.weight)));
                          if (!isNaN(val) && val > 0 && val <= 1.0) {
                            const updated = rules.map(item => item.id === rl.id ? { ...item, weight: val } : item);
                            setRules(updated);
                            onAddSystemLog('规则控制', '修改权重', `调整规则 ${rl.name} 的阈值权重为 ${val}`, 'info');
                          }
                        }}
                        className="text-indigo-600 hover:underline cursor-pointer"
                      >
                        调整权重
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          const updated = rules.map(item => item.id === rl.id ? { ...item, active: !item.active } : item);
                          setRules(updated);
                          onAddSystemLog('规则控制', '变更启用状态', `更改规则 ${rl.name} 为 ${!rl.active ? '活动' : '休眠'}`, rl.active ? 'error' : 'success');
                        }}
                        className={`text-slate-500 font-extrabold hover:underline cursor-pointer ${rl.active ? 'text-rose-600' : 'text-emerald-700'}`}
                      >
                        {rl.active ? '物理熔断禁用' : '激活并挂载'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* -------------------- Tab: 事件中心 (Events Bus) -------------------- */}
      {aiOpsSubTab === 'events' && (
        <div className="space-y-6 animate-fadeIn text-left">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">系统级多路事件总线监控 (Corporate Live Event Bus)</h4>
                <p className="text-[10px] text-slate-400 mt-1">展示整个 SaaS 电商平台下，各租户、各店铺所产生并触发的所有核心事件，作为自动化的底层驱动中继。</p>
              </div>
              <span className="font-mono text-xs bg-indigo-50 text-indigo-700 border px-2 py-0.5 rounded font-bold">Event Log Hub</span>
            </div>

            <div className="overflow-x-auto text-[11px] font-semibold">
              <table className="w-full text-left border-collapse text-slate-700 font-mono">
                <thead>
                  <tr className="bg-slate-50 border-b text-slate-500 font-sans">
                    <th className="p-3">事件编码 (Event Type)</th>
                    <th className="p-3">触发隔离主体 (Source tenant)</th>
                    <th className="p-3">事件触发时间</th>
                    <th className="p-3">关联并唤醒的流水 (Workflow ID)</th>
                    <th className="p-3">处理状态 (Dispatch State)</th>
                    <th className="p-3 text-center">系统审计仿真</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {events.map((evt, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-bold text-slate-900">{evt.type}</td>
                      <td className="p-3 font-sans font-medium">{evt.source}</td>
                      <td className="p-3 text-slate-500">{evt.time}</td>
                      <td className="p-3 text-indigo-600 font-sans">{evt.workflowAttached}</td>
                      <td className="p-3 font-sans">
                        <span className={`inline-flex items-center gap-1 font-bold text-[9.5px] px-2 py-0.5 rounded-full border ${
                          evt.status === 'PROCESSED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          evt.status === 'DISPATCHED' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                          evt.status === 'BLOCKED_RISK' ? 'bg-rose-50 text-rose-700 border-rose-100 animate-pulse' : 'bg-slate-100'
                        }`}>
                          {evt.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button 
                          onClick={() => {
                            onAddSystemLog('事件总线', '一键仿真测试', `触发仿真测试事件: ${evt.type}`, 'info');
                            alert(`【事件总线对账成功】\n- 事件 [ID: ${evt.id}] 对齐租户主键，对下行流水唤醒率已校验。`);
                          }}
                          className="bg-slate-100 hover:bg-slate-200 border text-slate-700 font-bold font-sans text-[10px] px-2.5 py-1.5 rounded cursor-pointer"
                        >
                          仿真发射
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

      {/* -------------------- Tab: 任务中心 (Tasks Center) -------------------- */}
      {aiOpsSubTab === 'tasks' && (
        <div className="space-y-6 animate-fadeIn text-left">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">智能体协同执行任务中心 (Action & Automated Tasks Dispatch)</h4>
                <p className="text-[10px] text-slate-400 mt-1">展示系统智能决策出的补水、跨库调拨、营销发放等业务任务。任何动作或推荐必须经管理员「一键批准」方可物理下达！</p>
              </div>
              <span className="font-mono text-xs bg-indigo-50 text-indigo-700 border px-2 py-0.5 rounded font-bold">Awaiting Approval: {tasksList.filter(t => t.status==='WAITING_APPROVAL').length}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasksList.map(task => (
                <div key={task.id} className="p-4 bg-slate-50 border border-slate-250 hover:border-slate-350 transition-colors rounded-xl flex flex-col justify-between font-sans space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center border-b pb-1">
                      <span className="font-extrabold text-slate-900 uppercase">源智能体: <span className="text-[#07C2E3] font-mono">{task.agent}</span></span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold font-mono ${
                        task.status==='COMPLETED' ? 'bg-emerald-50 text-emerald-800 border' :
                        task.status==='RUNNING' ? 'bg-indigo-50 text-indigo-800 border animate-pulse' :
                        'bg-amber-50 text-amber-800 border'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <h5 className="font-black text-slate-800 pt-1 text-xs">任务动作描述：{task.title}</h5>
                    <div className="bg-white border rounded p-2.5 text-[10.5px] font-mono text-slate-550 leading-relaxed leading-snug">
                      <span className="font-extrabold text-slate-800">决策产物: </span>{task.output}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono border-t pt-2">
                    <span>生成时间: {task.time}</span>
                    <div className="flex items-center gap-1.5">
                      {task.status === 'WAITING_APPROVAL' ? (
                        <>
                          <button
                            onClick={() => {
                              onAddSystemLog('任务中心', '拒绝执行行为', `由于管理员拒绝，拦截动作: ${task.title}`, 'error');
                              setTasksList(prev => prev.map(t => t.id === task.id ? { ...t, status: 'REJECTED_BY_ADMIN' } : t));
                              alert('已物理硬阻断并挂起该智能任务推荐！');
                            }}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 px-2.5 py-1 rounded text-[10px] cursor-pointer"
                          >
                            物理拒绝
                          </button>
                          <button
                            onClick={() => {
                              onAddSystemLog('任务中心', '一键批准并下达', `管理员批准智能中枢流动作: ${task.title}`, 'success');
                              setTasksList(prev => prev.map(t => t.id === task.id ? { ...t, status: 'COMPLETED', output: '✔️ 大宗物理补水指令执行成功' } : t));
                              alert('【系统级决策指令已下达】\n- 任务已转入执行网路，成功修改实体库库存！');
                            }}
                            className="bg-emerald-50 hover:bg-emerald-150 text-emerald-700 font-bold border border-emerald-200 px-2.5 py-1 rounded text-[10px] cursor-pointer"
                          >
                            审查核签执行
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-400 select-none">已完成状态审查</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* -------------------- Tab: 运行监控 (Execution Monitoring Charts) -------------------- */}
      {aiOpsSubTab === 'monitor' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 text-left">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">系统级执行时延与负荷监测 (Execution Workload Telemetry)</h4>
              <p className="text-[10px] text-slate-400 mt-1">展示最近 12 小时内，各路智能体与 RAG 文本计算服务器的总负载时延及任务捕获曲线。</p>
            </div>

            {/* Performance Chart with Recharts */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monitorPerformanceData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 9 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 9 }} label={{ value: '捕获次数 (Loads)', angle: -90, position: 'insideLeft', style: {fontSize: 8} }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9 }} label={{ value: '判定延迟 (ms)', angle: 90, position: 'insideRight', style: {fontSize: 8} }} />
                  <Tooltip contentStyle={{ fontSize: '10px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="tasks" stroke="#07C2E3" name="并发触发任务" strokeWidth={2} activeDot={{ r: 4 }} />
                  <Line yAxisId="right" type="monotone" dataKey="latency" stroke="#6366f1" name="RAG 平均响应 (ms)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Terminal Live logs */}
            <div className="bg-slate-900 border rounded-xl p-4 text-left font-mono text-[9.5px] text-[#07C2E3] space-y-1">
              <span className="text-[10px] text-slate-400 block border-b border-slate-800 pb-1.5 uppercase font-sans font-extrabold tracking-widest">📋 系统智核对账日志对账 Live Pipeline</span>
              <div className="pt-2">[RAG_RESOLVER] Loading vector weights for tenant_id_1009... OK</div>
              <div>[RAG_RESOLVER] Embedding mapping accuracy 99.85% (Swiss-German segment)</div>
              <div>[SENT_INTEGRITY] Sent check: No cross-layer infiltration from other tenants.</div>
              <div>[CRON_CENTRAL] Sync scheduler active: trigger checking automations rule auto_01, auto_02.</div>
              <div>[GATE_INTEGRITY] Webhooks secure check 200 OK for Stripe API port.</div>
            </div>

          </div>
        </div>
      )}

      {/* -------------------- Tab: AI 指挥官 (Commander Stream Overlay) -------------------- */}
      {aiOpsSubTab === 'commander' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5 text-left">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span>💬 AI 智能决策指令指挥官 (Copilot Commander Center)</span>
                <span className="text-[9.5px] bg-[#07C2E3]/10 text-[#07C2E3] border border-[#07C2E3]/20 px-1.5 py-0.5 rounded font-mono font-black uppercase">Core-System-Bridge</span>
              </h4>
              <p className="text-[10px] text-slate-400 mt-1">
                通过纯自然语言会话，向智脑提出平台合规审计、退款异常或者全局跨境营销战役对账宏观命令，直接在此交互界面通过点击反馈按键跳转到对应管理单页。
              </p>
            </div>

            {/* Chat Thread Container */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-h-[350px] overflow-y-auto space-y-4 shadow-inner">
              {globalAIChatMessages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[9px] font-bold text-slate-400">
                    {msg.role === 'user' ? 'PLATFORM ADMINISTRATOR' : 'CENTRAL CORE AI / 智脑'}
                  </span>
                  <div className={`p-3.5 rounded-xl text-xs max-w-[85%] leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-slate-900 border border-slate-800 text-white font-mono' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm font-sans font-medium'
                  }`}>
                    <div className="whitespace-pre-line prose prose-slate max-w-none prose-xs leading-relaxed">
                      {msg.content}
                    </div>
                    
                    {/* Interactive Clickable buttons linking to real states/tabs */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2 pt-3 border-t border-slate-100 font-sans">
                        {msg.actions.map((act: any, aIdx: number) => (
                          <button
                            key={aIdx}
                            onClick={() => {
                              if (act.action === 'view_tenants') {
                                onNavigateToSubTab?.('tenants');
                              } else if (act.action === 'view_gateways') {
                                onNavigateToSubTab?.('gateways');
                              } else if (act.action === 'lock_risk') {
                                onAddSystemLog('风控审计', '一键硬核风控拦截', '由决策智脑快捷按键激活系统最高等级欺诈交易锁', 'success');
                                alert('瑞士高敏风控堡垒：大额跨境退款拦截机制已全面锁死部署！');
                              } else if (act.action === 'view_query_products') {
                                setSelectedTable?.('products');
                                onNavigateToSubTab?.('query');
                              } else if (act.action === 'alert_restock') {
                                onAddSystemLog('供应链对账', '自主物料平衡', '快捷按钮触发：自动对服装及五金保税仓进行配给调拨', 'info');
                                alert('配给指令已下达，成功为受阻租户调拔静态物理库存以保护周转红线。');
                              } else if (act.action === 'deploy_campaign') {
                                onAddSystemLog('运营战役', '大促联合广播', '快捷按钮触发：下发夏季全球大促通运接口广播', 'success');
                                alert('大促销营销通用 coupon 配置接口 API 已向隔离区租户广播！');
                              } else if (act.action === 'view_ai_revenue') {
                                setAiOpsSubTab('monitor');
                              } else if (act.action === 'view_ai_fraud') {
                                setAiOpsSubTab('rules');
                              }
                            }}
                            className="bg-[#07C2E3] hover:bg-[#06B2D0] hover:scale-102 hover:shadow-sm text-slate-950 font-black text-[10px] px-3 py-1.5 rounded transition-all cursor-pointer"
                          >
                            {act.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Form for commanding AI */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!globalAIChatInput.trim() || isGlobalAIThinking) return;

                const userT = globalAIChatInput;
                setGlobalAIChatMessages(prev => [...prev, { role: 'user', content: userT }]);
                setGlobalAIChatInput('');
                setIsGlobalAIThinking(true);

                onAddSystemLog('Copilot AI Commander', '发送智脑决策咨询', `管理员提问: "${userT}"`, 'info');

                setTimeout(() => {
                  setIsGlobalAIThinking(false);
                  const lowerInput = userT.toLowerCase();
                  let aiReply = '';
                  let actions: any[] = [];

                  if (lowerInput.includes('表现') || lowerInput.includes('今天') || lowerInput.includes('账期') || lowerInput.includes('流水') || lowerInput.includes('mrr')) {
                    aiReply = `**全网跨隔离区财务表现智脑对账报告 (Consolidated Intelligent Finance Scan)**

我已在后台自动归集多租户的物理沙箱，全网资金流水对账指标扫描汇总如下：
- **累计交易资金 GMV**: € 180,200.00
- **瑞士通道流失拦截率**: € 0.00 (瑞士信托结算防穿透层效果 100%)
- **跨平台 MRR 周转表现**: 五金与服饰在 Adyen 通道内的多租户 split 正常且未发生错打。`;
                    actions = [
                      { label: '查看资金结算分析 (Revenue Monitor)', action: 'view_ai_revenue' },
                      { label: '查看租户列表 (View Tenants)', action: 'view_tenants' }
                    ];
                  } else if (lowerInput.includes('漏洞') || lowerInput.includes('争议') || lowerInput.includes('退单') || lowerInput.includes('欺诈') || lowerInput.includes('风控') || lowerInput.includes('安全')) {
                    aiReply = `**交易安全防勒索与跨境多重退款事故审计 (Sec Net Fraud Audit report)**

系统安全引擎在保障 Multi-Tenant 安全上已做出如下防护判定：
- **Stripe & PayPal 指标**: 24H 内部无任何越权（Inter-tenant Infiltration）查询指令。
- **事故警声**: 曾在历史事故库中登记有 2 起跨境退汇漏洞漏失。
- **建议动作**: 建议立即一键部署硬防线风控阻窒，拦截大于 €500 跨境异常操作。`;
                    actions = [
                      { label: '部署一键强制合规拦截 (Lock Risk Force)', action: 'lock_risk' },
                      { label: '查看规则引擎拦截阈值 (View Rules)', action: 'view_ai_fraud' }
                    ];
                  } else if (lowerInput.includes('sku') || lowerInput.includes('库存') || lowerInput.includes('缺料') || lowerInput.includes('断货')) {
                    aiReply = `**全网多租户高压力 SKU 库存分析 (Consolidated SKU High Pressure Stock Alert)**

跨行业供应链健康度指数正常，但以下隔离区商铺有发生局部断货的紧急库存事件：
- 🍕 **食品配餐线**: 【热辣披萨原料】与【拿铁咖啡豆】当前全网库存低于警戒水位。
- 📦 **自动干预建议**: 建议立即下达跨仓位物理配给指令，以免阻碍店主交易转化。`;
                    actions = [
                      { label: '查看库存数据详情', action: 'view_query_products' },
                      { label: '广播一键补足调配指令', action: 'alert_restock' }
                    ];
                  } else if (lowerInput.includes('战役') || lowerInput.includes('大促') || lowerInput.includes('营销')) {
                    aiReply = `**全球联合夏季大促战役部署与配额分析 (Campaign Integration Status)**

平台联合营销代码为 \`CAMP_GLOBAL_SUMMER_2026\`，全网广播机制就绪：
- 📣 **广播状态**: API 接口就绪，已有 **6** 家活跃商户读取了大促优惠券配置。
- ⏳ **受众转化预测**: 服饰类目大促期间预期交易规模将增长 **35%+**。`;
                    actions = [
                      { label: '部署联合大促 API', action: 'deploy_campaign' }
                    ];
                  } else {
                    aiReply = `**全网决策中枢智脑响应回复 (Strategic Decision Report)**

针对提问 \`"${userT}"\`，智脑已进行平台级战略审计。全平台目前各大租户物理沙箱运作良好：
- 📊 **当前全系统 GMV**: **€ 180,200.00**，多渠道支付通道运作平稳（Stripe/Adyen/Klarna）。
- 🧠 **决策路径建议**: 推荐点击下方快捷指令或提问 ‘最近7天表现如何？’、‘退款纠纷漏洞审计’。`;
                    actions = [
                      { label: '汇总全网租户利润', action: 'view_ai_revenue' },
                      { label: '智能风控安全审计', action: 'view_ai_fraud' }
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
                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-[#07C2E3] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!globalAIChatInput.trim() || isGlobalAIThinking}
                className="bg-[#07C2E3] hover:bg-[#06B2D0] hover:scale-102 text-slate-950 font-black text-xs px-5 py-2.5 rounded-lg disabled:opacity-40 cursor-pointer transition-all shrink-0"
              >
                {isGlobalAIThinking ? '研判中...' : '对账咨询'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
