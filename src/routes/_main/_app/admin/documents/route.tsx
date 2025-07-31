import { createFileRoute } from "@tanstack/react-router";

import { documentsQueryOptions } from "@/data/document";

export const Route = createFileRoute("/_main/_app/admin/documents")({
  loader: async ({ context }) => {
    // TODO: don't await, show loading state by using suspense
    // context.queryClient.prefetchQuery(documentsQueryOptions());
    await context.queryClient.ensureQueryData(documentsQueryOptions());
  },
});
