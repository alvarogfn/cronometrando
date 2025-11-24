import type { ChartProps } from "react-chartjs-2";

import {
  makeStyles,
  mergeClasses,
  Subtitle2,
} from "@fluentui/react-components";
import {
  CategoryScale,
  Chart,
  LinearScale,
  LineElement,
  PointElement,
  Title,
} from "chart.js";
import deepmerge from "deepmerge";
import { Line } from "react-chartjs-2";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title);

const useStyles = makeStyles({
  chart: {
    position: "relative",
  },
  container: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "30px",
    overflow: "hidden",
  },
});

interface LineChartProps extends Omit<ChartProps<"line">, "type"> {
  title: string;
}

function LineChart({ className, title, ...props }: LineChartProps) {
  const classes = useStyles();

  return (
    <div className={mergeClasses(classes.container, className)}>
      <Subtitle2>{title}</Subtitle2>
      <div className={classes.chart} style={{ height: "300px", width: "100%" }}>
        <Line
          {...props}
          options={deepmerge({ responsive: true }, { ...props.options })}
        />
      </div>
    </div>
  );
}

export default LineChart;
