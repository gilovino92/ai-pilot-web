import { createFileRoute } from "@tanstack/react-router";

import { meQueryOptions } from "@/data/contact";
import { organizationQueryOptions } from "@/data/organization";

export const Route = createFileRoute("/_main/_app")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(organizationQueryOptions());
    await context.queryClient.ensureQueryData(meQueryOptions());
  },
});
