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
import type { Fn } from "helpers/types.ts";
import type { ReactElement } from "react";

interface WithConfirmationProps {
  title: string;
  description: string;
  onCancel?: Fn;
  onConfirm?: Fn;
  disabled?: boolean;
  children?: ReactElement;
}

function WithConfirmation({
  disabled = false,
  onConfirm,
  title,
  onCancel,
  description,
  children,
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
              <Button onClick={() => onConfirm?.()} appearance="primary">
                Sim
              </Button>
            </DialogTrigger>
            <DialogTrigger disableButtonEnhancement>
              <Button onClick={() => onCancel?.()} appearance="secondary">
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
