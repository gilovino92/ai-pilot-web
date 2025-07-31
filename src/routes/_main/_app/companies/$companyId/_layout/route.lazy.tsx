import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ArrowLeft, Building } from "lucide-react";

import Delete from "@/app/customer/Delete";
import Edit from "@/app/customer/Edit";
import { TabNav, TabNavItem } from "@/components/cui/tab-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { customerQueryOptions } from "@/data/customer";

import { Route as RouteImport } from "./route";

export const Route = createLazyFileRoute(
  "/_main/_app/companies/$companyId/_layout",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { companyId } = Route.useParams();
  const { data } = useSuspenseQuery(customerQueryOptions(companyId));

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost">
          <Link to="/companies">
            <ArrowLeft />
          </Link>
        </Button>
        <div className="flex flex-1 items-center gap-2">
          <div className="bg-muted flex items-center justify-center rounded-md p-3">
            <Building size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              {data.company_name}
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{data.industry}</Badge>
              <Badge>{data.status}</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Edit data={data} />
          <Delete
            data={data}
            onDelete={() => {
              navigate({
                to: "/companies",
              });
            }}
          />
        </div>
      </div>
      <TabNav>
        {[
          {
            exact: true,
            title: "Overview",
            to: "./",
          },
          {
            title: "Conversations",
            to: "./conversations",
          },
          {
            title: "Tasks ",
            to: "./tasks",
          },
          {
            title: "Deals",
            to: "./deals",
          },
          {
            title: "Contacts",
            to: "./contacts",
          },
          {
            title: "AI Insights",
            to: "./ai-insights",
          },
        ].map((i) => (
          <TabNavItem asChild key={i.title}>
            <Link
              activeOptions={{
                exact: i.exact,
              }}
              activeProps={{
                "data-state": "active",
              }}
              from={RouteImport.fullPath}
              to={i.to}
            >
              {i.title}
            </Link>
          </TabNavItem>
        ))}
      </TabNav>
      <Outlet />
    </div>
  );
}
