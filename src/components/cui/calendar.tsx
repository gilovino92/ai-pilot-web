"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";

import { cn } from "@/components/libs/utils";
import { buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      className={cn("p-3", className)}
      classNames={{
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "[&_svg]:fill-foreground absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          classNames?.button_next,
        ),
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "[&_svg]:fill-foreground absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          classNames?.button_previous,
        ),
        caption_label: cn(
          "truncate text-sm font-medium",
          classNames?.caption_label,
        ),
        day: cn(
          "flex size-8 flex-1 items-center justify-center p-0 text-sm",
          classNames?.day,
        ),
        day_button: cn(
          "size-8 rounded-md p-0 font-normal transition-none aria-selected:opacity-100",
          classNames?.day_button,
        ),
        disabled: cn("text-muted-foreground opacity-50", classNames?.disabled),
        hidden: cn("invisible flex-1", classNames?.hidden),
        month: cn("w-full", classNames?.month),
        month_caption: `relative mx-10 flex h-7 items-center justify-center ${defaultClassNames.month_caption}`,
        month_grid: cn("mx-auto mt-4", classNames?.month_grid),
        months: `relative flex ${defaultClassNames.month}`,
        nav: cn("flex items-start", classNames?.nav),
        outside: cn(
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground opacity-50 aria-selected:opacity-30",
          classNames?.outside,
        ),
        range_end: cn(
          "bg-accent [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground day-range-end rounded-e-md",
          classNames?.range_end,
        ),
        range_middle: cn(
          "bg-accent !text-foreground [&>button]:!text-foreground [&>button]:hover:!text-foreground [&>button]:bg-transparent [&>button]:hover:bg-transparent",
          classNames?.range_middle,
        ),
        range_start: cn(
          "bg-accent [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground day-range-start rounded-s-md",
          classNames?.range_start,
        ),
        selected: cn(
          "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground",
          classNames?.selected,
        ),
        today: cn(
          "[&>button]:bg-accent [&>button]:text-accent-foreground",
          classNames?.today,
        ),
        week: cn("mt-2 flex w-max items-start", classNames?.week),
        weekday: cn(
          "text-muted-foreground w-8 text-sm font-normal",
          classNames?.weekday,
        ),
        weekdays: cn("flex flex-row", classNames?.weekdays),
        ...classNames,
      }}
      components={{
        Chevron: ({ className, ...props }) => {
          if (props.orientation === "left") {
            return (
              <ChevronLeft className={cn("size-4", className)} {...props} />
            );
          }
          return (
            <ChevronRight className={cn("size-4", className)} {...props} />
          );
        },
      }}
      showOutsideDays={showOutsideDays}
      {...props}
    />
  );
}

export { Calendar };
