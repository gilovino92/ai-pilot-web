import type { Updater } from "@tanstack/react-form";

import { Checkbox as CheckboxComponent } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useFieldContext } from "@/config/form";

type MultiCheckboxFieldProps<TValue> = {
  addItem?: (value: TValue) => Updater<TValue[]>;
  checkItem?: (value: TValue) => Updater<TValue[], boolean>;
  getItemLabel?: (value: TValue) => React.ReactNode;
  items: TValue[];
  label: React.ReactNode;
  removeItem?: (value: TValue) => Updater<TValue[]>;
};

export default function MultiCheckbox<TValue>({
  addItem = (v) => (s) => [...s, v],
  checkItem = (v) => (s) => s.includes(v),
  getItemLabel = JSON.stringify,
  items,
  label,
  removeItem = (v) => (s) => s.filter((c) => c !== v),
}: MultiCheckboxFieldProps<TValue>) {
  const field = useFieldContext<TValue[]>();

  return (
    <div className="grid w-full items-center gap-1.5">
      {label && <Label>{label}</Label>}
      {items.map((value, index) => {
        const itemLabel = getItemLabel(value);
        const checked = checkItem(value);

        return (
          <div className="flex items-center space-x-2" key={index}>
            <CheckboxComponent
              checked={
                typeof checked === "boolean"
                  ? checked
                  : checked(field.state.value)
              }
              onCheckedChange={(checked) =>
                checked
                  ? field.handleChange(addItem(value))
                  : field.handleChange(removeItem(value))
              }
            />
            {itemLabel && <Label>{itemLabel}</Label>}
          </div>
        );
      })}
    </div>
  );
}
