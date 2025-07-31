import { Link } from "@tanstack/react-router";
import { type LucideIcon } from "lucide-react";
import * as React from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export default function NavSecondary({
  items,
  ...props
}: {
  items: {
    anchor?: React.ComponentProps<"a">;
    icon: LucideIcon;
    link?: Omit<React.ComponentProps<typeof Link>, "children">;
    title: string;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm">
                {item.link ? (
                  <Link {...item.link}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                ) : item.anchor ? (
                  <a {...item.anchor}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                ) : null}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
