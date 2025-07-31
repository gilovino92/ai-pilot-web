import { cn } from "@/components/libs/utils";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFieldContext } from "@/config/form";

import FieldMeta from "./FieldMeta";

type TextareaFieldProps = {
  description?: React.ReactNode;
  label?: React.ReactNode;
} & React.ComponentProps<"textarea">;

export default function TextareaField({
  description,
  id,
  label,
  ...rest
}: TextareaFieldProps) {
  const field = useFieldContext<string>();
  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <div className="grid w-full items-center gap-1.5">
      {label && (
        <Label
          className={cn("data-[error=true]:text-destructive")}
          data-error={hasError}
          htmlFor={id}
        >
          {label}
        </Label>
      )}
      <Textarea
        {...rest}
        id={id}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        value={field.state.value}
      />
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
