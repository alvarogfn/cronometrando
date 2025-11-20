import { Button, makeStyles, mergeClasses } from "@fluentui/react-components";
import type { BaseProps } from "../helpers/base-props.ts";

const useClasses = makeStyles({
  container: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    gap: "10px",
  },
});

interface StopwatchQuestionControlsProps extends BaseProps {
  isPaused: boolean;
  onPlay: () => void;
  onPause: () => void;
  onComplete: () => void;
}

function StopwatchQuestionControls({
  isPaused,
  onComplete,
  onPause,
  onPlay,
  ...props
}: StopwatchQuestionControlsProps) {
  const classes = useClasses();

  const toggle = isPaused ? onPause : onPlay;
  const toggleText = isPaused ? "Pausar" : "Continuar";

  return (
    <div
      {...props}
      className={mergeClasses(classes.container, props.className)}
    >
      <Button
        onClick={(e) => {
          e.preventDefault();
          toggle();
        }}
        size="large"
        appearance="primary"
      >
        {toggleText}
      </Button>
      <Button
        onClick={(e) => {
          e.preventDefault();
          onComplete();
        }}
        size="large"
      >
        (K) Próxima
      </Button>
    </div>
  );
}

export default StopwatchQuestionControls;
