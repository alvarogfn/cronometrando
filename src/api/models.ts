export interface StopwatchTestModel {
  totalDuration: number;
  countedDuration: number;
  createdAt: number;
  endedAt: number;
  id: string;
}

export interface StopwatchQuestionModel
  extends Omit<StopwatchTestModel, "createdAt"> {
  parentId: string;
}
