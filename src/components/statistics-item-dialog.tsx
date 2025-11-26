import type { TestWithQuestions } from "api/models.ts";
import type {PropsWithChildren} from "react";

import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  TableRow,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { DeleteFilled } from "@fluentui/react-icons";
import { buildQuestionChartParams } from "helpers/chart-helpers.ts";
import { useTestDelete } from "hooks/use-test-delete.ts";
import {  useMemo, lazy  } from "react";
import { createPortal } from "react-dom";

const LineChart = lazy(() => import("./line-chart"));

type StatisticsItemDialogProps = PropsWithChildren<{
  item: TestWithQuestions;
}>;

const useStyles = makeStyles({
  removeButton: {
    "&:hover": {
      "&:active": {
        backgroundColor: tokens.colorStatusDangerBackground3Pressed,
      },
      backgroundColor: tokens.colorStatusDangerBackground3Hover,
    },
    backgroundColor: tokens.colorStatusDangerBackground3,
  },
  title: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
  },
});

function StatisticsItemDialog({
  children,
  item,
  ...props
}: StatisticsItemDialogProps) {
  const deleteTest = useTestDelete(item.id);
  const classes = useStyles();

  const questionPerTime = useMemo(() => {
    return buildQuestionChartParams(item.questions);
  }, [item.questions]);

  return (
    <Dialog>
      <DialogTrigger disableButtonEnhancement>
        <TableRow {...props}>{children}</TableRow>
      </DialogTrigger>
      {createPortal(
        <DialogSurface style={{ width: "80vw" }}>
          <DialogBody>
            <DialogTitle className={classes.title}>
              {item.id}
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
            </DialogTitle>
            <DialogContent>
              <LineChart title="Tempo / Questão" {...questionPerTime} />
            </DialogContent>
          </DialogBody>
        </DialogSurface>,
        document.body,
      )}
    </Dialog>
  );
}

export default StatisticsItemDialog;
