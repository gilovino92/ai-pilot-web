import { cn } from "@/components/libs/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFieldContext } from "@/config/form";

import FieldMeta from "./FieldMeta";

type FileFieldProps = {
  description?: React.ReactNode;
  label?: React.ReactNode;
} & React.ComponentProps<"input">;

export default function FileField({
  description,
  id,
  label,
  ...rest
}: FileFieldProps) {
  const field = useFieldContext<FileList | null>();
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
      <Input
        {...rest}
        id={id}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.files)}
        type="file"
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
