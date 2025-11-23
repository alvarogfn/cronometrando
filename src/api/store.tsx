import { getCurrentTimestamp } from "helpers/get-current-timestamp.ts";
import { getFromStorage, setToStorage } from "helpers/storage.ts";
import type { Fn } from "helpers/types.ts";
import { create } from "zustand";
import {
  QUESTION_DEFAULT_DURATION,
  QUESTION_STORAGE_KEY_DURATION,
  TEST_DEFAULT_DURATION,
  TEST_STORAGE_KEY_DURATION,
} from "./constants.ts";
import { saveQuestionToDb, saveTestToDb } from "./db.ts";
import { nanoid } from "./nanoid.ts";
import { tickEmitter } from "./tick-emitter.ts";

export interface StoreProps {
  createdAt: number;
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
  start: Fn;
  stop: Fn;
  pause: Fn;
  resume: Fn;
  tick: Fn;
  nextQuestion: Fn;
  setQuestionDuration: (newDuration: number) => void;
  setTestDuration: (newDuration: number) => void;
}

export const useStopwatchStore = create<StoreState>((set) => {
  return {
    questionCountedDuration: 0,
    testCountedDuration: 0,

    testId: nanoid(),
    questionId: nanoid(),

    createdAt: getCurrentTimestamp(),

    isStarted: false,
    isPaused: false,

    questionTotalDuration: getFromStorage(
      QUESTION_STORAGE_KEY_DURATION,
      QUESTION_DEFAULT_DURATION,
    ),

    testTotalDuration: getFromStorage(
      TEST_STORAGE_KEY_DURATION,
      TEST_DEFAULT_DURATION,
    ),

    setQuestionDuration: (newDuration: number) => {
      set({ questionTotalDuration: newDuration });
      setToStorage(QUESTION_STORAGE_KEY_DURATION, newDuration);
    },

    setTestDuration: (newDuration: number) => {
      set({ testTotalDuration: newDuration });
      setToStorage(TEST_STORAGE_KEY_DURATION, newDuration);
    },

    pause: () => set({ isPaused: true }),
    resume: () => set({ isPaused: false }),

    nextQuestion: () => {
      set((state) => {
        saveQuestionToDb({ ...state });

        return {
          questionCountedDuration: 0,
          questionId: nanoid(),
        };
      });
    },
    start: () => {
      set((state) => {
        if (state.isStarted)
          throw new Error("The stopwatch has already started");

        return {
          isStarted: true,
          isPaused: false,
          countedDuration: 0,
          createdAt: getCurrentTimestamp(),
        };
      });
    },

    stop: () => {
      set((state) => {
        if (!state.isStarted) throw new Error("The stopwatch was not started");
        saveTestToDb({ ...state });

        return {
          isPaused: false,
          isStarted: false,
          testId: nanoid(),
          questionId: nanoid(),
          testCountedDuration: 0,
          questionCountedDuration: 0,
        };
      });
    },

    tick: () => {
      set((state) => {
        if (!state.isStarted || state.isPaused) return state;

        return {
          questionCountedDuration: state.questionCountedDuration + 1,
          testCountedDuration: state.testCountedDuration + 1,
        };
      });
    },
  };
});

tickEmitter.subscribe(() => useStopwatchStore.getState().tick());
