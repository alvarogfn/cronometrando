export interface ActiveTimeSegment {
  accumulatedMilliseconds: number;
  segmentStartedAt: number | undefined;
}

export interface ElapsedSnapshot {
  countedDuration: number;
  elapsedMilliseconds: number;
}

export function getElapsedSnapshot(
  segment: ActiveTimeSegment,
  now: number,
): ElapsedSnapshot {
  const activeMilliseconds =
    segment.segmentStartedAt === undefined
      ? 0
      : Math.max(0, now - segment.segmentStartedAt);
  const elapsedMilliseconds =
    segment.accumulatedMilliseconds + activeMilliseconds;

  return {
    countedDuration: Math.floor(elapsedMilliseconds / 1000),
    elapsedMilliseconds,
  };
}

export function getQuestionSnapshotOnStop(
  isStarted: boolean,
  segment: ActiveTimeSegment,
  now: number,
): ElapsedSnapshot | undefined {
  if (!isStarted) return undefined;

  const snapshot = getElapsedSnapshot(segment, now);
  return snapshot.elapsedMilliseconds > 0 ? snapshot : undefined;
}

export function canAdvanceQuestion(isStarted: boolean): boolean {
  return isStarted;
}

export function parseStoredBoolean(
  value: string | undefined,
  fallback: boolean,
): boolean {
  return value === undefined ? fallback : value === "true";
}
