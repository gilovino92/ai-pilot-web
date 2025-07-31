import { queryOptions } from "@tanstack/react-query";

import type { ApiResp, Organization, OrganizationMember } from "./types";

import { tenant } from "./fetch";

export async function getOrganization() {
  const res = await tenant<ApiResp<Organization>>(
    `tenant-backend/v1/user/organization`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch organization!");
  }

  const { data } = await res.json();

  return data;
}

export async function getOrganizationMembers(id: string) {
  const res = await tenant<ApiResp<OrganizationMember[]>>(
    `tenant-backend/v1/admin/organizations/${id}/members`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch organization members!");
  }

  const { data } = await res.json();

  return data;
}

export async function inviteOrganizationMember(id: string, email: string) {
  const res = await tenant<ApiResp<OrganizationMember>>(
    `tenant-backend/v1/admin/organizations/${id}/members/invite`,
    {
      json: {
        email,
      },
      method: "POST",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to invite organization member!");
  }

  const { data } = await res.json();

  return data;
}

export function organizationMembersQueryOptions(id: string) {
  return queryOptions({
    queryFn: () => getOrganizationMembers(id),
    queryKey: ["organizationMembers", id],
  });
}

export function organizationQueryOptions() {
  return queryOptions({
    queryFn: () => getOrganization(),
    queryKey: ["organization"],
    staleTime: Infinity,
  });
}

export async function removeOrganizationMember({
  email,
  id,
  mid,
}: {
  email: string;
  id: string;
  mid: string;
}) {
  const res = await tenant<ApiResp<OrganizationMember>>(
    `tenant-backend/v1/admin/organizations/${id}/members/${mid}`,
    {
      json: {
        email,
      },
      method: "DELETE",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to remove organization member!");
  }

  const { data } = await res.json();

  return data;
}
