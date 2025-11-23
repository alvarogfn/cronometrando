import { setAccurateInterval } from "helpers/set-accurate-interval.ts";
import type { Fn } from "helpers/types.ts";

export type Callback = (...args: any[]) => void;

class TickEmitter {
  private readonly stop: Fn;

  constructor() {
    this.stop = setAccurateInterval(() => this.publish(), 1000);
  }

  private readonly listeners = new Set<Callback>();

  destroy() {
    this.stop();
    this.listeners.clear();
  }

  private publish() {
    for (const callback of this.listeners) {
      setTimeout(() => Reflect.apply(callback, this, []), 0);
    }
  }

  unsubscribe(callback: Callback) {
    this.listeners.delete(callback);
  }

  subscribe(callback: Callback) {
    if (typeof callback === "function") {
      this.listeners.add(callback);
    }
  }
}

export const tickEmitter = new TickEmitter();
