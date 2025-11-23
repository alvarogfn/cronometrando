import { getCurrentTimestamp } from "helpers/get-current-timestamp.ts";
import Localbase from "localbase";
import type { StopwatchQuestionModel, StopwatchTestModel } from "./models.ts";
import type { StoreState } from "./store.tsx";

const db = new Localbase("db");

export const questionsCollection = () =>
  db.collection<StopwatchQuestionModel>("questions");

export const testsCollection = () => db.collection<StopwatchTestModel>("tests");

export function saveTestToDb(state: StoreState) {
  testsCollection()
    .add({
      totalDuration: state.testTotalDuration,
      countedDuration: state.questionCountedDuration,
      endedAt: getCurrentTimestamp(),
      createdAt: state.createdAt,
      id: state.testId,
    })
    .catch(console.warn);

  questionsCollection()
    .add({
      totalDuration: state.questionTotalDuration,
      id: state.questionId,
      endedAt: getCurrentTimestamp(),
      countedDuration: state.questionCountedDuration,
      parentId: state.testId,
    })
    .catch(console.warn);
}

export function saveQuestionToDb(state: StoreState) {
  questionsCollection()
    .add({
      totalDuration: state.questionTotalDuration,
      id: state.questionId,
      endedAt: getCurrentTimestamp(),
      countedDuration: state.questionCountedDuration,
      parentId: state.testId,
    })
    .catch(console.warn);
}
