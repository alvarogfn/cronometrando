import {
  Subtitle1,
  Card,
  CardHeader,
  Dialog,
  DialogTrigger,
} from "@fluentui/react-components";
import { TEST_DEFAULT_DURATION } from "api/constants.ts";
import { useStopwatchStore } from "api/store.tsx";

import StopwatchEditModal from "../components/stopwatch-edit-modal.tsx";

import StopwatchTestControls from "./stopwatch-test-controls.tsx";
import StopwatchTimer from "./stopwatch-timer.tsx";

interface StopwatchTestProps {
  className?: string;
}

function StopwatchTest({ className }: StopwatchTestProps) {
  const {
    isStarted,
    isPaused,
    setTestDuration,
    testTotalDuration,
    testCountedDuration,
    stop,
    start,
    resume,
    pause,
  } = useStopwatchStore((state) => state);

  const playAction = isStarted ? (isPaused ? resume : pause) : start;

  return (
    <Dialog>
      <DialogTrigger
        action={isStarted ? "close" : "open"}
        disableButtonEnhancement
      >
        <Card appearance="filled" className={className}>
          <CardHeader header={<Subtitle1>Prova</Subtitle1>} />
          <StopwatchTimer
            countedDuration={testCountedDuration}
            totalDuration={testTotalDuration}
          />
          <StopwatchTestControls
            isPaused={isPaused}
            isStarted={isStarted}
            onStart={playAction}
            onStop={stop}
            onPlay={resume}
            onPause={pause}
          />
        </Card>
      </DialogTrigger>
      <StopwatchEditModal
        values={{ totalDuration: testTotalDuration }}
        defaultValues={{ totalDuration: TEST_DEFAULT_DURATION }}
        disabled={isStarted}
        onSubmit={(value) => setTestDuration(value)}
      />
    </Dialog>
  );
}

export default StopwatchTest;
