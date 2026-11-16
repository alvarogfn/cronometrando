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

const columns = [
  { columnKey: "id", label: "Prova" },
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
  testNameColumn: {
    minWidth: "220px",
    width: "220px",
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
          context={tableContext}
          data={data}
          fixedHeaderContent={() => {
            return (
              <TableRow>
                {columns.map((column) => (
                  <TableHeaderCell
                    className={
                      column.columnKey === "id"
                        ? classes.testNameColumn
                        : undefined
                    }
                    key={column.columnKey}
                    style={
                      column.columnKey === "date"
                        ? { minWidth: "140px", width: "140px" }
                        : undefined
                    }
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
                <TableCell>{formatSecondsToMMSS(questionAverage)}</TableCell>
                <TableCell>{formatSecondsToMMSS(questionHightest)}</TableCell>
                <TableCell>{formatSecondsToMMSS(questionLowest)}</TableCell>
                <TableCell>{item.questions.length}</TableCell>
                <TableCell>
                  {formatSecondsToMMSS(item.countedDuration)}
                </TableCell>
                <TableCell
                  style={{
                    minWidth: "140px",
                    whiteSpace: "nowrap",
                    width: "140px",
                  }}
                >
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
        <DialogSurface style={{ width: "360px" }}>
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
