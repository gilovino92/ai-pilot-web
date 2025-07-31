import { createLazyFileRoute, Link, Outlet } from "@tanstack/react-router";

import AppSidebar from "@/app/common/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export const Route = createLazyFileRoute("/_main/_app")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSidebar />
      <SidebarInset className="">
        <header className="flex shrink-0 items-center gap-2 border-b">
          <div className="flex w-full items-center justify-between gap-2 px-4 py-2">
            <SidebarTrigger className="-ml-1" />
            <Link to="/">
              <img className="h-8 w-auto" src="/logo.svg" />
            </Link>
          </div>
        </header>
        <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 py-2">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
