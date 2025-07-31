import type { WithOptimistic } from "@/app/data-table/types";
import type { Document } from "@/data/types";

import DataTable from "@/app/data-table/DataTable";

import { columns } from "./Columns";

type ListDocumentProps = {
  data: WithOptimistic<Document>[];
};

export default function ListDocument({ data }: ListDocumentProps) {
  return <DataTable columns={columns} data={data} />;
}
