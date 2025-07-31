import { queryOptions } from "@tanstack/react-query";

import type { Me } from "./types";

import { poc } from "./fetch";

export async function getMe() {
  const res = await poc<Me>(`api/v1/users/me`);

  if (!res.ok) {
    throw new Error("Failed to fetch me!");
  }

  const data = await res.json();

  return data;
}

export function meQueryOptions() {
  return queryOptions({
    queryFn: getMe,
    queryKey: ["me"],
    staleTime: Infinity,
  });
}
