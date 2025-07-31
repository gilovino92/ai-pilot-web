import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_main/_app/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-muted flex h-full w-full flex-col items-center justify-center rounded-md">
      <img className="h-12 w-auto" src="/logo.svg" />
    </div>
  );
}
