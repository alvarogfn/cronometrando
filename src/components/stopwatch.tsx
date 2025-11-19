import {
  Subtitle1,
  Card,
  CardHeader,
  Dialog,
  DialogTrigger,
} from "@fluentui/react-components";

import StopwatchEditModal from "../components/stopwatch-edit-modal.tsx";
import { formatTimeToHHMMSS } from "../helpers/format-time-to-HHMMSS.ts";
import { getSecondsFromHHMMSS } from "../helpers/get-seconds-from-HHMMSS.ts";

import StopwatchControls from "./stopwatch-controls.tsx";
import StopwatchTimer from "./stopwatch-timer.tsx";

interface StopwatchProps {
  className?: string;
  title: string;
}

// Salvar quantidade de segundos que faltam
// Subtrai-o a quantidade de segundos que passou com o useTime()
const abc = {
  initialDuration: 60,
  alreadyDuration: 0,
  paused: false,
};

function Stopwatch({ className, title }: StopwatchProps) {
  // const time = useCurrentTime();
  //
  // useEffect(() => {
  //   if (abc.paused) return;
  //
  //   if (abc.alreadyDuration > abc.initialDuration) {
  //     abc.initialDuration = 60;
  //     abc.alreadyDuration = 0;
  //   }
  //
  //   abc.alreadyDuration = abc.alreadyDuration + 1;
  // }, [time]);

  return (
    <Dialog>
      <DialogTrigger disableButtonEnhancement>
        <Card appearance="filled" className={className}>
          <CardHeader header={<Subtitle1>{title}</Subtitle1>} />
          <StopwatchTimer
            countedDuration={abc.alreadyDuration}
            totalDuration={abc.alreadyDuration}
          />
          <StopwatchControls
            isPaused={abc.paused}
            onPause={() => (abc.paused = true)}
            onPlay={() => (abc.paused = false)}
            onReset={() => (abc.alreadyDuration = 0)}
          />
        </Card>
      </DialogTrigger>
      <StopwatchEditModal
        values={{ duration: formatTimeToHHMMSS(3666) }}
        defaultValues={{ duration: formatTimeToHHMMSS(3666) }}
        onSubmit={(value) => console.log(getSecondsFromHHMMSS(value.duration))}
      />
    </Dialog>
  );
}

export default Stopwatch;
