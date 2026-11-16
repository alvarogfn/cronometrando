import { describe, expect, it } from "vitest";

import {
  canAdvanceQuestion,
  getElapsedSnapshot,
  getQuestionSnapshotOnStop,
  parseStoredBoolean,
} from "../src/api/stopwatch-logic.ts";

describe("stopwatch timing", () => {
  it("does not count a second early near a shared tick boundary", () => {
    const activeSegment = {
      accumulatedMilliseconds: 0,
      segmentStartedAt: 950,
    };

    expect(getElapsedSnapshot(activeSegment, 977)).toEqual({
      countedDuration: 0,
      elapsedMilliseconds: 27,
    });
    expect(getElapsedSnapshot(activeSegment, 1950)).toEqual({
      countedDuration: 1,
      elapsedMilliseconds: 1000,
    });
  });

  it("excludes pause time when counting a resumed segment", () => {
    expect(
      getElapsedSnapshot(
        { accumulatedMilliseconds: 700, segmentStartedAt: 2000 },
        2300,
      ),
    ).toEqual({ countedDuration: 1, elapsedMilliseconds: 1000 });
  });

  it("captures the final active question when stopping", () => {
    expect(
      getQuestionSnapshotOnStop(
        true,
        { accumulatedMilliseconds: 2000, segmentStartedAt: 1000 },
        2500,
      ),
    ).toEqual({ countedDuration: 3, elapsedMilliseconds: 3500 });

    expect(
      getQuestionSnapshotOnStop(
        false,
        { accumulatedMilliseconds: 0, segmentStartedAt: undefined },
        2500,
      ),
    ).toBeUndefined();
  });

  it("ignores question advance while the test is stopped", () => {
    expect(canAdvanceQuestion(false)).toBe(false);
    expect(canAdvanceQuestion(true)).toBe(true);
  });

  it("restores only persisted boolean auto-shutdown values", () => {
    expect(parseStoredBoolean("false", true)).toBe(false);
    expect(parseStoredBoolean("true", false)).toBe(true);
    expect(parseStoredBoolean("0", false)).toBe(false);
    expect(parseStoredBoolean(undefined, false)).toBe(false);
  });
});
