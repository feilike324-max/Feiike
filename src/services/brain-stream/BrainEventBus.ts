import { dbEngine } from '../../db/dbEngine';
import { BrainEvent } from '../../types';

type BrainEventListener = (event: BrainEvent) => void;

class BrainEventBusService {
  private static instance: BrainEventBusService;
  private listeners: Set<BrainEventListener> = new Set();

  private constructor() {}

  public static getInstance(): BrainEventBusService {
    if (!BrainEventBusService.instance) {
      BrainEventBusService.instance = new BrainEventBusService();
    }
    return BrainEventBusService.instance;
  }

  /**
   * Publish a high-intelligence event to the database and notify all live memory-stream listeners
   */
  public publish(eventData: Omit<BrainEvent, 'id' | 'timestamp'>): BrainEvent {
    const event = dbEngine.brain_events.create({
      ...eventData,
      timestamp: new Date().toISOString()
    });

    // Fire live local listeners for reactive UI stream updates
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('Error in BrainEventBus listener:', err);
      }
    });

    // Also update statistics in the active Brain Stream
    const streams = dbEngine.brain_streams.getAll();
    const targetStreamKey = event.priority === 'CRITICAL' || event.priority === 'HIGH' ? 'governance' : 'general';
    const activeStream = streams.find(s => s.stream_key === targetStreamKey);
    if (activeStream) {
      dbEngine.brain_streams.update(activeStream.id, {
        total_events_dispatched: activeStream.total_events_dispatched + 1,
        data_throughput_kb: activeStream.data_throughput_kb + 0.8,
        updated_at: new Date().toISOString()
      });
    }

    return event;
  }

  /**
   * Subscribe to live brain outputs in memory
   */
  public subscribe(listener: BrainEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const BrainEventBus = BrainEventBusService.getInstance();
