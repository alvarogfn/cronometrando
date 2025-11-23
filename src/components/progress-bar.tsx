import { makeStyles, mergeClasses, tokens  } from "@fluentui/react-components";

import type { BaseProps } from "../helpers/base-props.ts";

const MAX_WIDTH = 100;

function widthWithPercentage(percentage: number) {
  if (percentage > 1) return 1;
  if (percentage < 0) return 0;

  return MAX_WIDTH * percentage + "%";
}

interface ProgressBarProps extends BaseProps {
  percentage: number;
  timedOut?: boolean;
}

const useClasses = makeStyles({
  container: {
    backgroundColor: tokens.colorNeutralBackground6,
    borderRadius: tokens.borderRadiusLarge,
    height: "20px",
    width: `${MAX_WIDTH}%`,
  },
  innerContainer: {
    backgroundColor: tokens.colorBrandBackground,
    borderRadius: tokens.borderRadiusLarge,
    height: "100%",
    transition: "200ms width",
    width: "100%",
  },
});

function ProgressBar({
  className,
  percentage,
  timedOut = false,
}: ProgressBarProps) {
  const classes = useClasses();

  const style = timedOut
    ? { backgroundColor: tokens.colorPaletteRedBackground3 }
    : {};

  return (
    <div className={mergeClasses(className, classes.container)}>
      <div
        className={classes.innerContainer}
        style={{
          width: widthWithPercentage(percentage),
          ...style,
        }}
      />
    </div>
  );
}

export default ProgressBar;
