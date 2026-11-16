import type { TestWithQuestions } from "api/models.ts";
import type { PropsWithChildren } from "react";

import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Text,
  TableRow,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { DeleteFilled, EditFilled } from "@fluentui/react-icons";
import { buildQuestionChartParams } from "helpers/chart-helpers.ts";
import { formatSecondsToMMSS } from "helpers/format-seconds-to-mmss.ts";
import { useTestDelete } from "hooks/use-test-delete.ts";
import { lazy, useMemo } from "react";
import { createPortal } from "react-dom";

const LineChart = lazy(() => import("./line-chart"));

type StatisticsItemDialogProps = PropsWithChildren<{
  context: {
    onEditName: (item: TestWithQuestions) => void;
  };
  item: TestWithQuestions;
}>;

const useStyles = makeStyles({
  dialogBody: {
    display: "flex",
    flex: "1 1 auto",
    flexDirection: "column",
    minHeight: 0,
  },
  dialogContent: {
    display: "flex",
    flex: "1 1 auto",
    flexDirection: "column",
    minHeight: 0,
    overflowY: "auto",
  },
  chart: {
    flex: "1 1 auto",
    minHeight: "360px",
    "@media (max-width: 700px)": {
      minHeight: "280px",
    },
  },
  dialogSurface: {
    display: "flex",
    flexDirection: "column",
    height: "90vh",
    maxHeight: "90vh",
    maxWidth: "1200px",
    width: "90vw",
    "@media (max-width: 700px)": {
      height: "92vh",
      maxHeight: "92vh",
      maxWidth: "none",
      width: "calc(100vw - 16px)",
    },
  },
  removeButton: {
    "&:hover": {
      "&:active": {
        backgroundColor: tokens.colorStatusDangerBackground3Pressed,
      },
      backgroundColor: tokens.colorStatusDangerBackground3Hover,
    },
    backgroundColor: tokens.colorStatusDangerBackground3,
  },
  actions: {
    alignItems: "center",
    display: "flex",
    gap: "8px",
    "@media (max-width: 700px)": {
      flexWrap: "wrap",
      justifyContent: "flex-end",
    },
  },
  title: {
    alignItems: "center",
    display: "flex",
    gap: "8px",
    justifyContent: "space-between",
    minWidth: 0,
    "@media (max-width: 700px)": {
      alignItems: "flex-start",
      flexWrap: "wrap",
    },
  },
  summary: {
    display: "grid",
    flex: "0 0 auto",
    gap: "10px",
    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
    marginTop: "14px",
  },
  summaryItem: {
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "12px",
  },
});

function StatisticsItemDialog({
  children,
  context,
  item,
  ...props
}: StatisticsItemDialogProps) {
  const deleteTest = useTestDelete(item.id);
  const classes = useStyles();

  const statistics = useMemo(() => {
    const questions = [...item.questions].sort(
      (left, right) => left.endedAt - right.endedAt,
    );
    const byDuration = questions
      .map((question, index) => ({
        duration: question.countedDuration,
        index: index + 1,
      }))
      .sort((left, right) => left.duration - right.duration);
    const totalDuration = questions.reduce(
      (total, question) => total + question.countedDuration,
      0,
    );
    const middle = Math.floor(byDuration.length / 2);
    const median =
      byDuration.length === 0
        ? undefined
        : byDuration.length % 2 === 0
          ? (byDuration[middle - 1].duration + byDuration[middle].duration) / 2
          : byDuration[middle].duration;

    return {
      average:
        byDuration.length > 0 ? totalDuration / byDuration.length : undefined,
      chart: buildQuestionChartParams(questions),
      fastest: byDuration[0],
      median,
      questionCount: byDuration.length,
      slowest: byDuration.at(-1),
    };
  }, [item.questions]);

  const summaryItems = [
    {
      label: "Média por questão",
      value:
        statistics.average === undefined
          ? "—"
          : formatSecondsToMMSS(statistics.average),
    },
    {
      label: "Mediana",
      value:
        statistics.median === undefined
          ? "—"
          : formatSecondsToMMSS(statistics.median),
    },
    {
      label: "Mais rápida",
      value: statistics.fastest
        ? `Questão ${statistics.fastest.index} · ${formatSecondsToMMSS(statistics.fastest.duration)}`
        : "—",
    },
    {
      label: "Mais longa",
      value: statistics.slowest
        ? `Questão ${statistics.slowest.index} · ${formatSecondsToMMSS(statistics.slowest.duration)}`
        : "—",
    },
    {
      label: "Questões resolvidas",
      value: String(statistics.questionCount),
    },
    {
      label: "Tempo da prova",
      value: formatSecondsToMMSS(item.countedDuration),
    },
  ];

  return (
    <Dialog>
      <DialogTrigger disableButtonEnhancement>
        <TableRow {...props}>{children}</TableRow>
      </DialogTrigger>
      {createPortal(
        <DialogSurface className={classes.dialogSurface}>
          <DialogBody className={classes.dialogBody}>
            <DialogTitle className={classes.title}>
              {item.name?.trim() || "Prova sem nome"}
              <div className={classes.actions}>
                <Button
                  icon={<EditFilled />}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    context.onEditName(item);
                  }}
                >
                  Editar nome
                </Button>
                <DialogTrigger>
                  <Button
                    appearance="primary"
                    className={classes.removeButton}
                    icon={<DeleteFilled />}
                    onClick={deleteTest}
                  >
                    Deletar
                  </Button>
                </DialogTrigger>
              </div>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
              <LineChart
                className={classes.chart}
                title="Tempo / Questão"
                {...statistics.chart}
              />
              <div className={classes.summary}>
                {summaryItems.map((summaryItem) => (
                  <div className={classes.summaryItem} key={summaryItem.label}>
                    <Text size={200}>{summaryItem.label}</Text>
                    <Text size={400} weight="semibold">
                      {summaryItem.value}
                    </Text>
                  </div>
                ))}
              </div>
            </DialogContent>
          </DialogBody>
        </DialogSurface>,
        document.body,
      )}
    </Dialog>
  );
}

export default StatisticsItemDialog;
