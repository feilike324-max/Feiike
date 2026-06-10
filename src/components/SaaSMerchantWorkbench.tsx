import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Users, 
  Clock, 
  ArrowRight, 
  X, 
  Package, 
  Megaphone, 
  Plus, 
  Coins,
  Brain,
  Sparkles,
  TrendingUp,
  DollarSign,
  Bot,
  Activity,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { IndustryType, ProductItem, OrderItem } from '../types';

interface SaaSMerchantWorkbenchProps {
  selectedIndustry: IndustryType;
  companyName: string;
  onUpdateCompanyName: (name: string) => void;
  products: ProductItem[];
  orders: OrderItem[];
  onAddProduct: (title: string, sku: string, stock: number, price: number) => void;
  onPopulateSampleData: () => void;
  onRestockProduct: (sku: string) => void;
  onAuditOrder: (orderId: string) => void;
  onOpenOnlineStorefront: () => void;
  addLog: (agent: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
  onSwitchTab: (tab: string) => void;
}

export default function SaaSMerchantWorkbench({
  selectedIndustry,
  companyName,
  products,
  orders,
  onAddProduct,
  onPopulateSampleData,
  onRestockProduct,
  onAuditOrder,
  onOpenOnlineStorefront,
  addLog,
  onSwitchTab
}: SaaSMerchantWorkbenchProps) {
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState(69);
  const [newStock, setNewStock] = useState(100);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic state for recent tasks to allow "real actions"
  const [recentTasks, setRecentTasks] = useState([
    { id: 'TSK-1025', name: '自动采购货源 SKU-R189', agent: '采购经理 Oliver', status: '待审核', type: 'restock', targetSku: 'SKU-R189' },
    { id: 'TSK-1026', name: '识别并拦截退款异常订单 #ORD-9839', agent: '风控智体 Stuart', status: '进行中', type: 'fraud_audit', targetOrderId: '#ORD-9839' },
    { id: 'TSK-1027', name: '自动上线 618 营销促销满减活动', agent: '市场总监 Victor', status: '就绪', type: 'marketing', targetCampaign: '618_sale' },
    { id: 'TSK-1028', name: '计算并清分欧盟增值税跨境资金账户', agent: '财务合规 Audit', status: '完成', type: 'finance', details: '已清分欧元 1,240.00' },
  ]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleAddNewSKU = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const generatedSku = `SKU-${Date.now().toString().slice(-4)}`;
    onAddProduct(newTitle, generatedSku, newStock, newPrice);
    setNewTitle('');
    setShowAddForm(false);
    addLog('System', '创建新商品', `手动注册商品「${newTitle}」, 标价 $${newPrice}, 初始库存 ${newStock}`, 'success');
    showToast(`✓ 商品「${newTitle}」成功注册上架！`);
  };

  // Click on a recent task initiates the direct execution action
  const handleExecuteTask = (taskId: string) => {
    const task = recentTasks.find(t => t.id === taskId);
    if (!task) return;

    if (task.status === '完成') {
      showToast(`✓ 任务 ${taskId} 已经完成，无需重复执行。`);
      return;
    }

    // Set status to Completed
    setRecentTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: '完成' } : t));
    addLog('AI Command Node', '执行自动化任务', `立即执行任务: ${task.name}`, 'tool');

    if (task.type === 'restock' && task.targetSku) {
      onRestockProduct(task.targetSku);
      showToast(`✓ 立即执行：已自动采购并补仓 ${task.targetSku} 的库存 50 件！`);
    } else if (task.type === 'fraud_audit' && task.targetOrderId) {
      onAuditOrder(task.targetOrderId);
      showToast(`✓ 立即执行：风控已验证签名，安全核准放行订单 ${task.targetOrderId}！`);
    } else if (task.type === 'marketing') {
      showToast(`✓ 立即执行：自动营销满减活动已发布并分发多渠道！`);
    } else {
      showToast(`✓ 立即执行：系统任务已按宪法原子执行完毕！`);
    }
  };

  // Dynamic Stat Computations
  const computedSalesSum = orders.reduce((sum, o) => sum + o.total, 0);
  const todaySales = computedSalesSum > 0 ? computedSalesSum : 12480;
  const todayOrdersCount = orders.length > 0 ? orders.length : 148;
  const todayCustomersUnique = new Set(orders.map(o => o.customerName)).size;
  const todayCustomersCount = todayCustomersUnique > 0 ? todayCustomersUnique : 64;
  const todayProfit = Math.round(todaySales * 0.35 * 100) / 100;

  const pendingShipmentCount = orders.filter(o => o.status === 'Pending').length || 12;
  const pendingRefundCount = orders.filter(o => o.status === 'Refund Requested').length || 3;
  const pendingApprovalCount = orders.filter(o => o.riskScore && o.riskScore > 35).length || 2;
  const pendingActionCount = products.filter(p => p.stock <= p.minStockThreshold).length + pendingShipmentCount;

  return (
    <div id="ecos-merchant-workbench" className="space-y-6 text-slate-800 select-none font-sans animate-fadeIn relative pb-16">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-55 max-w-sm bg-[#09090b] border-2 border-[#07C2E3] text-slate-100 p-4 rounded-xl shadow-2xl flex items-start gap-3 animate-slideIn">
          <Sparkles className="w-5 h-5 text-[#07C2E3] shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-1">
            <h4 className="text-xs font-black text-[#07C2E3] tracking-widest uppercase">系统事件广播</h4>
            <p className="text-[11px] font-semibold text-slate-300 leading-relaxed font-mono">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Top Banner Navigation */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-5 text-left">
        <div className="text-left space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#07C2E3]/15 border border-[#07C2E3]/40 flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-[#07C2E3]" />
            </div>
            <h1 className="text-lg font-black tracking-widest text-slate-900 uppercase flex items-center gap-1.5 font-display">
              商家控制中心首页
              <span className="text-[9px] font-semibold bg-[#07C2E3]/10 text-[#07C2E3] px-1.5 py-0.5 rounded border border-[#07C2E3]/20 font-mono">
                Merchant Operations Core
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            企业: <span className="text-slate-800 font-bold">{companyName}</span> | 行业类型: <span className="text-slate-800 font-bold uppercase font-mono">{selectedIndustry}</span>
          </p>
        </div>

        {/* Preview Button */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenOnlineStorefront}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:border-[#07C2E3] text-slate-700 text-xs font-bold rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <span>预览商城</span>
            <ArrowRight className="w-3 h-3 text-[#07C2E3]" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/*第一排: 数据卡片 */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '今日销售额', value: `$${todaySales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-[#07C2E3]', desc: '线上商城产生的总交易流水' },
          { label: '今日订单', value: `${todayOrdersCount} 笔`, icon: ShoppingCart, color: 'text-slate-700', desc: '消费者成功确认付款的总笔数' },
          { label: '今日客户', value: `${todayCustomersCount} 人`, icon: Users, color: 'text-slate-700', desc: '去重统计的活跃购买消费者' },
          { label: '今日利润', value: `$${todayProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: WinnerIcon, color: 'text-[#07C2E3]', desc: '按 35% 净溢价水位估算得出的净利润' }
        ].map((item, index) => {
          const IconComponent = item.icon === WinnerIcon ? Coins : item.icon;
          return (
            <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-left flex flex-col justify-between h-28 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{item.label}</span>
                <div className={`p-1.5 rounded-lg bg-slate-50 border border-slate-100 ${item.color}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-xl font-black text-slate-900 font-mono tracking-tight">{item.value}</span>
                <p className="text-[9px] text-slate-400 mt-0.5 truncate leading-none">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 第二排: 待处理指标卡片 */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '待发货', value: `${pendingShipmentCount} 单`, statusColor: 'bg-slate-50 border-slate-200 text-slate-600', alert: true },
          { label: '待退款', value: `${pendingRefundCount} 单`, statusColor: 'bg-rose-50 border-rose-200 text-rose-600', alert: true },
          { label: '待审批', value: `${pendingApprovalCount} 单`, statusColor: 'bg-slate-50 border-slate-200 text-slate-600', alert: true },
          { label: '待处理', value: `${pendingActionCount} 任务`, statusColor: 'bg-slate-100 border-slate-200 text-slate-700', alert: false }
        ].map((item, index) => {
          return (
            <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-left flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 block">{item.label}</span>
                <span className="text-lg font-black text-slate-900 font-mono">{item.value}</span>
              </div>
              <span className={`text-[10px] font-bold rounded-lg border px-2.5 py-1 ${item.statusColor}`}>
                {item.alert ? '● 需处理' : '● 行动指示'}
              </span>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 第三排: AI效能硬指标 */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'AI员工在线', value: '8 / 8 智体', icon: Bot, color: 'text-[#07C2E3]', details: '多智能体网络全部巡检就绪' },
          { label: '执行任务', value: '142 次', icon: Activity, color: 'text-[#07C2E3]', details: '今日累计代替店长执行业务操作' },
          { label: '成功率', value: '99.4%', icon: CheckCircle2, color: 'text-emerald-600', details: '智体审核与数据落库交易合规对平率' },
          { label: '节省成本', value: '$1,420.00', icon: Coins, color: 'text-[#07C2E3]', details: '替代底层物理操作换算的资金对调红利' }
        ].map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-left flex flex-col justify-between h-28 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{item.label}</span>
                <div className={`p-1.5 rounded-lg bg-slate-50 border border-slate-100 ${item.color}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-base font-black text-slate-900 font-mono">{item.value}</span>
                <p className="text-[9px] text-slate-400 mt-0.5 truncate leading-none">{item.details}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 第四排: 快捷入口 */}
      {/* ======================================================== */}
      <div className="text-left space-y-2">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">快捷操作直达 (快捷入口)</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
            { label: '商品', tab: 'products', icon: Package, color: 'text-slate-700' },
            { label: '订单', tab: 'orders', icon: ShoppingCart, color: 'text-slate-700' },
            { label: '客户', tab: 'customers', icon: Users, color: 'text-slate-700' },
            { label: '库存', tab: 'products', icon: Clock, color: 'text-slate-700' },
            { label: '营销', tab: 'marketing', icon: Megaphone, color: 'text-slate-700' },
            { label: '财务', tab: 'finance', icon: Coins, color: 'text-slate-700' }
          ].map((item, key) => {
            const Icon = item.icon;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  onSwitchTab(item.tab);
                  addLog('Quick Navigator', '快捷跳转', `一键跳转到页面: ${item.label}`, 'info');
                }}
                className="p-3 bg-white border border-slate-200 hover:border-[#07C2E3] rounded-xl text-left transition-all active:scale-[0.97] flex flex-col justify-between h-20 cursor-pointer text-slate-700 shadow-sm"
              >
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-[#07C2E3]" />
                <span className="text-xs font-bold">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Add SKU trigger */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            addLog('Owner Command', '开启商品表单', '点击了一键开启上架定制商品表单', 'info');
          }}
          className="bg-[#07C2E3] hover:bg-[#06B2D0] text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>创建定制高溢价商品</span>
        </button>
      </div>

      {/* Add Product Form Overlay/Section */}
      {showAddForm && (
        <div className="bg-white border-2 border-[#07C2E3] rounded-xl p-5 text-left space-y-4 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
              <Plus className="w-4 h-4 text-[#07C2E3]" />
              <span>录入新商品信息</span>
            </div>
            <button 
              onClick={() => setShowAddForm(false)} 
              className="text-slate-400 hover:text-slate-700 p-1 rounded-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleAddNewSKU} className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] text-slate-400 font-bold block uppercase font-mono">商品名称 *</label>
              <input 
                type="text" 
                required 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="名称..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#07C2E3] focus:bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold block uppercase font-mono">定价 ($) *</label>
              <input 
                type="number" 
                required 
                min="1"
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#07C2E3] focus:bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold block uppercase font-mono">初始采购量 *</label>
              <input 
                type="number" 
                required 
                min="1"
                value={newStock}
                onChange={(e) => setNewStock(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#07C2E3] focus:bg-white"
              />
            </div>
            <div className="md:col-span-4 flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                取消
              </button>
              <button 
                type="submit" 
                className="px-5 py-2 bg-[#07C2E3] hover:bg-[#06B2D0] text-white font-bold text-xs rounded-lg transition-all active:scale-95 cursor-pointer"
              >
                确认上架产品
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* 第五排: 最近任务 (表格) */}
      {/* ======================================================== */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col text-left">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="space-y-0.5">
            <h3 className="font-bold text-slate-800 text-sm tracking-tight font-display">最近任务 / AI 自动化调度流水</h3>
            <p className="text-[11px] text-slate-400">SaaS 多智能体系统自主分析并生成的决策计划和操作队列</p>
          </div>
        </div>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse font-mono">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-semibold text-slate-400 uppercase tracking-wider select-none">
                <th className="px-5 py-3">任务编号</th>
                <th className="px-5 py-3 text-slate-500">业务目标 (任务名称)</th>
                <th className="px-5 py-3 text-slate-500">负责智体</th>
                <th className="px-5 py-3 text-center text-slate-500">运行状态</th>
                <th className="px-5 py-3 text-right text-slate-500">立即行动</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTasks.map((task) => {
                let statusBadge = '';
                if (task.status === '待审核') statusBadge = 'bg-amber-50 text-amber-700 border-amber-200';
                else if (task.status === '进行中') statusBadge = 'bg-indigo-50 text-indigo-700 border-indigo-200';
                else if (task.status === '完成') statusBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                else statusBadge = 'bg-slate-50 text-slate-700 border-slate-200';

                return (
                  <tr key={task.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3.5 font-bold text-slate-900">#{task.id}</td>
                    <td className="px-5 py-3.5 text-slate-700 font-bold font-sans">{task.name}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono text-[11px]">{task.agent}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${statusBadge}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {task.status === '完成' ? (
                        <div className="text-[10px] text-slate-400 font-sans flex items-center justify-end gap-1 font-semibold pr-3">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 已安全扣款落库
                        </div>
                      ) : (
                        <button
                          onClick={() => handleExecuteTask(task.id)}
                          className="px-3 py-1 bg-[#121214] hover:bg-[#07C2E3] hover:text-white text-[#07C2E3] font-bold text-[10px] rounded border border-zinc-800 transition-all cursor-pointer"
                        >
                          立即执行
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// Simple placeholder block to work around a linter warning if any
const WinnerIcon = () => null;
