"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, MoreHorizontal, Trash2, Verified } from "lucide-react";

import type { WithOptimistic } from "@/app/data-table/types";
import type { OrganizationMember } from "@/data/types";

import ConfirmDialog from "@/app/common/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { removeOrganizationMember } from "@/data/organization";

import { getRoleLabel } from "./utils";

export const columns: ColumnDef<WithOptimistic<OrganizationMember>>[] = [
  {
    accessorKey: "email",
    cell: ({ cell, row }) => (
      <div className="flex items-center gap-2">
        <span>{cell.getValue<string>()}</span>
        {row.original.optimisticState === "pending" && (
          <Loader2 className="text-muted-foreground animate-spin" size={16} />
        )}
      </div>
    ),
    header: "Email",
  },
  {
    cell: ({ row }) => `${row.original.first_name} ${row.original.last_name}`,
    header: "Name",
    id: "name",
  },
  {
    accessorKey: "roles",
    cell: ({ cell }) => (
      <div className="flex flex-wrap gap-2">
        {cell
          .getValue<string[]>()
          ?.map((role) => <Badge key={role}>{getRoleLabel(role)}</Badge>)}
      </div>
    ),
    header: "Roles",
  },
  {
    accessorKey: "email_verified",
    cell: ({ cell }) =>
      cell.getValue() && <Verified className="text-success" size={16} />,
    header: "Verified",
  },
  {
    cell: function Cell({ row, table }) {
      const queryClient = useQueryClient();
      const { mutate } = useMutation({
        mutationFn: async () => {
          if (
            !table.options.meta?.organizationId ||
            !row.original.id ||
            !row.original.email
          ) {
            return;
          }

          await removeOrganizationMember({
            email: row.original.email,
            id: table.options.meta?.organizationId,
            mid: row.original.id,
          });
        },
        mutationKey: ["removeOrganizationMember"],
        onSettled: () =>
          queryClient.invalidateQueries({ queryKey: ["organizationMembers"] }),
        onSuccess: () => {
          window.gtag("event", "admin_remove_user", {
            user_email: row.original.email,
          });
        },
      });

      if (row.original.optimisticState) {
        return null;
      }

      return (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-8 w-8 p-0" variant="ghost">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem variant="destructive">
                  <Trash2 />
                  Delete
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <ConfirmDialog
            onConfirm={() => {
              mutate();
            }}
          />
        </Dialog>
      );
    },
    id: "actions",
  },
];
