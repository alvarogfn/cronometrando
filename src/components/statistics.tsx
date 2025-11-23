import {
  TableBody,
  TableCell,
  TableRow,
  Table,
  TableHeader,
  TableHeaderCell,
  Card,
} from "@fluentui/react-components";
import { formatSecondsToMMSS } from "helpers/format-seconds-to-mmss.ts";
import { formatTimeToDDMMHHSS } from "helpers/format-time-to-ddmmhhss.ts";
import { average, highest, lowest } from "helpers/statistics.ts";
import useStopwatchPreviousData from "hooks/use-stopwatch-previous-data.ts";

import type { BaseProps } from "../helpers/base-props.ts";

const columns = [
  { columnKey: "average", label: "Média / Ques." },
  { columnKey: "longerTime", label: "Maior tempo / Ques." },
  { columnKey: "shorterTime", label: "Menor tempo / Ques." },
  { columnKey: "quantity", label: "Resolvidas / Prova" },
  { columnKey: "date", label: "Dia e Hora" },
];

interface StatisticsProps extends BaseProps {}

const pickCountedDuration = ({ countedDuration = 0 }) => countedDuration;

function Statistics({ className }: StatisticsProps) {
  const { data } = useStopwatchPreviousData();
  console.log(data);

  if (data.length === 0) {
    return <Card className={className}>Nenhum dado salvo.</Card>;
  }

  return (
    <Card className={className}>
      <Table style={{ minWidth: 400, overflowY: "scroll" }}>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHeaderCell key={column.columnKey}>
                {column.label}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody style={{ maxHeight: 100 }}>
          {data.map((item) => {
            const questionAverage = average(
              item.questions,
              pickCountedDuration,
            );

            const questionHightest = highest(
              item.questions,
              pickCountedDuration,
            );

            const questionLowest = lowest(item.questions, pickCountedDuration);
            console.log(questionLowest);
            return (
              <TableRow key={item.id}>
                <TableCell>{formatSecondsToMMSS(questionAverage)}</TableCell>
                <TableCell>{formatSecondsToMMSS(questionHightest)}</TableCell>
                <TableCell>{formatSecondsToMMSS(questionLowest)}</TableCell>
                <TableCell>{item.questions.length}</TableCell>
                <TableCell>{formatTimeToDDMMHHSS(item.endedAt)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}

export default Statistics;
