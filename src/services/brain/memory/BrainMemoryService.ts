import { dbEngine } from '../../../db/dbEngine';

export interface IntellectualExperience {
  id: string;
  tenantId: string;
  storeId: string;
  domain: 'pricing' | 'inventory' | 'marketing' | 'tax_compliance' | 'general';
  situation: string;
  intervention: string;
  outcomeScore: number;
  learnedRules: string[];
  recordedAt: string;
}

export class BrainMemoryService {
  private static instance: BrainMemoryService | null = null;

  private constructor() {}

  public static getInstance(): BrainMemoryService {
    if (!BrainMemoryService.instance) {
      BrainMemoryService.instance = new BrainMemoryService();
    }
    return BrainMemoryService.instance;
  }

  /**
   * Records a distinct, business-operating experience.
   * Allowing the Enterprise Brain to build accumulated memory and improve reasoning over time.
   */
  public commitExperience(
    tenantId: string,
    storeId: string,
    domain: IntellectualExperience['domain'],
    situation: string,
    intervention: string,
    outcomeScore: number,
    learnedRules: string[]
  ): IntellectualExperience {
    const experienceId = `exp_${Math.random().toString(36).substring(2, 9)}`;
    const newExp: IntellectualExperience = {
      id: experienceId,
      tenantId,
      storeId,
      domain,
      situation,
      intervention,
      outcomeScore,
      learnedRules,
      recordedAt: new Date().toISOString()
    };

    // Store in the dbEngine's memory block persistence under learning_experiences
    if (dbEngine.store_digital_twins) {
      const twins = dbEngine.store_digital_twins.getAll();
      const clientTwin = twins.find(x => x.tenant_id === tenantId && x.store_id === storeId);
      if (clientTwin) {
        // Safe lazy init
        const curMemory = clientTwin.learned_rules_json ? JSON.parse(clientTwin.learned_rules_json) : [];
        curMemory.push(newExp);
        dbEngine.store_digital_twins.update(clientTwin.id, {
          learned_rules_json: JSON.stringify(curMemory),
          last_snapshot_at: new Date().toISOString()
        });
      }
    }

    console.log(`[BrainMemory] Committed Experience (${domain}): ${situation.substring(0, 50)}...`);
    return newExp;
  }

  /**
   * Retrieves all committed operational experiences of a specific store.
   */
  public queryExperiences(tenantId: string, storeId: string): IntellectualExperience[] {
    if (!dbEngine.store_digital_twins) return [];
    
    const twins = dbEngine.store_digital_twins.getAll();
    const clientTwin = twins.find(x => x.tenant_id === tenantId && x.store_id === storeId);
    if (clientTwin && clientTwin.learned_rules_json) {
      try {
        return JSON.parse(clientTwin.learned_rules_json);
      } catch (err) {
        console.error('[BrainMemory] Failed to parse learned rules JSON experience array', err);
        return [];
      }
    }
    return [];
  }

  /**
   * Retrieve the complete digital twin parameters.
   */
  public getDigitalTwinState(tenantId: string, storeId: string) {
    if (!dbEngine.store_digital_twins) return null;
    return dbEngine.store_digital_twins.getAll().find(x => x.tenant_id === tenantId && x.store_id === storeId) || null;
  }
}

export const brainMemory = BrainMemoryService.getInstance();
