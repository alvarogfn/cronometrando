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
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  disabled: boolean;
}

function StopwatchQuestionControls({
  onNext,
  disabled,
  ...props
}: StopwatchQuestionControlsProps) {
  const classes = useClasses();

  return (
    <div
      {...props}
      className={mergeClasses(classes.container, props.className)}
    >
      <Button
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault();
          onNext();
        }}
        size="large"
      >
        (K) Próxima
      </Button>
    </div>
  );
}

export default StopwatchQuestionControls;
