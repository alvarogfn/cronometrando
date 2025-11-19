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
import { type DeepPartial, type SubmitHandler, useForm } from "react-hook-form";
import TimeField from "../components/time-field.tsx";

interface Form {
  duration: string;
}

interface StopwatchEditModalProps {
  defaultValues: DeepPartial<Form>;
  values: Form;
  onSubmit: (value: Form) => void;
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
}: StopwatchEditModalProps) {
  const classes = useClasses();

  const form = useForm<Form>({
    values: values,
    defaultValues: defaultValues,
  });

  const submitHandler: SubmitHandler<Form> = (value) => {
    onSubmit(value);
  };

  return (
    <DialogSurface style={{ width: "300px" }}>
      <DialogBody>
        <DialogTitle>Editar Temporizador</DialogTitle>
        <DialogContent>
          <TimeField
            className={classes.timeField}
            defaultValue={defaultValues["duration"]}
            control={form.control}
            name="duration"
          />
        </DialogContent>
        <DialogActions>
          <DialogTrigger disableButtonEnhancement>
            <Button
              icon={<SaveFilled />}
              onClick={form.handleSubmit(submitHandler)}
              iconPosition="before"
              appearance="primary"
            >
              Salvar
            </Button>
          </DialogTrigger>
          <DialogTrigger disableButtonEnhancement>
            <Button onClick={() => form.reset()} appearance="secondary">
              Cancelar
            </Button>
          </DialogTrigger>
        </DialogActions>
      </DialogBody>
    </DialogSurface>
  );
}

export default StopwatchEditModal;
