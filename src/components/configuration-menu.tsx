import type { BaseProps } from "helpers/base-props";

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
  ToggleButton,
} from "@fluentui/react-components";
import { useStopwatchStore } from "api/store.ts";
import { useState } from "react";

const useStyles = makeStyles({
  container: {
    display: "flex",
    gap: "10px",
    flexFlow: "row no-wrap",
    width: "100%",
    "@media (max-width: 700px)": {
      flexWrap: "wrap",
    },
  },
});

interface ConfigurationMenuProps extends BaseProps {}

function ConfigurationMenu({ className }: ConfigurationMenuProps) {
  const classes = useStyles();

  const autoShutdown = useStopwatchStore((state) => state.autoShutdown);
  const isStarted = useStopwatchStore((state) => state.isStarted);
  const setAutoShutdown = useStopwatchStore((state) => state.setAutoShutdown);
  const testName = useStopwatchStore((state) => state.testName);
  const setTestName = useStopwatchStore((state) => state.setTestName);
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [draftName, setDraftName] = useState("");

  const handleInput = () => {
    setAutoShutdown(!autoShutdown);
  };
  const openNameDialog = () => {
    setDraftName(testName);
    setIsNameDialogOpen(true);
  };

  return (
    <>
      <Card className={mergeClasses(className, classes.container)}>
        <ToggleButton as="button" checked={autoShutdown} onClick={handleInput}>
          Auto-encerrar
        </ToggleButton>
        <Button disabled={isStarted} onClick={openNameDialog}>
          {testName ? "Editar nome" : "Nomear prova"}
        </Button>
      </Card>

      <Dialog
        onOpenChange={(_, data) => setIsNameDialogOpen(data.open)}
        open={isNameDialogOpen}
      >
        <DialogSurface style={{ width: "min(360px, 92vw)" }}>
          <DialogBody>
            <DialogTitle>Nome da prova</DialogTitle>
            <DialogContent>
              <Input
                autoFocus
                onChange={(event) => setDraftName(event.currentTarget.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    setTestName(draftName.trim());
                    setIsNameDialogOpen(false);
                  }
                }}
                placeholder="Ex.: Simulado de matemática"
                style={{ width: "100%" }}
                value={draftName}
              />
            </DialogContent>
            <DialogActions>
              <Button
                appearance="primary"
                onClick={() => {
                  setTestName(draftName.trim());
                  setIsNameDialogOpen(false);
                }}
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

export default ConfigurationMenu;
