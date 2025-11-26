import type { Fn } from "helpers/types.ts";

import { getCurrentTimestamp } from "helpers/get-current-timestamp.ts";
import { getFromStorage, setToStorage } from "helpers/storage.ts";
import { create } from "zustand";

import {
  AUTO_SHUTDOWN_STORAGE_KEY_DURATION,
  QUESTION_DEFAULT_DURATION,
  QUESTION_STORAGE_KEY_DURATION,
  TEST_DEFAULT_DURATION,
  TEST_STORAGE_KEY_DURATION,
} from "./constants.ts";
import { saveQuestionToDb, saveTestToDb } from "./db.ts";
import { nanoid } from "./nanoid.ts";
import { tickEmitter } from "./tick-emitter.ts";

export interface StoreProps {
  autoShutdown: boolean;

  createdAt: number;

  id: string;
  isPaused: boolean;

  isStarted: boolean;
  questionCountedDuration: number;
  questionId: string;

  questionTotalDuration: number;
  testCountedDuration: number;
  testId: string;

  testTotalDuration: number;
}

export interface StoreState extends StoreProps {
  nextQuestion: Fn;
  pause: Fn;
  refresh: Fn;
  resume: Fn;
  setAutoShutdown: (newValue: boolean) => void;
  setQuestionDuration: (newDuration: number) => void;
  setTestDuration: (newDuration: number) => void;
  start: Fn;
  stop: Fn;
  tick: Fn;
}

export const useStopwatchStore = create<StoreState>((set, get) => {
  return {
    autoShutdown: getFromStorage<boolean>(
      QUESTION_STORAGE_KEY_DURATION,
      false,
      Boolean,
    ),

    createdAt: getCurrentTimestamp(),

    id: nanoid(),

    isPaused: false,

    isStarted: false,

    nextQuestion: () => {
      set((state) => {
        saveQuestionToDb({ ...state });

        return {
          questionCountedDuration: 0,
          questionId: nanoid(),
        };
      });
    },

    pause: () => set({ isPaused: true }),
    questionCountedDuration: 0,

    questionId: nanoid(),
    questionTotalDuration: getFromStorage(
      QUESTION_STORAGE_KEY_DURATION,
      QUESTION_DEFAULT_DURATION,
    ),
    refresh: () => set({ id: nanoid() }),
    resume: () => set({ isPaused: false }),
    setAutoShutdown: (newValue: boolean) => {
      set({ autoShutdown: newValue });
      setToStorage(AUTO_SHUTDOWN_STORAGE_KEY_DURATION, newValue);
    },

    setQuestionDuration: (newDuration: number) => {
      set({ questionTotalDuration: newDuration });
      setToStorage(QUESTION_STORAGE_KEY_DURATION, newDuration);
    },

    setTestDuration: (newDuration: number) => {
      set({ testTotalDuration: newDuration });
      setToStorage(TEST_STORAGE_KEY_DURATION, newDuration);
    },
    start: () => {
      set((state) => {
        if (state.isStarted)
          throw new Error("The stopwatch has already started");

        return {
          countedDuration: 0,
          createdAt: getCurrentTimestamp(),
          isPaused: false,
          isStarted: true,
        };
      });
    },

    stop: () => {
      set((state) => {
        if (!state.isStarted) throw new Error("The stopwatch was not started");
        saveTestToDb({ ...state });

        return {
          id: nanoid(),
          isPaused: false,
          isStarted: false,
          questionCountedDuration: 0,
          questionId: nanoid(),
          testCountedDuration: 0,
          testId: nanoid(),
        };
      });
    },
    testCountedDuration: 0,

    testId: nanoid(),
    testTotalDuration: getFromStorage(
      TEST_STORAGE_KEY_DURATION,
      TEST_DEFAULT_DURATION,
    ),
    tick: () => {
      const state = get();
      if (!state.isStarted || state.isPaused) return;

      const newTestCountedDuration = state.testCountedDuration + 1;
      const newQuestionCountedDuration = state.questionCountedDuration + 1;

      set({
        questionCountedDuration: newQuestionCountedDuration,
        testCountedDuration: newTestCountedDuration,
      });

      if (!state.autoShutdown) return;

      if (newTestCountedDuration >= state.testTotalDuration) {
        state.stop();
      }
    },
  };
});

tickEmitter.subscribe(() => useStopwatchStore.getState().tick());
