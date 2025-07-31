import { queryOptions } from "@tanstack/react-query";

import type { ApiResp, Profile } from "./types";

import { tenant, utenant } from "./fetch";

export async function getProfile() {
  const res = await tenant<ApiResp<Profile>>("tenant-backend/v1/user");

  if (!res.ok) {
    throw new Error("Failed to fetch profile!");
  }

  const { data } = await res.json();

  return data;
}

export function profileQueryOptions() {
  return queryOptions({
    queryFn: getProfile,
    queryKey: ["profile"],
    staleTime: Infinity,
  });
}

export async function registerUser(body: {
  domain: string;
  email: string;
  organization_name: string;
  password: string;
}) {
  const res = await utenant<ApiResp<null>>("tenant-backend/v1/user", {
    json: body,
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to register user!");
  }

  const { data } = await res.json();

  return data;
}
