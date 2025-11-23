import { makeStyles, mergeClasses, Text } from "@fluentui/react-components";
import ProgressBar from "../components/progress-bar.tsx";
import { formatTimeToHHMMSS } from "../helpers/format-time-to-HHMMSS.ts";
import type { BaseProps } from "../helpers/base-props.ts";

const useStyles = makeStyles({
  container: {
    display: "flex",
  },
  timer: {
    padding: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

interface StopwatchTimerProps extends BaseProps {
  totalDuration: number;
  countedDuration: number;
}

function StopwatchTimer({
  totalDuration,
  countedDuration,
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
          timedOut={timedOut}
          percentage={timedOut ? 1 : percentage}
        />
        <div className={classes.timer}>
          <Text size={800} align="center" weight="medium">
            {formatTimeToHHMMSS(timedOut ? 0 : totalDuration - countedDuration)}
          </Text>
          <Text style={{ margin: 3 }} size={300} align="end">
            {timedOut ? ` (+${countedDuration - totalDuration})` : null}
          </Text>
        </div>
      </div>
    </div>
  );
}

export default StopwatchTimer;
