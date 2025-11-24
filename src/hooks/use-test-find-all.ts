import type { TestWithQuestions } from "api/models.ts";

import { questionsCollection, testsCollection } from "api/db.ts";
import { useStopwatchStore } from "api/store.tsx";
import { useEffect, useState } from "react";

function sleep(timeout: number): Promise<void> {
  return new Promise<void>((resolves) => setTimeout(() => resolves(), timeout));
}

function useTestFindAll() {
  const [data, setData] = useState<TestWithQuestions[]>([]);

  useEffect(() => {
    async function syncDb() {
      // Workaround so that the addition within indexeddb does not take longer than the search.
      await sleep(300);

      const [tests, questions] = await Promise.all([
        testsCollection().orderBy("endedAt", "desc").get(),
        questionsCollection().orderBy("endedAt", "desc").get(),
      ]);

      return (tests ?? []).map((test) => {
        return {
          ...test,
          questions: (questions ?? []).filter(
            (question) => question.parentId === test.id,
          ),
        };
      });
    }

    const unsubscribe = useStopwatchStore.subscribe((state, prevState) => {
      if (state.id !== prevState.id) {
        syncDb()
          .then((r) => setData(r))
          .catch(console.warn);
      }
    });

    syncDb()
      .then((r) => setData(r))
      .catch(console.warn);

    return () => unsubscribe();
  }, []);

  return { data };
}

export default useTestFindAll;
