import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_main/_app/conversations/_layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="text-muted-foreground flex h-full w-full items-center justify-center text-sm">
      Select a conversation to start
    </div>
  );
}
