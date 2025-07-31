import type { ColumnDef } from "@tanstack/react-table";

import type { LeadCompany } from "@/data/types";

export const columns: ColumnDef<LeadCompany>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "website_url",
    header: "Website",
  },
];
