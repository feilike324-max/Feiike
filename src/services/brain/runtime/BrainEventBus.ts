import { dbEngine } from '../../../db/dbEngine';

export type BrainEventType = 
  | 'PAGE_CHANGED' 
  | 'GOAL_CHANGED' 
  | 'TASK_COMPLETED' 
  | 'RISK_TRIGGERED' 
  | 'OPPORTUNITY_FOUND' 
  | 'ACTION_EXECUTED';

export interface BrainEventPayload {
  eventId: string;
  eventType: BrainEventType;
  tenantId: string;
  storeId: string;
  timestamp: string;
  summary: string;
  metadata: Record<string, any>;
}

export type BrainEventListener = (payload: BrainEventPayload) => void;

export class BrainEventBus {
  private static instance: BrainEventBus | null = null;
  private listeners: Map<BrainEventType, Set<BrainEventListener>> = new Map();

  private constructor() {}

  public static getInstance(): BrainEventBus {
    if (!BrainEventBus.instance) {
      BrainEventBus.instance = new BrainEventBus();
    }
    return BrainEventBus.instance;
  }

  /**
   * Register a callback listener triggered on specific Brain system event types
   */
  public subscribe(type: BrainEventType, listener: BrainEventListener): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener);

    // Return an unsubscribe handler for clean cleanup inside React cycles
    return () => {
      const set = this.listeners.get(type);
      if (set) {
        set.delete(listener);
      }
    };
  }

  /**
   * Publish a system event to log files in dbEngine and wake up connected agents dynamically.
   */
  public publish(
    type: BrainEventType, 
    tenantId: string, 
    storeId: string, 
    summary: string, 
    metadata: Record<string, any> = {}
  ): BrainEventPayload {
    const payload: BrainEventPayload = {
      eventId: `bev_${Math.random().toString(36).substring(2, 9)}`,
      eventType: type,
      tenantId,
      storeId,
      timestamp: new Date().toISOString(),
      summary,
      metadata
    };

    // Log the event inside dbEngine for persistent auditing & platform diagnostics
    if (dbEngine.brain_events) {
      dbEngine.brain_events.create({
        tenant_id: tenantId,
        store_id: storeId,
        event_name: type,
        stream_id: 'str_autonomic_channel',
        authoritative_role: 'SystemOrchestrator',
        payload_data: JSON.stringify(payload),
        timestamp: payload.timestamp
      } as any);
    }

    // Capture standard notifications for UX toasts
    if (dbEngine.brain_notifications) {
      dbEngine.brain_notifications.create({
        tenant_id: tenantId,
        store_id: storeId,
        notification_type: type === 'RISK_TRIGGERED' ? 'risk_alarm' : 'system_info',
        header: `Enterprise Brain: ${type}`,
        body: summary,
        is_read: false,
        created_at: payload.timestamp
      } as any);
    }

    // Dispatch immediately to memory subscribers
    const callbacks = this.listeners.get(type);
    if (callbacks) {
      callbacks.forEach(listener => {
        try {
          listener(payload);
        } catch (err) {
          console.error(`[BrainEventBus] Listener error during execution of: ${type}`, err);
        }
      });
    }

    console.log(`[BrainEventBus] Event Published [${type}]: ${summary}`);
    return payload;
  }
}

export const eventBus = BrainEventBus.getInstance();
