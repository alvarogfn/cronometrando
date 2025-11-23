import { Button, makeStyles, mergeClasses } from "@fluentui/react-components";

import type { BaseProps } from "../helpers/base-props.ts";

const useClasses = makeStyles({
  container: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    width: "100%",
  },
});

interface StopwatchQuestionControlsProps extends BaseProps {
  disabled: boolean;
  onNext: () => void;
  onPause: () => void;
  onPlay: () => void;
}

function StopwatchQuestionControls({
  disabled,
  onNext,
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
