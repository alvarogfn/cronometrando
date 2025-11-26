import { getCurrentTimestamp } from "helpers/get-current-timestamp.ts";
import Localbase from "localbase";

import type { StopwatchQuestionModel, StopwatchTestModel } from "./models.ts";
import type { StoreState } from "./store.ts";

const db = new Localbase("db");

export const questionsCollection = () =>
  db.collection<StopwatchQuestionModel>("questions");

export const testsCollection = () => db.collection<StopwatchTestModel>("tests");

export function saveTestToDb(state: StoreState) {
  testsCollection()
    .add({
      countedDuration: state.testCountedDuration,
      createdAt: state.createdAt,
      endedAt: getCurrentTimestamp(),
      id: state.testId,
      totalDuration: state.testTotalDuration,
    })
    .catch(console.warn);
}

export function saveQuestionToDb(state: StoreState) {
  questionsCollection()
    .add({
      countedDuration: state.questionCountedDuration,
      endedAt: getCurrentTimestamp(),
      id: state.questionId,
      parentId: state.testId,
      totalDuration: state.questionTotalDuration,
    })
    .catch(console.warn);
}
