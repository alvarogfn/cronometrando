import type { TestWithQuestions } from "api/models.ts";
import type { TableHeaderProps } from "@fluentui/react-components";

import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Input,
  makeStyles,
  mergeClasses,
  TableBody,
  TableCell,
  Table,
  TableHeader,
  TableHeaderCell,
  TableRow,
  tokens,
  Text,
} from "@fluentui/react-components";
import { formatSecondsToMMSS } from "helpers/format-seconds-to-mmss.ts";
import { formatTimeToDDMMHHSS } from "helpers/format-time-to-ddmmhhss.ts";
import { average, highest, lowest } from "helpers/statistics-helpers.ts";
import useTestFindAll from "hooks/use-test-find-all.ts";
import { useTestRename } from "hooks/use-test-rename.ts";
import { useMemo, useState } from "react";
import { TableVirtuoso } from "react-virtuoso";

import type { BaseProps } from "../helpers/base-props.ts";

import StatisticsItemDialog from "./statistics-item-dialog.tsx";

const columns: {
  columnKey: string;
  compactHidden?: boolean;
  label: string;
}[] = [
  { columnKey: "id", label: "Prova" },
  { columnKey: "average", label: "Média / Ques.", compactHidden: true },
  {
    columnKey: "longerTime",
    label: "Maior tempo / Ques.",
    compactHidden: true,
  },
  {
    columnKey: "shorterTime",
    label: "Menor tempo / Ques.",
    compactHidden: true,
  },
  { columnKey: "quantity", label: "Questões" },
  { columnKey: "testDuration", label: "Duração" },
  { columnKey: "date", label: "Dia e hora" },
];

interface StatisticsTableProps extends BaseProps {}

const useStyles = makeStyles({
  compactHidden: {
    "@media (max-width: 700px)": {
      display: "none",
    },
  },
  dateColumn: {
    minWidth: "140px",
    whiteSpace: "nowrap",
    width: "140px",
    "@media (max-width: 700px)": {
      fontSize: "11px",
      minWidth: "118px",
      width: "118px",
    },
  },
  durationColumn: {
    "@media (max-width: 700px)": {
      minWidth: "74px",
      width: "74px",
    },
  },
  quantityColumn: {
    "@media (max-width: 700px)": {
      minWidth: "54px",
      textAlign: "center",
      width: "54px",
    },
  },
  statisticsCard: {
    height: "400px",
    minWidth: 0,
    width: "100%",
    "@media (max-width: 700px)": {
      height: "min(55vh, 400px)",
      minHeight: "280px",
    },
  },
  table: {
    maxWidth: "100%",
    overflowX: "auto",
    width: "100%",
    "@media (min-width: 701px)": {
      "&::-webkit-scrollbar": { display: "none" },
    },
  },
  tableHeader: {
    backgroundColor: tokens.colorNeutralBackground1,
    height: "60px",
  },
  testNameColumn: {
    minWidth: "220px",
    width: "220px",
    "@media (max-width: 700px)": {
      minWidth: "100px",
      width: "100px",
    },
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
  const [testToRename, setTestToRename] = useState<TestWithQuestions | null>(
    null,
  );
  const [draftName, setDraftName] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const renameTest = useTestRename(testToRename?.id ?? "");
  const tableContext = useMemo(
    () => ({
      onEditName: (item: TestWithQuestions) => {
        setDraftName(item.name?.trim() ?? "");
        setTestToRename(item);
      },
    }),
    [],
  );

  const saveName = () => {
    if (!testToRename) return;

    setIsSavingName(true);
    renameTest(draftName.trim())
      .then(() => setTestToRename(null))
      .catch(console.warn)
      .finally(() => setIsSavingName(false));
  };

  if (data.length === 0) {
    return <Card className={className}>Nenhum dado salvo.</Card>;
  }

  return (
    <>
      <Card className={mergeClasses(className, classes.statisticsCard)}>
        <TableVirtuoso
          className={classes.table}
          components={{
            Table,
            TableBody,
            TableHead,
            TableRow: StatisticsItemDialog,
          }}
          computeItemKey={(_, item) => item.id}
          context={tableContext}
          data={data}
          fixedHeaderContent={() => {
            return (
              <TableRow>
                {columns.map((column) => (
                  <TableHeaderCell
                    className={
                      column.compactHidden
                        ? classes.compactHidden
                        : column.columnKey === "id"
                          ? classes.testNameColumn
                          : column.columnKey === "quantity"
                            ? classes.quantityColumn
                            : column.columnKey === "testDuration"
                              ? classes.durationColumn
                              : column.columnKey === "date"
                                ? classes.dateColumn
                                : undefined
                    }
                    key={column.columnKey}
                  >
                    {column.label}
                  </TableHeaderCell>
                ))}
              </TableRow>
            );
          }}
          itemContent={(_, item) => {
            const questionAverage = average(
              item.questions,
              pickCountedDuration,
            );
            const questionHightest = highest(
              item.questions,
              pickCountedDuration,
            );
            const questionLowest = lowest(item.questions, pickCountedDuration);

            return (
              <>
                <TableCell className={classes.testNameColumn}>
                  <Text size={200} weight="bold">
                    {item.name?.trim() || "Prova sem nome"}
                  </Text>
                </TableCell>
                <TableCell className={classes.compactHidden}>
                  {formatSecondsToMMSS(questionAverage)}
                </TableCell>
                <TableCell className={classes.compactHidden}>
                  {formatSecondsToMMSS(questionHightest)}
                </TableCell>
                <TableCell className={classes.compactHidden}>
                  {formatSecondsToMMSS(questionLowest)}
                </TableCell>
                <TableCell className={classes.quantityColumn}>
                  {item.questions.length}
                </TableCell>
                <TableCell className={classes.durationColumn}>
                  {formatSecondsToMMSS(item.countedDuration)}
                </TableCell>
                <TableCell className={classes.dateColumn}>
                  {formatTimeToDDMMHHSS(item.endedAt)}
                </TableCell>
              </>
            );
          }}
        />
      </Card>

      <Dialog
        onOpenChange={(_, dialogState) => {
          if (!dialogState.open) setTestToRename(null);
        }}
        open={testToRename !== null}
      >
        <DialogSurface style={{ width: "min(360px, 92vw)" }}>
          <DialogBody>
            <DialogTitle>Editar nome da prova</DialogTitle>
            <DialogContent>
              <Input
                autoFocus
                onChange={(event) => setDraftName(event.currentTarget.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !isSavingName) saveName();
                }}
                placeholder="Nome da prova"
                style={{ width: "100%" }}
                value={draftName}
              />
            </DialogContent>
            <DialogActions>
              <Button
                appearance="primary"
                disabled={isSavingName}
                onClick={saveName}
              >
                Salvar nome
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
}

export default StatisticsTable;
