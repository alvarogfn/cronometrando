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
import {
  canAdvanceQuestion,
  getElapsedSnapshot,
  getQuestionSnapshotOnStop,
  parseStoredBoolean,
} from "./stopwatch-logic.ts";
import { tickEmitter } from "./tick-emitter.ts";

export interface StoreProps {
  autoShutdown: boolean;

  createdAt: number;

  id: string;
  isPaused: boolean;

  isStarted: boolean;
  questionCountedDuration: number;
  questionElapsedMilliseconds: number;
  questionId: string;
  questionSegmentStartedAt: number | undefined;

  questionTotalDuration: number;
  testCountedDuration: number;
  testElapsedMilliseconds: number;
  testId: string;
  testName: string;
  testSegmentStartedAt: number | undefined;

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
  setTestName: (newName: string) => void;
  start: Fn;
  stop: Fn;
  tick: Fn;
}

let pendingQuestionWrites: Promise<void>[] = [];

function queueQuestionSave(state: StoreState) {
  const write = saveQuestionToDb(state);
  pendingQuestionWrites.push(write);
  void write.finally(() => {
    pendingQuestionWrites = pendingQuestionWrites.filter(
      (pendingWrite) => pendingWrite !== write,
    );
  });
}

const getMonotonicTime = () => performance.now();

export const useStopwatchStore = create<StoreState>((set, get) => {
  return {
    autoShutdown: parseStoredBoolean(
      getFromStorage<string>(AUTO_SHUTDOWN_STORAGE_KEY_DURATION, ""),
      false,
    ),

    createdAt: getCurrentTimestamp(),

    id: nanoid(),

    isPaused: false,

    isStarted: false,

    nextQuestion: () => {
      const state = get();
      if (!canAdvanceQuestion(state.isStarted)) return;

      const now = getMonotonicTime();
      const testElapsed = getElapsedSnapshot(
        {
          accumulatedMilliseconds: state.testElapsedMilliseconds,
          segmentStartedAt: state.testSegmentStartedAt,
        },
        now,
      );
      const questionElapsed = getElapsedSnapshot(
        {
          accumulatedMilliseconds: state.questionElapsedMilliseconds,
          segmentStartedAt: state.questionSegmentStartedAt,
        },
        now,
      );

      queueQuestionSave({
        ...state,
        questionCountedDuration: questionElapsed.countedDuration,
        questionElapsedMilliseconds: questionElapsed.elapsedMilliseconds,
        testCountedDuration: testElapsed.countedDuration,
        testElapsedMilliseconds: testElapsed.elapsedMilliseconds,
      });

      set({
        questionCountedDuration: 0,
        questionElapsedMilliseconds: 0,
        questionId: nanoid(),
        questionSegmentStartedAt: state.isPaused ? undefined : now,
        testCountedDuration: testElapsed.countedDuration,
        testElapsedMilliseconds: testElapsed.elapsedMilliseconds,
        testSegmentStartedAt: state.isPaused ? undefined : now,
      });
    },

    pause: () => {
      const state = get();
      if (!state.isStarted || state.isPaused) return;

      const now = getMonotonicTime();
      const testElapsed = getElapsedSnapshot(
        {
          accumulatedMilliseconds: state.testElapsedMilliseconds,
          segmentStartedAt: state.testSegmentStartedAt,
        },
        now,
      );
      const questionElapsed = getElapsedSnapshot(
        {
          accumulatedMilliseconds: state.questionElapsedMilliseconds,
          segmentStartedAt: state.questionSegmentStartedAt,
        },
        now,
      );

      set({
        isPaused: true,
        questionCountedDuration: questionElapsed.countedDuration,
        questionElapsedMilliseconds: questionElapsed.elapsedMilliseconds,
        questionSegmentStartedAt: undefined,
        testCountedDuration: testElapsed.countedDuration,
        testElapsedMilliseconds: testElapsed.elapsedMilliseconds,
        testSegmentStartedAt: undefined,
      });
    },
    questionCountedDuration: 0,

    questionElapsedMilliseconds: 0,
    questionId: nanoid(),
    questionSegmentStartedAt: undefined,
    questionTotalDuration: getFromStorage(
      QUESTION_STORAGE_KEY_DURATION,
      QUESTION_DEFAULT_DURATION,
    ),
    refresh: () => set({ id: nanoid() }),
    resume: () => {
      const state = get();
      if (!state.isStarted || !state.isPaused) return;

      const now = getMonotonicTime();
      set({
        isPaused: false,
        questionSegmentStartedAt: now,
        testSegmentStartedAt: now,
      });
    },
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
    setTestName: (newName: string) => set({ testName: newName }),
    start: () => {
      const state = get();
      if (state.isStarted) throw new Error("The stopwatch has already started");

      const now = getMonotonicTime();
      set({
        createdAt: getCurrentTimestamp(),
        isPaused: false,
        isStarted: true,
        questionCountedDuration: 0,
        questionElapsedMilliseconds: 0,
        questionSegmentStartedAt: now,
        testCountedDuration: 0,
        testElapsedMilliseconds: 0,
        testSegmentStartedAt: now,
      });
    },

    stop: () => {
      const state = get();
      if (!state.isStarted) throw new Error("The stopwatch was not started");

      const now = getMonotonicTime();
      const testElapsed = getElapsedSnapshot(
        {
          accumulatedMilliseconds: state.testElapsedMilliseconds,
          segmentStartedAt: state.testSegmentStartedAt,
        },
        now,
      );
      const questionElapsed = getQuestionSnapshotOnStop(
        state.isStarted,
        {
          accumulatedMilliseconds: state.questionElapsedMilliseconds,
          segmentStartedAt: state.questionSegmentStartedAt,
        },
        now,
      );
      const finalState = {
        ...state,
        questionCountedDuration:
          questionElapsed?.countedDuration ?? state.questionCountedDuration,
        questionElapsedMilliseconds:
          questionElapsed?.elapsedMilliseconds ??
          state.questionElapsedMilliseconds,
        testCountedDuration: testElapsed.countedDuration,
        testElapsedMilliseconds: testElapsed.elapsedMilliseconds,
      };
      const writes = [...pendingQuestionWrites];

      if (questionElapsed) writes.push(saveQuestionToDb(finalState));
      writes.push(saveTestToDb(finalState));

      set({
        isPaused: false,
        isStarted: false,
        questionCountedDuration: 0,
        questionElapsedMilliseconds: 0,
        questionId: nanoid(),
        questionSegmentStartedAt: undefined,
        testCountedDuration: 0,
        testElapsedMilliseconds: 0,
        testId: nanoid(),
        testName: "",
        testSegmentStartedAt: undefined,
      });

      void Promise.all(writes)
        .then(() => get().refresh())
        .catch(console.warn);
    },
    testCountedDuration: 0,

    testElapsedMilliseconds: 0,
    testId: nanoid(),
    testName: "",
    testSegmentStartedAt: undefined,
    testTotalDuration: getFromStorage(
      TEST_STORAGE_KEY_DURATION,
      TEST_DEFAULT_DURATION,
    ),
    tick: () => {
      const state = get();
      if (!state.isStarted || state.isPaused) return;

      const now = getMonotonicTime();
      const testElapsed = getElapsedSnapshot(
        {
          accumulatedMilliseconds: state.testElapsedMilliseconds,
          segmentStartedAt: state.testSegmentStartedAt,
        },
        now,
      );
      const questionElapsed = getElapsedSnapshot(
        {
          accumulatedMilliseconds: state.questionElapsedMilliseconds,
          segmentStartedAt: state.questionSegmentStartedAt,
        },
        now,
      );

      set({
        questionCountedDuration: questionElapsed.countedDuration,
        testCountedDuration: testElapsed.countedDuration,
      });

      if (!state.autoShutdown) return;

      if (testElapsed.countedDuration >= state.testTotalDuration) {
        state.stop();
      }
    },
  };
});

tickEmitter.subscribe(() => useStopwatchStore.getState().tick());
