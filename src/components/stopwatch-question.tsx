import {
  Subtitle1,
  Card,
  CardHeader,
  Dialog,
  DialogTrigger,
} from "@fluentui/react-components";

import StopwatchEditModal from "../components/stopwatch-edit-modal.tsx";

import StopwatchQuestionControls from "./stopwatch-question-controls.tsx";
import StopwatchTimer from "./stopwatch-timer.tsx";
import merge from "merge";

interface StopwatchQuestionProps {
  className?: string;
  parentId?: string;
}

const defaultValues = {
  countedDuration: 0,
  totalDuration: 180,
  isStarted: false,
  id: "0",
};

function StopwatchQuestion({ className }: StopwatchQuestionProps) {
  const values = merge(defaultValues, {});

  return (
    <Dialog>
      <DialogTrigger disableButtonEnhancement>
        <Card appearance="filled" className={className}>
          <CardHeader header={<Subtitle1>Questão</Subtitle1>} />
          <StopwatchTimer
            countedDuration={values.countedDuration}
            totalDuration={values.totalDuration}
          />
          <StopwatchQuestionControls
            isPaused={false}
            onPause={() => ({ isPaused: true })}
            onPlay={() => ({ isPaused: false })}
            onComplete={() => ({ isPaused: false })}
          />
        </Card>
      </DialogTrigger>
      <StopwatchEditModal
        values={values}
        defaultValues={values}
        onSubmit={(value) => console.log(value)}
      />
    </Dialog>
  );
}

export default StopwatchQuestion;
