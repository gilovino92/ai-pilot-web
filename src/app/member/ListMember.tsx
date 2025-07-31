import type { WithOptimistic } from "@/app/data-table/types";
import type { OrganizationMember } from "@/data/types";

import DataTable from "@/app/data-table/DataTable";

import { columns } from "./Columns";

type ListMemberProps = {
  data: WithOptimistic<OrganizationMember>[];
  organizationId: string;
};

export default function ListMember({ data, organizationId }: ListMemberProps) {
  return <DataTable columns={columns} data={data} meta={{ organizationId }} />;
}
