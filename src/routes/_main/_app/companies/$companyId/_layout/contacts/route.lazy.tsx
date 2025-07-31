import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
  "/_main/_app/companies/$companyId/_layout/contacts",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-muted flex h-full w-full flex-col items-center justify-center rounded-md">
      <p className="text-muted-foreground mt-2 text-sm">
        This feature will be available soon. Stay tuned!
      </p>
    </div>
  );
}
