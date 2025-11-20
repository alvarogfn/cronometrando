import {
  Subtitle1,
  Card,
  CardHeader,
  Dialog,
  DialogTrigger,
} from "@fluentui/react-components";
import { useTestStore } from "api/test-store.ts";
import { formatTimeToHHMMSS } from "helpers/format-time-to-HHMMSS.ts";

import StopwatchEditModal from "../components/stopwatch-edit-modal.tsx";

import StopwatchTestControls from "./stopwatch-test-controls.tsx";
import StopwatchTimer from "./stopwatch-timer.tsx";

interface StopwatchTestProps {
  className?: string;
}

const defaultValues = {
  totalDuration: 36000,
};

function StopwatchTest({ className }: StopwatchTestProps) {
  const {
    start,
    isRunning,
    pause,
    isPaused,
    resume,
    totalDuration,
    countedDuration,
    stop,
  } = useTestStore((state) => state);

  return (
    <Dialog>
      <DialogTrigger
        action={isRunning ? "close" : "open"}
        disableButtonEnhancement
      >
        <Card appearance="filled" className={className}>
          <CardHeader header={<Subtitle1>Prova</Subtitle1>} />
          <StopwatchTimer
            countedDuration={countedDuration}
            totalDuration={totalDuration}
          />
          <StopwatchTestControls
            isPaused={isPaused}
            isRunning={isRunning}
            onStart={() => start(totalDuration)}
            onStop={stop}
            onPlay={resume}
            onPause={pause}
          />
        </Card>
      </DialogTrigger>
      <StopwatchEditModal
        values={{ totalDuration }}
        disabled={isRunning}
        defaultValues={{ totalDuration: defaultValues.totalDuration }}
        onSubmit={(value) =>
          console.log(formatTimeToHHMMSS(value.totalDuration))
        }
      />
    </Dialog>
  );
}

export default StopwatchTest;
