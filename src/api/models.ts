export interface StopwatchTestModel {
  countedDuration: number;
  createdAt: number;
  endedAt: number;
  id: string;
  totalDuration: number;
}

export interface StopwatchQuestionModel
  extends Omit<StopwatchTestModel, "createdAt"> {
  parentId: string;
}
