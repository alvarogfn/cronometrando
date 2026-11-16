import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";

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
    transition: "width 200ms ease, background-color 200ms ease",
    width: "100%",
  },
});

function ProgressBar({
  className,
  percentage,
  timedOut = false,
}: ProgressBarProps) {
  const classes = useClasses();
  const remainingPercent = Number.isFinite(percentage)
    ? Math.round(Math.min(Math.max(percentage, 0), 1) * 100)
    : 0;

  const backgroundColor = timedOut
    ? tokens.colorPaletteRedBackground3
    : `color-mix(in srgb, ${tokens.colorBrandBackground} ${remainingPercent}%, ${tokens.colorPaletteRedBackground3} ${100 - remainingPercent}%)`;

  return (
    <div className={mergeClasses(className, classes.container)}>
      <div
        className={classes.innerContainer}
        style={{
          width: widthWithPercentage(percentage),
          backgroundColor,
        }}
      />
    </div>
  );
}

export default ProgressBar;
