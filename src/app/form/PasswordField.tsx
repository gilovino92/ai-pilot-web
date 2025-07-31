import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { cn } from "@/components/libs/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFieldContext } from "@/config/form";

import FieldMeta from "./FieldMeta";

type PasswordFieldProps = {
  description?: React.ReactNode;
  label?: React.ReactNode;
} & React.ComponentProps<"input">;

export default function PasswordField({
  description,
  id,
  label,
  ...rest
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="relative">
        <Input
          {...rest}
          id={id}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          type={showPassword ? "text" : "password"}
          value={field.state.value}
        />
        <Button
          className="absolute top-0 right-0"
          onClick={() => {
            setShowPassword(!showPassword);
          }}
          size="icon"
          variant="ghost"
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </Button>
      </div>
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
