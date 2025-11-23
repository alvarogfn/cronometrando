import { Button, makeStyles, mergeClasses } from "@fluentui/react-components";
import { StopFilled, PauseFilled, PlayFilled } from "@fluentui/react-icons";
import type { BaseProps } from "../helpers/base-props.ts";
import WithConfirmation from "./button-with-confirmation.tsx";

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
  isStarted: boolean;
}

function StopwatchTestControls({
  isPaused,
  onStart,
  onPlay,
  isStarted,
  onPause,
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
        size="large"
        shape="circular"
        onClick={(e) => {
          e.preventDefault();
          action();
        }}
        icon={<PlayOrPause />}
      />
      <WithConfirmation
        title="Confirmar"
        description="Deseja parar o timer?"
        disabled={!isStarted}
        onConfirm={() => onStop()}
      >
        <Button
          size="large"
          shape="circular"
          disabled={!isStarted}
          icon={<StopFilled />}
        />
      </WithConfirmation>
    </div>
  );
}

export default StopwatchTestControls;
