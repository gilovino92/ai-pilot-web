import type { ColumnDef } from "@tanstack/react-table";

import type { LeadEmployee } from "@/data/types";

export const columns: ColumnDef<LeadEmployee>[] = [
  {
    cell: ({ row }) => `${row.original.first_name} ${row.original.last_name}`,
    header: "Name",
    id: "name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];
