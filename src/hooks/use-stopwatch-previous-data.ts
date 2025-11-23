import type { StopwatchQuestionModel, StopwatchTestModel } from "api/models.ts";

import { questionsCollection, testsCollection } from "api/db.ts";
import { useStopwatchStore } from "api/store.tsx";
import { useEffect, useState } from "react";

type TestWithQuestions = (StopwatchTestModel & {
  questions: StopwatchQuestionModel[];
})[];

function useStopwatchPreviousData() {
  const [data, setData] = useState<TestWithQuestions>([]);

  useEffect(() => {
    async function syncDb() {
      const [tests, questions] = await Promise.all([
        testsCollection().orderBy("endedAt", "desc").limit(5).get(),
        questionsCollection().orderBy("endedAt", "desc").get(),
      ]);

      const data = (tests ?? []).map((test) => {
        return {
          ...test,
          questions: (questions ?? []).filter(
            (question) => question.parentId === test.id,
          ),
        };
      });

      setData(data);
    }

    syncDb().catch(console.warn);

    const unsubscribe = useStopwatchStore.subscribe((state, prevState) => {
      if (state.testId !== prevState.testId) {
        syncDb().catch(console.warn);
      }
    });

    return () => unsubscribe();
  }, []);

  return { data };
}

export default useStopwatchPreviousData;
