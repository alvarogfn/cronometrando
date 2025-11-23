import { Input } from "@fluentui/react-components";
import { useEffect } from "react";
import {
  type Control,
  type FieldPathValue,
  type FieldValues,
  type Path,
  useController,
} from "react-hook-form";
import { IMask, useIMask } from "react-imask";
import { useForkRef } from "../hooks/use-fork-ref.ts";

interface TimeFieldProps<Form extends FieldValues> {
  control: Control<Form>;
  name: Path<Form>;
  defaultValue?: FieldPathValue<Form, Path<Form>>;
  disabled?: boolean;
  className?: string;
}

const mask = {
  mask: "HH:MM:SS",
  lazy: false,
  blocks: {
    HH: {
      mask: IMask.MaskedRange,
      placeholderChar: "0",
      from: 0,
      to: 99,
      maxLength: 2,
    },
    MM: {
      mask: IMask.MaskedRange,
      placeholderChar: "0",
      from: 0,
      to: 99,
      maxLength: 2,
    },
    SS: {
      mask: IMask.MaskedRange,
      placeholderChar: "0",
      from: 0,
      to: 99,
      maxLength: 2,
    },
  },
};

function TimeField<Form extends FieldValues>({
  control,
  name,
  defaultValue,
  disabled,
  className,
}: TimeFieldProps<Form>) {
  const { field } = useController({
    control,
    name,
    defaultValue,
    disabled,
  });

  const {
    ref: imaskRef,
    value,
    setValue,
  } = useIMask(mask, {
    onAccept: (_, mask) => {
      field.onChange(mask.value);
    },
    defaultValue: field.value,
  });

  const inputRef = useForkRef(field.ref, imaskRef);

  useEffect(() => {
    setValue(field.value);
  }, [field.value]);

  return (
    <Input
      className={className}
      size="large"
      disabled={field.disabled}
      name={field.name}
      onBlur={field.onBlur}
      value={value}
      ref={inputRef}
    />
  );
}

export default TimeField;
