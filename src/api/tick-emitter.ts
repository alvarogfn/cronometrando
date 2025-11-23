import type { Fn } from "helpers/types.ts";

import { setAccurateInterval } from "helpers/set-accurate-interval.ts";

export type Callback = (...args: any[]) => void;

class TickEmitter {
  private readonly listeners = new Set<Callback>();

  private readonly stop: Fn;

  constructor() {
    this.stop = setAccurateInterval(() => this.publish(), 1000);
  }

  destroy() {
    this.stop();
    this.listeners.clear();
  }

  subscribe(callback: Callback) {
    if (typeof callback === "function") {
      this.listeners.add(callback);
    }
  }

  unsubscribe(callback: Callback) {
    this.listeners.delete(callback);
  }

  private publish() {
    for (const callback of this.listeners) {
      setTimeout(() => Reflect.apply(callback, this, []), 0);
    }
  }
}

export const tickEmitter = new TickEmitter();
