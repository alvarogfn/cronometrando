import type { StopwatchQuestionModel } from "api/models.ts";
import type { ChartOptions } from "chart.js";
import type { ChartProps } from "react-chartjs-2";

import { webDarkTheme } from "@fluentui/react-components";
import merge from "deepmerge";

import { formatSecondsToMMSS } from "./format-seconds-to-mmss.ts";
import { highest } from "./statistics-helpers.ts";

const baseStyles: ChartOptions["scales"] = {
  x: {
    border: { color: "#FFFFFF50" },
    grid: { color: "#FFFFFF50" },
    ticks: { color: "white" },
  },
  y: {
    grid: { color: "#FFFFFF50" },
    ticks: { color: "white" },
  },
};

export function buildQuestionChartParams(
  questions: StopwatchQuestionModel[],
): Pick<ChartProps<"line">, "data" | "options"> {
  const maxDuration = highest(
    questions,
    ({ countedDuration }) => countedDuration,
  );

  return {
    data: {
      datasets: [
        {
          backgroundColor: webDarkTheme.colorBrandBackground2,
          borderColor: webDarkTheme.colorBrandBackground,
          data: questions.map((question) => question.countedDuration),
          xAxisID: "x",
          yAxisID: "y",
        },
      ],
      labels: questions.map((_, index) => index + 1),
    },
    options: {
      scales: merge<ChartOptions<"line">["scales"]>(
        {
          y: {
            axis: "y",
            beginAtZero: true,
            max: maxDuration * 2,
            ticks: {
              callback: (value) => formatSecondsToMMSS(value as number),
            },
          },
        },
        { ...baseStyles } as any,
      ),
    },
  };
}
