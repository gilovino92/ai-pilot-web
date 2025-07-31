import type { RowData } from "@tanstack/react-table";

import "@tanstack/react-table";

export type OptimisticRow = {
  optimisticState?: "error" | "pending";
};

declare module "@tanstack/react-table" {
  interface Row<TData extends RowData> extends OptimisticRow {}

  interface TableMeta<TData extends RowData> {
    organizationId?: string;
  }
}
