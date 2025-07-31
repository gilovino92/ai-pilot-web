import { useMutationState, useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";

import Invite from "@/app/member/Invite";
import ListMember from "@/app/member/ListMember";
import { organizationMembersQueryOptions } from "@/data/organization";
import { profileQueryOptions } from "@/data/user";

export const Route = createLazyFileRoute("/_main/_app/admin/members")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: profile } = useSuspenseQuery(profileQueryOptions());
  const { data: members } = useSuspenseQuery(
    organizationMembersQueryOptions(profile.organization_id),
  );
  const inviteVariables = useMutationState<string>({
    filters: { mutationKey: ["inviteOrganizationMember"], status: "pending" },
    select: (mutation) => mutation.state.variables as string,
  });
  const removeVariables = useMutationState<{ mid: string }>({
    filters: { mutationKey: ["removeOrganizationMember"], status: "pending" },
    select: (mutation) => mutation.state.variables as { mid: string },
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Members
        </h3>
        <Invite />
      </div>
      <ListMember
        data={[
          ...members.map((i) =>
            removeVariables.find((v) => v.mid === i.id)
              ? { ...i, optimisticState: "pending" as const }
              : i,
          ),
          ...inviteVariables.map((v) => ({
            email: v,
            optimisticState: "pending" as const,
          })),
        ]}
        organizationId={profile.organization_id}
      />
    </div>
  );
}
