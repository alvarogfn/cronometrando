import type {
  Control,
  FieldPathValue,
  FieldValues,
  Path,
} from "react-hook-form";

import { Input } from "@fluentui/react-components";
import { useEffect } from "react";
import { useController } from "react-hook-form";
import { IMask, useIMask } from "react-imask";

import { useForkRef } from "../hooks/use-fork-ref.ts";

interface TimeFieldProps<Form extends FieldValues> {
  className?: string;
  control: Control<Form>;
  defaultValue?: FieldPathValue<Form, Path<Form>>;
  disabled?: boolean;
  name: Path<Form>;
}

const mask = {
  blocks: {
    HH: {
      from: 0,
      mask: IMask.MaskedRange,
      maxLength: 2,
      placeholderChar: "0",
      to: 99,
    },
    MM: {
      from: 0,
      mask: IMask.MaskedRange,
      maxLength: 2,
      placeholderChar: "0",
      to: 99,
    },
    SS: {
      from: 0,
      mask: IMask.MaskedRange,
      maxLength: 2,
      placeholderChar: "0",
      to: 99,
    },
  },
  lazy: false,
  mask: "HH:MM:SS",
};

function TimeField<Form extends FieldValues>({
  className,
  control,
  defaultValue,
  disabled,
  name,
}: TimeFieldProps<Form>) {
  const { field } = useController({
    control,
    defaultValue,
    disabled,
    name,
  });

  const {
    ref: imaskRef,
    setValue,
    value,
  } = useIMask(mask, {
    defaultValue: field.value,
    onAccept: (_, mask) => {
      field.onChange(mask.value);
    },
  });

  const inputRef = useForkRef(field.ref, imaskRef);

  useEffect(() => {
    setValue(field.value);
  }, [field.value, setValue]);

  return (
    <Input
      className={className}
      disabled={field.disabled}
      name={field.name}
      onBlur={field.onBlur}
      ref={inputRef}
      size="large"
      value={value}
    />
  );
}

export default TimeField;
