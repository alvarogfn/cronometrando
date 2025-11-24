import { testsCollection } from "api/db.ts";
import { useStopwatchStore } from "api/store.tsx";
import { useCallback } from "react";

export function useTestDelete(id: string) {
  const refresh = useStopwatchStore((state) => state.refresh);

  return useCallback(() => {
    testsCollection()
      .doc({ id: id })
      .delete()
      .then(() => refresh())
      .catch(console.warn);
  }, [id]);
}
