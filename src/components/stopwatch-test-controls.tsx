import { Button, makeStyles, mergeClasses } from "@fluentui/react-components";
import { StopFilled, PauseFilled, PlayFilled } from "@fluentui/react-icons";

import type { BaseProps } from "../helpers/base-props.ts";

import WithConfirmation from "./button-with-confirmation.tsx";

const useClasses = makeStyles({
  container: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    width: "100%",
  },
});

interface StopwatchTestControlsProps extends BaseProps {
  isPaused: boolean;
  isStarted: boolean;
  onPause: () => void;
  onPlay: () => void;
  onStart: () => void;
  onStop: () => void;
}

function StopwatchTestControls({
  isPaused,
  isStarted,
  onPause,
  onPlay,
  onStart,
  onStop,
  ...props
}: StopwatchTestControlsProps) {
  const classes = useClasses();

  const PlayOrPause = isStarted
    ? isPaused
      ? PlayFilled
      : PauseFilled
    : PlayFilled;

  const action = isStarted ? (isPaused ? onPlay : onPause) : onStart;

  return (
    <div
      {...props}
      className={mergeClasses(classes.container, props.className)}
    >
      <Button
        icon={<PlayOrPause />}
        onClick={(e) => {
          e.preventDefault();
          action();
        }}
        shape="circular"
        size="large"
      />
      <WithConfirmation
        description="Deseja parar o timer?"
        disabled={!isStarted}
        onConfirm={() => onStop()}
        title="Confirmar"
      >
        <Button
          disabled={!isStarted}
          icon={<StopFilled />}
          shape="circular"
          size="large"
        />
      </WithConfirmation>
    </div>
  );
}

export default StopwatchTestControls;
