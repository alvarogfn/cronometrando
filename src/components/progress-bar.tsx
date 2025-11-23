import { makeStyles, mergeClasses } from "@fluentui/react-components";
import { tokens } from "@fluentui/react-components";
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
    height: "20px",
    width: `${MAX_WIDTH}%`,
    borderRadius: tokens.borderRadiusLarge,
  },
  innerContainer: {
    borderRadius: tokens.borderRadiusLarge,
    backgroundColor: tokens.colorBrandBackground,
    width: "100%",
    height: "100%",
    transition: "200ms width",
  },
});

function ProgressBar({
  percentage,
  className,
  timedOut = false,
}: ProgressBarProps) {
  const classes = useClasses();

  const style = timedOut
    ? { backgroundColor: tokens.colorPaletteRedBackground3 }
    : {};

  return (
    <div className={mergeClasses(className, classes.container)}>
      <div
        style={{
          width: widthWithPercentage(percentage),
          ...style,
        }}
        className={classes.innerContainer}
      />
    </div>
  );
}

export default ProgressBar;
