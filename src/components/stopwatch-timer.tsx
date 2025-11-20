import { makeStyles, mergeClasses, Text } from "@fluentui/react-components";
import ProgressBar from "../components/progress-bar.tsx";
import { formatTimeToHHMMSS } from "../helpers/format-time-to-HHMMSS.ts";
import type { BaseProps } from "../helpers/base-props.ts";

const useClasses = makeStyles({
  container: {
    display: "flex",
  },
});

interface StopwatchTimerProps extends BaseProps {
  totalDuration: number;
  countedDuration: number;
}

// function compute(countedDuration: number, totalDuration: number) {
//   const percentage = countedDuration / totalDuration;
//
//   return percentage;
// }

function StopwatchTimer({
  totalDuration,
  countedDuration,
  ...props
}: StopwatchTimerProps) {
  const classes = useClasses();

  const percentage = (totalDuration - countedDuration) / totalDuration;

  return (
    <div
      {...props}
      className={mergeClasses(classes.container, props.className)}
    >
      <div
        style={{
          display: "flex",
          flexFlow: "column nowrap",
          width: "100%",
        }}
      >
        <ProgressBar variant={"normal"} percentage={percentage} />
        <Text
          style={{ padding: "15px" }}
          size={800}
          align="center"
          weight="medium"
        >
          {formatTimeToHHMMSS(totalDuration - countedDuration)}
        </Text>
      </div>
    </div>
  );
}

export default StopwatchTimer;
