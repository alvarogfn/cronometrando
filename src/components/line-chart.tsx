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
  Legend,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import deepmerge from "deepmerge";
import { Line } from "react-chartjs-2";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  LineElement,
  Title,
  Legend,
);

const useStyles = makeStyles({
  chart: {
    position: "relative",
  },
  container: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    height: "100%",
    minHeight: "360px",
    marginTop: 0,
    overflow: "hidden",
    "@media (max-width: 700px)": {
      minHeight: "280px",
    },
  },
  plot: {
    flex: "1 1 auto",
    minHeight: "320px",
    position: "relative",
    width: "100%",
    "@media (max-width: 700px)": {
      minHeight: "240px",
    },
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
      <div className={classes.plot}>
        <Line
          {...props}
          options={deepmerge(
            { maintainAspectRatio: false, responsive: true },
            { ...props.options },
          )}
        />
      </div>
    </div>
  );
}

export default LineChart;
