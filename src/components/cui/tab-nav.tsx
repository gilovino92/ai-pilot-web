import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/components/libs/utils";

function TabNav({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-full items-center rounded-lg p-[3px]",
        className,
      )}
      {...props}
    />
  );
}

function TabNavItem({
  asChild = false,
  className,
  ...props
}: { asChild?: boolean } & React.ComponentProps<"a">) {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      className={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export { TabNav, TabNavItem };
