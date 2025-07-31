import { createFileRoute } from "@tanstack/react-router";

import { customerQueryOptions } from "@/data/customer";

export const Route = createFileRoute(
  "/_main/_app/companies/$companyId/_layout",
)({
  loader: async ({ context, params }) => {
    await context.queryClient.fetchQuery(
      customerQueryOptions(params.companyId),
    );
  },
});
