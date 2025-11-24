import type { TestWithQuestions } from "api/models.ts";
import type { ChartData, ChartOptions } from "chart.js";

import { webDarkTheme } from "@fluentui/react-components";
import type { ChartProps } from "react-chartjs-2";

export function buildQuestionChartData(
  data: TestWithQuestions,
): Pick<ChartProps<"line">, "data" | "options"> {
  const { questions } = data;

  return {
    data: {
      datasets: [
        {
          data: [1, 2, 3],
          xAxisID: "xAxis",
          yAxisID: "yAxis",
        },
      ],
      // labels: questions.map((_, index) => index + 1),
    },
    options: {
      scales: {
        xAxis: { axis: "x", labels: ["x", "y", "z"] },
        yAxis: { axis: "y", labels: ["a", "b", "c"] },
      },
    },
  };
}
