export interface StopwatchTestModel {
  totalDuration: number;
  countedDuration: number;
  startAt: number;
  endedAt: number;
  id: string;
}

export interface StopwatchQuestionModel extends StopwatchTestModel {
  parentId: string;
}
