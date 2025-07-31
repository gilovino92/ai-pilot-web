import type { Updater } from "@tanstack/react-form";

import { useVirtualizer } from "@tanstack/react-virtual";

import { Label } from "@/components/ui/label";
import { useFieldContext } from "@/config/form";

type MultiSelectItemFieldProps<TValue> = {
  addItem?: (value: TValue) => Updater<TValue[]>;
  getScrollElement: () => HTMLElement | null;
  isSelected?: (value: TValue) => Updater<TValue[], boolean>;
  items: TValue[];
  label?: React.ReactNode;
  removeItem?: (value: TValue) => Updater<TValue[]>;
  renderItem: (props: {
    handleChange: (selected: boolean) => void;
    selected: boolean;
    value: TValue;
  }) => React.ReactNode;
};

export default function MultiSelectItemField<TValue>({
  addItem = (v) => (s) => [...s, v],
  getScrollElement,
  isSelected = (v) => (s) => s.includes(v),
  items,
  label,
  removeItem = (v) => (s) => s.filter((c) => c !== v),
  renderItem,
}: MultiSelectItemFieldProps<TValue>) {
  const field = useFieldContext<TValue[]>();

  const virtualizer = useVirtualizer({
    count: items.length,
    estimateSize: () => 64,
    gap: 8,
    getScrollElement,
  });

  const rows = virtualizer.getVirtualItems();

  return (
    <div>
      {label && <Label>{label}</Label>}
      <div
        className="relative w-full"
        style={{
          height: `${virtualizer.getTotalSize()}px`,
        }}
      >
        {rows.map((row) => {
          const value = items[row.index];
          const selected = isSelected(value);

          return (
            <div
              className="absolute top-0 left-0 w-full"
              data-index={row.index}
              key={row.key}
              ref={virtualizer.measureElement}
              style={{
                transform: `translateY(${row.start}px)`,
              }}
            >
              {renderItem({
                handleChange: (selected) => {
                  if (selected) {
                    field.handleChange(addItem(value));
                  } else {
                    field.handleChange(removeItem(value));
                  }
                },
                selected:
                  typeof selected === "boolean"
                    ? selected
                    : selected(field.state.value),
                value,
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
