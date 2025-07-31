import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { cn } from "@/components/libs/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFieldContext } from "@/config/form";

import FieldMeta from "./FieldMeta";

type SelectFieldProps = {
  description?: React.ReactNode;
  label?: React.ReactNode;
  onEndReached?: () => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  renderItemLabel?: (item: { label: string; value: string }) => React.ReactNode;
};

export default function SelectField({
  description,
  label,
  onEndReached,
  options,
  placeholder,
  renderItemLabel,
}: SelectFieldProps) {
  const [inViewRef, isInView] = useInView();

  const field = useFieldContext<string>();
  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;

  useEffect(() => {
    if (isInView) {
      onEndReached?.();
    }
  }, [isInView, onEndReached]);

  return (
    <div className="grid w-full items-center gap-1.5">
      {label && (
        <Label
          className={cn("data-[error=true]:text-destructive")}
          data-error={hasError}
        >
          {label}
        </Label>
      )}
      <Select
        defaultValue={field.state.value}
        onValueChange={field.handleChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((i) => (
            <SelectItem key={i.value} value={i.value}>
              {renderItemLabel ? renderItemLabel(i) : i.label}
            </SelectItem>
          ))}
          <div className="h-px w-full" ref={inViewRef} />
        </SelectContent>
      </Select>
      {description && (
        <p
          className="text-muted-foreground text-sm"
          data-slot="form-description"
        >
          {description}
        </p>
      )}
      <FieldMeta field={field} />
    </div>
  );
}
