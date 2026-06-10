import { PromptIntelligenceEngine } from './PromptIntelligenceEngine';
import { generateIntelligentLocalReply } from '../../../utils/intelligentFallback';
import { dbEngine } from '../../../db/dbEngine';

export interface ModelOption {
  id: string;
  name: string;
  provider: 'Google' | 'OpenAI' | 'Anthropic' | 'DeepSeek';
  modelAlias: string;
  status: 'active' | 'inactive';
}

export class BrainLLMServiceClass {
  private static instance: BrainLLMServiceClass;
  private currentModelId = 'gemini-2.5-flash';

  private availableModels: ModelOption[] = [
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google', modelAlias: 'gemini-2.5-flash', status: 'active' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google', modelAlias: 'gemini-1.5-pro', status: 'active' },
    { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', modelAlias: 'claude-3-5-sonnet', status: 'active' },
    { id: 'deepseek-v3', name: 'DeepSeek V3', provider: 'DeepSeek', modelAlias: 'deepseek-chat', status: 'active' }
  ];

  private constructor() {}

  public static getInstance(): BrainLLMServiceClass {
    if (!BrainLLMServiceClass.instance) {
      BrainLLMServiceClass.instance = new BrainLLMServiceClass();
    }
    return BrainLLMServiceClass.instance;
  }

  public getAvailableModels(): ModelOption[] {
    return [...this.availableModels];
  }

  public getActiveModelId(): string {
    return this.currentModelId;
  }

  public setActiveModelId(modelId: string): void {
    if (this.availableModels.some(m => m.id === modelId)) {
      this.currentModelId = modelId;
      console.log(`[LLMOrchestrator] Switched active model paradigm to: "${modelId}"`);
    }
  }

  /**
   * Unified Conversational QA core. Integrates context intelligence compilation 
   * and communicates with backend proxy endpoints to access cloud AI models. 
   * Gracefully degrades to high-fidelity localized simulation if offline.
   */
  public async chat(
    userQuery: string,
    history: Array<{ role: 'user' | 'model'; content: string }>,
    tenantId = 't_retail',
    storeId = 'store_retail'
  ): Promise<{ text: string; actionType: string; metaObj: any; suggestions: any[] }> {
    // 1. Compile contextual state and tailored system prompt
    const promptPayload = PromptIntelligenceEngine.compile(tenantId, storeId);
    
    const rawProducts = dbEngine.products?.getAll() || [];
    const orders = dbEngine.orders?.getAll() || [];
    const customers: any[] = []; 

    // Map strict backend Product definitions to client-side ProductItem definitions expected by intelligent fallback
    const productsMapped = rawProducts.map((p: any) => ({
      id: p.id,
      name: p.name,
      sku: p.sku || 'SKU_GEN_COMPLY',
      stock: p.inventory || 0,
      minStockThreshold: 15,
      price: p.price || 0,
      sales: p.sales || 0,
      status: (p.inventory || 0) > 15 ? 'In Stock' : (p.inventory || 0) > 0 ? 'Low Stock' : 'Out of Stock'
    }));

    try {
      console.log(`[LLMOrchestrator] Offloading query to backend cloud gateway (Model: ${this.currentModelId})`);

      const res = await fetch('/api/gemini/agent-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: {
            id: 'sidekick_unified',
            name: 'Shopify Sidekick',
            systemPrompt: `${promptPayload.systemPrompt}\n\n${promptPayload.contextDump}`
          },
          industry: tenantId.replace('t_', ''),
          products: productsMapped,
          orders,
          messages: [
            ...history,
            { role: 'user', content: userQuery }
          ],
          modelAlias: this.availableModels.find(m => m.id === this.currentModelId)?.modelAlias
        })
      });

      if (res.ok) {
        const payload = await res.json();
        if (payload.reply) {
          // Parse action types or construct button mappings matching the intelligence engine
          const cleanTextLower = payload.reply.toLowerCase();
          let parsedAction = 'none';
          let parsedMeta: any = null;
          let recommendations: any[] = [];

          // Synthesize interactive action suggestion mappings if prompted
          const vars = promptPayload.structuredVariables;
          if (cleanTextLower.includes('vat') || cleanTextLower.includes('market') || cleanTextLower.includes('cross-border')) {
            parsedAction = 'switch_tab';
            parsedMeta = 'online-store';
            recommendations.push({ label: '立即配置海外市场', action: 'switch_tab', payload: 'online-store' });
          } else if (cleanTextLower.includes('stock') || cleanTextLower.includes('replenish') || cleanTextLower.includes('restock')) {
            parsedAction = 'restock';
            parsedMeta = { sku: 'all' };
            recommendations.push({ label: '一键发起智能补货', action: 'restock', payload: { sku: 'all', count: 300 } });
          } else if (cleanTextLower.includes('policy') || cleanTextLower.includes('gdpr') || cleanTextLower.includes('cancellation')) {
            parsedAction = 'switch_tab';
            parsedMeta = 'settings';
            recommendations.push({ label: '立即启用合规协议库', action: 'switch_tab', payload: 'settings' });
          }

          if (recommendations.length === 0) {
            recommendations.push({ label: '智能分析当前经营环境', action: 'switch_tab', payload: 'command' });
          }

          return {
            text: payload.reply,
            actionType: parsedAction,
            metaObj: parsedMeta,
            suggestions: recommendations
          };
        }
      }
      throw new Error(`Cloud response did not return clear response lines. Status code: ${res.status}`);
    } catch (err: any) {
      console.warn(`[LLMOrchestrator] Cloud gateway unavailable, engaging specialized local execution engine:`, err.message);

      // 2. Intelligent, deterministic fallbacks mimicking exact enterprise analysis.
      const localResult = generateIntelligentLocalReply(
        userQuery,
        productsMapped as any,
        orders as any,
        customers,
        {
          currentPage: promptPayload.structuredVariables.currentPage,
          storeReadiness: promptPayload.structuredVariables.storeReadiness,
          gaps: promptPayload.structuredVariables.gapsList,
          recommendedAction: promptPayload.structuredVariables.criticalRemediation
        }
      );

      return {
        text: localResult.text,
        actionType: localResult.actionType,
        metaObj: localResult.metaObj,
        suggestions: localResult.suggestions
      };
    }
  }
}

export const BrainLLMService = BrainLLMServiceClass.getInstance();
