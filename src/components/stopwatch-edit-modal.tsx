import type { DeepPartial, SubmitHandler } from "react-hook-form";

import {
  Button,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  makeStyles,
} from "@fluentui/react-components";
import { SaveFilled } from "@fluentui/react-icons";
import { formatTimeToHHMMSS } from "helpers/format-time-to-hhmmss.ts";
import { getSecondsFromHHMMSS } from "helpers/get-seconds-from-hhmmss.ts";
import { useForm } from "react-hook-form";

import TimeField from "../components/time-field.tsx";

interface InternalForm {
  totalDuration: string;
}

interface ExternalForm {
  totalDuration: number;
}

interface StopwatchEditModalProps {
  defaultValues: DeepPartial<ExternalForm>;
  disabled: boolean;
  onSubmit: (value: ExternalForm["totalDuration"]) => void;
  values: ExternalForm;
}

const useClasses = makeStyles({
  timeField: {
    margin: "10px 0",
    width: "100%",
  },
});

function StopwatchEditModal({
  defaultValues,
  disabled,
  onSubmit,
  values,
}: StopwatchEditModalProps) {
  const defaultTotalDuration = formatTimeToHHMMSS(
    defaultValues["totalDuration"] ?? 0,
  );

  const classes = useClasses();

  const form = useForm<InternalForm>({
    defaultValues: { totalDuration: defaultTotalDuration },
    values: { totalDuration: formatTimeToHHMMSS(values.totalDuration) },
  });

  const submitHandler: SubmitHandler<InternalForm> = (value) => {
    const totalDuration = getSecondsFromHHMMSS(value.totalDuration);
    onSubmit(totalDuration);
  };

  return (
    <DialogSurface style={{ width: "300px" }}>
      <DialogBody>
        <DialogTitle>Editar Temporizador</DialogTitle>
        <DialogContent>
          <TimeField
            className={classes.timeField}
            control={form.control}
            defaultValue={defaultTotalDuration}
            disabled={disabled}
            name="totalDuration"
          />
        </DialogContent>
        <DialogActions>
          <Button appearance="secondary" onClick={() => form.reset()}>
            Resetar
          </Button>
          <DialogTrigger action="close" disableButtonEnhancement>
            <Button
              appearance="primary"
              icon={<SaveFilled />}
              iconPosition="before"
              onClick={() => submitHandler(form.getValues())}
            >
              Salvar
            </Button>
          </DialogTrigger>
        </DialogActions>
      </DialogBody>
    </DialogSurface>
  );
}

export default StopwatchEditModal;
