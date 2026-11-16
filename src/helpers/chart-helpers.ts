import type { StopwatchQuestionModel } from "api/models.ts";
import type { ChartOptions } from "chart.js";
import type { ChartProps } from "react-chartjs-2";

import { webDarkTheme } from "@fluentui/react-components";
import merge from "deepmerge";

import { formatSecondsToMMSS } from "./format-seconds-to-mmss.ts";

const baseStyles: ChartOptions<"line">["scales"] = {
  x: {
    border: { color: "#FFFFFF30" },
    grid: { color: "#FFFFFF18" },
    ticks: { color: "white" },
  },
  y: {
    border: { color: "#FFFFFF30" },
    grid: { color: "#FFFFFF18" },
    ticks: { color: "white" },
  },
};

export function buildQuestionChartParams(
  questions: StopwatchQuestionModel[],
): Pick<ChartProps<"line">, "data" | "options"> {
  const durations = questions.map(({ countedDuration }) => countedDuration);
  const minDuration = durations.length > 0 ? Math.min(...durations) : 0;
  const maxDuration = durations.length > 0 ? Math.max(...durations) : 0;
  const threshold = Math.max((maxDuration - minDuration) * 0.05, 1);
  const yMin = Math.max(minDuration - threshold, 0);
  const yMax = Math.max(maxDuration + threshold, yMin + 1);
  const count = durations.length;
  const meanX = count > 0 ? (count + 1) / 2 : 0;
  const meanY =
    durations.reduce((sum, duration) => sum + duration, 0) / (count || 1);
  const varianceX = durations.reduce(
    (sum, _, index) => sum + (index + 1 - meanX) ** 2,
    0,
  );
  const covarianceXY = durations.reduce(
    (sum, duration, index) => sum + (index + 1 - meanX) * (duration - meanY),
    0,
  );
  const slope = varianceX === 0 ? 0 : covarianceXY / varianceX;
  const intercept = meanY - slope * meanX;
  const trendDurations = durations.map(
    (_, index) => intercept + slope * (index + 1),
  );

  return {
    data: {
      datasets: [
        {
          backgroundColor: webDarkTheme.colorBrandBackground,
          borderColor: webDarkTheme.colorBrandBackground,
          borderWidth: 2,
          data: durations,
          label: "Tempo por questão",
          pointHoverRadius: 6,
          pointRadius: 4,
          tension: 0.25,
          xAxisID: "x",
          yAxisID: "y",
        },
        {
          backgroundColor: "#FFB74D",
          borderColor: "#FFB74D",
          borderDash: [6, 4],
          borderWidth: 2,
          data: trendDurations,
          label: "Tendência (regressão linear)",
          pointRadius: 0,
          tension: 0,
          xAxisID: "x",
          yAxisID: "y",
        },
      ],
      labels: questions.map((_, index) => index + 1),
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label(context) {
              return `${context.dataset.label}: ${formatSecondsToMMSS(Number(context.formattedValue))}`;
            },
            title(tooltipItems): string | string[] | void {
              return tooltipItems.map((item) => "Questão " + item.label);
            },
          },
          enabled: true,
        },
        legend: {
          labels: {
            color: "white",
            usePointStyle: true,
          },
          position: "top",
        },
      },
      scales: merge<ChartOptions<"line">["scales"]>(baseStyles, {
        x: {
          axis: "x",
        },
        y: {
          axis: "y",
          beginAtZero: false,
          max: yMax,
          min: yMin,
          ticks: {
            callback: (value) => formatSecondsToMMSS(value as number),
          },
        },
      }),
    },
  };
}
