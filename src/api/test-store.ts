import { getCurrentTimestamp } from "helpers/get-current-timestamp.ts";
import { setAccurateInterval } from "helpers/set-accurate-interval.ts";
import type { Fn } from "helpers/types.ts";
import { create } from "zustand";
import { TIMER_DEFAULT_DURATION, TIMER_TIMEOUT } from "./constants.ts";
import { testsCollection } from "./db.ts";
import type { StopwatchTestModel } from "./models.ts";
import { nanoid } from "./nanoid";

interface TestStoreState
  extends Omit<StopwatchTestModel, "startAt" | "endedAt"> {
  isPaused: boolean;
  isRunning: boolean;
  updatedAt: number | null;
  pausedAt: number | null;
  startAt: number | null;
  endedAt: number | null;
}

interface TestStoreActions {
  start: (totalDuration: number) => void;
  stop: Fn;
  pause: Fn;
  resume: Fn;
}

const generateDefaultTimer = (): TestStoreState => ({
  isRunning: false,
  isPaused: true,
  startAt: null,
  pausedAt: null,
  updatedAt: null,
  endedAt: null,

  countedDuration: 0,
  id: nanoid(),
  totalDuration: TIMER_DEFAULT_DURATION,
});

/* I don't know better way to do this */
let cancel: Fn | null = null;

export const useTestStore = create<TestStoreState & TestStoreActions>((set) => {
  return {
    isRunning: false,
    isPaused: true,
    startAt: 0,
    updatedAt: 0,
    countedDuration: 0,
    id: nanoid(),
    totalDuration: TIMER_DEFAULT_DURATION,
    endedAt: 0,
    pausedAt: 0,
    pause: () => {
      set(() => ({
        isPaused: true,
        pausedAt: getCurrentTimestamp(),
      }));
    },
    resume: () => {
      set(() => ({
        isPaused: false,
      }));
    },
    stop: () => {
      if (cancel) {
        cancel();
        cancel = null;

        set((state) => {
          testsCollection().add({
            endedAt: getCurrentTimestamp(),
            totalDuration: state.totalDuration,
            countedDuration: state.countedDuration,
            id: state.id,
            startAt: state.startAt!,
          });

          return {
            ...generateDefaultTimer(),
          };
        });
      } else {
        console.warn("The timer was not started");
      }
    },
    start: (totalDuration: number) => {
      set(() => ({
        isRunning: true,
        startAt: getCurrentTimestamp(),
        isPaused: false,
        totalDuration: totalDuration,
      }));

      if (!cancel) {
        cancel = setAccurateInterval(() => {
          set((state) => {
            if (state.isPaused) return {};

            return {
              countedDuration: state.countedDuration + 1,
              updatedAt: getCurrentTimestamp(),
            };
          });
        }, TIMER_TIMEOUT);
      }
    },
  };
});
