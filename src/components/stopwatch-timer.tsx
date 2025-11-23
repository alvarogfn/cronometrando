import { makeStyles, mergeClasses, Text } from "@fluentui/react-components";
import { formatTimeToHHMMSS } from "helpers/format-time-to-hhmmss.ts";

import type { BaseProps } from "../helpers/base-props.ts";

import ProgressBar from "../components/progress-bar.tsx";

const useStyles = makeStyles({
  container: {
    display: "flex",
  },
  timer: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    padding: "15px",
  },
});

interface StopwatchTimerProps extends BaseProps {
  countedDuration: number;
  totalDuration: number;
}

function StopwatchTimer({
  countedDuration,
  totalDuration,
  ...props
}: StopwatchTimerProps) {
  const classes = useStyles();

  const percentage = (totalDuration - countedDuration) / totalDuration;

  const timedOut = countedDuration >= totalDuration;

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
        <ProgressBar
          percentage={timedOut ? 1 : percentage}
          timedOut={timedOut}
        />
        <div className={classes.timer}>
          <Text align="center" size={800} weight="medium">
            {formatTimeToHHMMSS(timedOut ? 0 : totalDuration - countedDuration)}
          </Text>
          <Text align="end" size={300} style={{ margin: 3 }}>
            {timedOut ? ` (+${countedDuration - totalDuration})` : null}
          </Text>
        </div>
      </div>
    </div>
  );
}

export default StopwatchTimer;
