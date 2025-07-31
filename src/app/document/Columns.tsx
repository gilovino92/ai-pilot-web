"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle,
  Download,
  Loader2,
  MoreHorizontal,
  Trash2,
  XCircle,
} from "lucide-react";

import type { WithOptimistic } from "@/app/data-table/types";
import type { Document } from "@/data/types";

import ConfirmDialog from "@/app/common/ConfirmDialog";
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
import { deleteDocument, getDocumentUrl } from "@/data/document";
import { downloadFile, formatFileSize } from "@/libs/file";

export const columns: ColumnDef<WithOptimistic<Document>>[] = [
  {
    accessorKey: "filename",
    cell: ({ cell, row }) => (
      <div className="flex items-center gap-2">
        <span>{cell.getValue() as string}</span>
        {row.original.optimisticState === "pending" && (
          <Loader2 className="text-muted-foreground animate-spin" size={16} />
        )}
      </div>
    ),
    header: "Filename",
  },
  {
    accessorKey: "mime_type",
    header: "Type",
  },
  {
    accessorKey: "size",
    cell: ({ cell }) => formatFileSize(parseInt(cell.getValue() as string, 10)),
    header: "Size",
  },
  {
    accessorKey: "status",
    cell: ({ cell }) => {
      const status = cell.getValue();
      return (
        <>
          {(!status || status === "done") && (
            <div className="flex items-center gap-2">
              <CheckCircle className="text-success font-bold" size={16} />
              <span className="text-success font-bold">Ready</span>
            </div>
          )}
          {status === "in_progress" && (
            <div className="flex items-center gap-2">
              <Loader2 className="text-primary animate-spin" size={16} />
              <span className="text-primary font-bold">Processing...</span>
            </div>
          )}
          {status === "failed" && (
            <div className="flex items-center gap-2">
              <XCircle className="text-destructive font-bold" size={16} />
              <span className="text-destructive font-bold">Failed</span>
            </div>
          )}
        </>
      );
    },
    header: "Status",
  },
  {
    cell: function Cell({ row }) {
      const queryClient = useQueryClient();
      const { mutate: mutateDownloadDocument } = useMutation({
        mutationFn: async () => {
          if (!row.original.key) {
            return;
          }

          const { url } = await getDocumentUrl(row.original.key);

          await downloadFile(url);
        },
      });
      const { mutate: mutateDeleteDocument } = useMutation({
        mutationFn: async () => {
          if (!row.original.id) {
            return;
          }

          await deleteDocument(row.original.id);
        },
        mutationKey: ["deleteDocument"],
        onSettled: () =>
          queryClient.invalidateQueries({ queryKey: ["documents"] }),
        onSuccess: () => {
          window.gtag("event", "admin_delete_file", {
            file_id: row.original.id,
            file_name: row.original.filename,
            file_size: row.original.size,
            file_type: row.original.mime_type,
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
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  mutateDownloadDocument();
                }}
              >
                <Download />
                Download
              </DropdownMenuItem>{" "}
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
              mutateDeleteDocument();
            }}
          />
        </Dialog>
      );
    },
    id: "actions",
  },
];
