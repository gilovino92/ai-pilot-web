import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/cui/calendar";
import { cn } from "@/components/libs/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFieldContext } from "@/config/form";

import FieldMeta from "./FieldMeta";

type DateFieldProps = {
  description?: React.ReactNode;
  label?: React.ReactNode;
  placeholder?: string;
};

export default function DateField({
  description,
  label,
  placeholder,
}: DateFieldProps) {
  const field = useFieldContext<Date | undefined>();
  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;

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
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "w-full justify-start text-left font-normal",
              !field.state.value && "text-muted-foreground",
            )}
            variant={"outline"}
          >
            <CalendarIcon />
            {field.state.value ? (
              format(field.state.value, "PPP")
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            onSelect={(value) => field.handleChange(value)}
            selected={field.state.value}
          />
        </PopoverContent>
      </Popover>
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
