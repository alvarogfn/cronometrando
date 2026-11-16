import { testsCollection } from "api/db.ts";
import { useStopwatchStore } from "api/store.ts";
import { useCallback } from "react";

export function useTestRename(id: string) {
  const refresh = useStopwatchStore((state) => state.refresh);

  return useCallback(
    (name: string) =>
      testsCollection()
        .doc({ id })
        .update({ name })
        .then(() => refresh()),
    [id, refresh],
  );
}
