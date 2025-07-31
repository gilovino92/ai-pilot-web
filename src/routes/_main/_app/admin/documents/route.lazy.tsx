import { useMutationState, useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";

import ListDocument from "@/app/document/ListDocument";
import Upload from "@/app/document/Upload";
import { documentsQueryOptions } from "@/data/document";

export const Route = createLazyFileRoute("/_main/_app/admin/documents")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: documents } = useSuspenseQuery(documentsQueryOptions());
  const uploadVariables = useMutationState<File>({
    filters: { mutationKey: ["uploadDocument"], status: "pending" },
    select: (mutation) => mutation.state.variables as File,
  });
  const deleteVariables = useMutationState<number>({
    filters: { mutationKey: ["deleteDocument"], status: "pending" },
    select: (mutation) => mutation.state.variables as number,
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Documents
        </h3>
        <Upload />
      </div>
      <ListDocument
        data={[
          ...documents.map((i) =>
            deleteVariables.includes(i.id)
              ? { ...i, optimisticState: "pending" as const }
              : i,
          ),
          ...uploadVariables.map((v, i) => ({
            filename: v.name,
            id: Number.MIN_SAFE_INTEGER - i,
            optimisticState: "pending" as const,
            size: v.size.toString(),
          })),
        ]}
      />
    </div>
  );
}
