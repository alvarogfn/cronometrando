export type Callback = (...args: any[]) => void;

class PubSub {
  private readonly listeners = new Map<string, Set<Callback>>();

  destroy() {
    this.listeners.clear();
  }

  publish(id: string, data: Record<any, any>) {
    const callbacks = this.listeners.get(id)!;

    for (const callback of callbacks) {
      setTimeout(() => Reflect.apply(callback, this, [data]), 0);
    }
  }

  unsubscribe(id: string, callback: Callback) {
    const callbacks = this.listeners.get(id)!;

    callbacks.delete(callback);
  }

  subscribe(id: string, callback: Callback) {
    if (typeof callback === "function") {
      this.listeners.set(id, new Set([callback]));
    }
  }
}

export const pubSub = new PubSub();
