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
import { formatTimeToHHMMSS } from "helpers/format-time-to-HHMMSS.ts";
import { getSecondsFromHHMMSS } from "helpers/get-seconds-from-HHMMSS.ts";
import { type DeepPartial, type SubmitHandler, useForm } from "react-hook-form";
import TimeField from "../components/time-field.tsx";

interface InternalForm {
  totalDuration: string;
}

interface ExternalForm {
  totalDuration: number;
}

interface StopwatchEditModalProps {
  defaultValues: DeepPartial<ExternalForm>;
  values: ExternalForm;
  onSubmit: (value: ExternalForm["totalDuration"]) => void;
  disabled: boolean;
}

const useClasses = makeStyles({
  timeField: {
    width: "100%",
    margin: "10px 0",
  },
});

function StopwatchEditModal({
  defaultValues,
  onSubmit,
  values,
  disabled,
}: StopwatchEditModalProps) {
  const defaultTotalDuration = formatTimeToHHMMSS(
    defaultValues["totalDuration"] ?? 0,
  );

  const classes = useClasses();

  const form = useForm<InternalForm>({
    values: { totalDuration: formatTimeToHHMMSS(values.totalDuration) },
    defaultValues: { totalDuration: defaultTotalDuration },
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
            disabled={disabled}
            defaultValue={defaultTotalDuration}
            className={classes.timeField}
            control={form.control}
            name="totalDuration"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => form.reset()} appearance="secondary">
            Resetar
          </Button>
          <DialogTrigger action="close" disableButtonEnhancement>
            <Button
              icon={<SaveFilled />}
              onClick={() => submitHandler(form.getValues())}
              iconPosition="before"
              appearance="primary"
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
