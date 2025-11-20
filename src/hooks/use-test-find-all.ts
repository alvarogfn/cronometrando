import { questionsCollection, testsCollection } from "api/db.ts";
import type { StopwatchQuestionModel, StopwatchTestModel } from "api/models.ts";
import { useTestStore } from "api/test-store.ts";
import { useEffect, useState } from "react";

type TestWithQuestions = (StopwatchTestModel & {
  questions: StopwatchQuestionModel[];
})[];

function useTestFindAll() {
  const [data, setData] = useState<TestWithQuestions>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isRunning = useTestStore((state) => state.isRunning);

  useEffect(() => {
    async function findAll() {
      setIsLoading(true);

      const [tests, questions] = await Promise.all([
        testsCollection().get(),
        questionsCollection().orderBy("endedAt", "asc").get(),
      ]);

      console.log(tests);

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

    findAll().then(() => setIsLoading(false));
  }, [isRunning]);

  return { data, isLoading };
}

export default useTestFindAll;
