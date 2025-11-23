import type { Fn } from "helpers/types.ts";
import type { ReactElement } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
} from "@fluentui/react-components";

interface WithConfirmationProps {
  children?: ReactElement;
  description: string;
  disabled?: boolean;
  onCancel?: Fn;
  onConfirm?: Fn;
  title: string;
}

function WithConfirmation({
  children,
  description,
  disabled = false,
  onCancel,
  onConfirm,
  title,
}: WithConfirmationProps) {
  return (
    <Dialog>
      <DialogTrigger
        action={disabled ? "close" : "open"}
        disableButtonEnhancement
      >
        {children}
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>{description}</DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="primary" onClick={() => onConfirm?.()}>
                Sim
              </Button>
            </DialogTrigger>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary" onClick={() => onCancel?.()}>
                Não
              </Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

export default WithConfirmation;
