import { Button, makeStyles, mergeClasses } from "@fluentui/react-components";
import { StopFilled, PauseFilled, PlayFilled } from "@fluentui/react-icons";
import type { BaseProps } from "../helpers/base-props.ts";

const useClasses = makeStyles({
  container: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    gap: "10px",
  },
});

interface StopwatchTestControlsProps extends BaseProps {
  isPaused: boolean;
  onStart: () => void;
  onPlay: () => void;
  onStop: () => void;
  onPause: () => void;
  isRunning: boolean;
}

function StopwatchTestControls({
  isPaused,
  onStart,
  onPlay,
  isRunning,
  onPause,
  onStop,
  ...props
}: StopwatchTestControlsProps) {
  const classes = useClasses();

  const PlayOrPause = isPaused ? PlayFilled : PauseFilled;
  const action = isRunning ? (isPaused ? onPlay : onPause) : onStart;

  return (
    <div
      {...props}
      className={mergeClasses(classes.container, props.className)}
    >
      <Button
        size="large"
        shape="circular"
        onClick={(e) => {
          e.preventDefault();
          action();
        }}
        icon={<PlayOrPause />}
      />
      <Button
        size="large"
        shape="circular"
        disabled={!isRunning}
        onClick={(e) => {
          e.preventDefault();
          onStop();
        }}
        icon={<StopFilled />}
      />
    </div>
  );
}

export default StopwatchTestControls;
