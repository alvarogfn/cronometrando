import { Button, makeStyles, mergeClasses } from "@fluentui/react-components";
import {
  ArrowResetRegular,
  PauseFilled,
  PlayFilled,
} from "@fluentui/react-icons";
import type { BaseProps } from "../helpers/base-props.ts";

const useClasses = makeStyles({
  container: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    gap: "10px",
  },
});

interface StopwatchControlsProps extends BaseProps {
  isPaused: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
}

function StopwatchControls({
  isPaused,
  onPlay,
  onPause,
  onReset,
  ...props
}: StopwatchControlsProps) {
  const classes = useClasses();

  const PlayOrPause = isPaused ? PlayFilled : PauseFilled;

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

          if (isPaused) onPlay();
          else onPause();
        }}
        icon={<PlayOrPause />}
      />
      <Button
        size="large"
        shape="circular"
        onClick={(e) => {
          e.preventDefault();
          onReset();
        }}
        icon={<ArrowResetRegular />}
      />
    </div>
  );
}

export default StopwatchControls;
