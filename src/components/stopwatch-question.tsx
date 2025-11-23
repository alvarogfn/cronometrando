import {
  Subtitle1,
  Card,
  CardHeader,
  Dialog,
  DialogTrigger,
} from "@fluentui/react-components";
import { QUESTION_DEFAULT_DURATION } from "api/constants.ts";
import { useStopwatchStore } from "api/store.tsx";
import useKeyPress from "hooks/use-key-press.ts";

import StopwatchEditModal from "../components/stopwatch-edit-modal.tsx";
import StopwatchQuestionControls from "./stopwatch-question-controls.tsx";
import StopwatchTimer from "./stopwatch-timer.tsx";

interface StopwatchQuestionProps {
  className?: string;
  parentId?: string;
}

function StopwatchQuestion({ className }: StopwatchQuestionProps) {
  const {
    isPaused,
    isStarted,
    nextQuestion,
    pause,
    questionCountedDuration,
    questionTotalDuration,
    resume,
    setQuestionDuration,
    start,
  } = useStopwatchStore((state) => state);

  const playAction = isStarted ? (isPaused ? resume : pause) : start;

  useKeyPress("k", nextQuestion);

  return (
    <Dialog>
      <DialogTrigger
        action={isStarted ? "close" : "open"}
        disableButtonEnhancement
      >
        <Card appearance="filled" className={className}>
          <CardHeader header={<Subtitle1>Questão</Subtitle1>} />
          <StopwatchTimer
            countedDuration={questionCountedDuration}
            totalDuration={questionTotalDuration}
          />
          <StopwatchQuestionControls
            disabled={!isStarted}
            onNext={nextQuestion}
            onPause={pause}
            onPlay={playAction}
          />
        </Card>
      </DialogTrigger>
      <StopwatchEditModal
        defaultValues={{ totalDuration: QUESTION_DEFAULT_DURATION }}
        disabled={isStarted}
        onSubmit={(value) => setQuestionDuration(value)}
        values={{ totalDuration: questionTotalDuration }}
      />
    </Dialog>
  );
}

export default StopwatchQuestion;
