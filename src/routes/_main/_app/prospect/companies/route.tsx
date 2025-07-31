import { createFileRoute } from "@tanstack/react-router";

import { leadMetadataQueryOptions } from "@/data/prospect";

export const Route = createFileRoute("/_main/_app/prospect/companies")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(leadMetadataQueryOptions());
  },
});
