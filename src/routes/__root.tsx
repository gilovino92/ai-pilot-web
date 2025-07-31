import { type QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Suspense } from "react";

import AppEmpty from "@/app/common/AppEmpty";
import AppError from "@/app/common/AppError";
import { Toaster } from "@/components/ui/sonner";
import { QueryDevtools } from "@/config/query";
import { RouterDevtools } from "@/config/router";

export const Route = createRootRouteWithContext<{
  isAuthenticated: boolean;
  queryClient: QueryClient;
}>()({
  component: Root,
  errorComponent: AppError,
});

function Root() {
  return (
    <Suspense fallback={<AppEmpty text="Loading..." />}>
      <Outlet />
      <RouterDevtools />
      <QueryDevtools />
      <Toaster />
      {import.meta.env.MODE !== "production" && (
        <div className="text-muted-foreground bg-background fixed top-0 right-0 z-50 p-1 font-mono text-xs shadow">
          <p>ENV: {import.meta.env.MODE}</p>
          <p>VER: v{__APP_VERSION__}</p>
        </div>
      )}
    </Suspense>
  );
}
