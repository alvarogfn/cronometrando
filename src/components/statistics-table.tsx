import type {TableHeaderProps} from "@fluentui/react-components";

import { makeStyles,
  TableBody,
  TableCell,
  TableRow,
  Table,
  TableHeader,
  TableHeaderCell,
  Card,
  tokens,
  Text  } from "@fluentui/react-components";
import { formatSecondsToMMSS } from "helpers/format-seconds-to-mmss.ts";
import { formatTimeToDDMMHHSS } from "helpers/format-time-to-ddmmhhss.ts";
import { average, highest, lowest } from "helpers/statistics-helpers.ts";
import useTestFindAll from "hooks/use-test-find-all.ts";
import { TableVirtuoso } from "react-virtuoso";

import type { BaseProps } from "../helpers/base-props.ts";

import StatisticsItemDialog from "./statistics-item-dialog.tsx";

const columns = [
  { columnKey: "id", label: "ID" },
  { columnKey: "average", label: "Média / Ques." },
  { columnKey: "longerTime", label: "Maior tempo / Ques." },
  { columnKey: "shorterTime", label: "Menor tempo / Ques." },
  { columnKey: "quantity", label: "Resolvidas / Prova" },
  { columnKey: "testDuration", label: "Duração / Prova" },
  { columnKey: "date", label: "Dia e Hora" },
];

interface StatisticsTableProps extends BaseProps {}

const useStyles = makeStyles({
  table: {
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  tableHeader: {
    backgroundColor: tokens.colorNeutralBackground1,
    height: "60px",
  },
});

const pickCountedDuration = ({ countedDuration = 0 }) => countedDuration;

function TableHead(props: TableHeaderProps) {
  const classes = useStyles();

  return <TableHeader {...props} className={classes.tableHeader} />;
}

function StatisticsTable({ className }: StatisticsTableProps) {
  const { data } = useTestFindAll();
  const classes = useStyles();

  if (data.length === 0) {
    return <Card className={className}>Nenhum dado salvo.</Card>;
  }

  return (
    <Card className={className} style={{ height: 400 }}>
      <TableVirtuoso
        className={classes.table}
        components={{
          Table,
          TableBody,
          TableHead,
          TableRow: StatisticsItemDialog,
        }}
        computeItemKey={(_, item) => item.id}
        context={data}
        data={data}
        fixedHeaderContent={() => {
          return (
            <TableRow>
              {columns.map((column) => (
                <TableHeaderCell key={column.columnKey}>
                  {column.label}
                </TableHeaderCell>
              ))}
            </TableRow>
          );
        }}
        itemContent={(_, item) => {
          const questionAverage = average(item.questions, pickCountedDuration);

          const questionHightest = highest(item.questions, pickCountedDuration);

          const questionLowest = lowest(item.questions, pickCountedDuration);

          return (
            <>
              <TableCell>
                <Text size={200} weight="bold">
                  #{item.id}
                </Text>
              </TableCell>
              <TableCell>{formatSecondsToMMSS(questionAverage)}</TableCell>
              <TableCell>{formatSecondsToMMSS(questionHightest)}</TableCell>
              <TableCell>{formatSecondsToMMSS(questionLowest)}</TableCell>
              <TableCell>{item.questions.length}</TableCell>
              <TableCell>{formatSecondsToMMSS(item.countedDuration)}</TableCell>
              <TableCell>{formatTimeToDDMMHHSS(item.endedAt)}</TableCell>
            </>
          );
        }}
      />
    </Card>
  );
}

export default StatisticsTable;
