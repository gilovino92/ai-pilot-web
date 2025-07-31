import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Bot,
  CalendarDays,
  ChartColumn,
  Command,
  LifeBuoy,
  MessagesSquare,
  Search,
  Send,
  Shield,
  Users2,
} from "lucide-react";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { organizationQueryOptions } from "@/data/organization";
import { profileQueryOptions } from "@/data/user";

import NavMain from "./NavMain";
import NavSecondary from "./NavSecondary";
import NavUser from "./NavUser";

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: profile } = useSuspenseQuery(profileQueryOptions());
  const { data: organization } = useSuspenseQuery(organizationQueryOptions());

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link to="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {organization.name}
                  </span>
                  <span className="truncate text-xs">
                    {organization.domains[0].name}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={[
            {
              icon: Bot,
              link: { to: "/chat" },
              title: "X-Pilot Assistant",
            },
            {
              icon: Search,
              items: [
                {
                  link: { to: "/prospect/leads" },
                  title: "Leads",
                },
                {
                  link: { to: "/prospect/companies" },
                  title: "Companies",
                },
              ],
              title: "Prospect",
            },
            {
              icon: CalendarDays,
              link: { to: "/tasks" },
              title: "Tasks",
            },
            {
              icon: Users2,
              link: { to: "/companies" },
              title: "Companies",
            },
            {
              icon: MessagesSquare,
              link: { to: "/conversations" },
              title: "Conversations",
            },
            {
              icon: ChartColumn,
              link: { to: "/dashboard" },
              title: "Dashboard",
            },
            {
              icon: Shield,
              items: [
                {
                  link: { to: "/admin/documents" },
                  title: "Documents",
                },
                {
                  link: { to: "/admin/members" },
                  title: "Members",
                },
              ],
              show: profile.is_organization_admin,
              title: "Admin",
            },
          ]}
        />
        <NavSecondary
          className="mt-auto"
          items={[
            {
              anchor: {
                href: "https://forms.gle/PXPU61yqAkfARXvT6",
                rel: "noopener noreferrer",
                target: "_blank",
              },
              icon: LifeBuoy,
              title: "Support",
            },
            {
              anchor: {
                href: "https://forms.gle/PXPU61yqAkfARXvT6",
                rel: "noopener noreferrer",
                target: "_blank",
              },
              icon: Send,
              title: "Feedback",
            },
          ]}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
