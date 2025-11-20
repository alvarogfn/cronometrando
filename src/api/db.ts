import Localbase from "localbase";
import type { StopwatchQuestionModel, StopwatchTestModel } from "./models.ts";

const db = new Localbase("db");

export const questionsCollection = () =>
  db.collection<StopwatchQuestionModel>("questions");

export const testsCollection = () => db.collection<StopwatchTestModel>("tests");
