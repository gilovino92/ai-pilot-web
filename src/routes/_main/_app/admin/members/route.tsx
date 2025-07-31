import { createFileRoute } from "@tanstack/react-router";

import { organizationMembersQueryOptions } from "@/data/organization";
import { profileQueryOptions } from "@/data/user";

export const Route = createFileRoute("/_main/_app/admin/members")({
  loader: async ({ context }) => {
    const profile = await context.queryClient.ensureQueryData(
      profileQueryOptions(),
    );

    await context.queryClient.ensureQueryData(
      organizationMembersQueryOptions(profile.organization_id),
    );
  },
});
