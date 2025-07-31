import { queryOptions } from "@tanstack/react-query";

import type { ApiResp } from "./types";
import type { WhatsAppContact, WhatsAppGroup } from "./types.whatsapp";

import { poc } from "./fetch";

export async function getWhatsAppContact(id: string) {
  const res = await poc<ApiResp<WhatsAppContact>>(
    `api/v1/whatsapp/contacts/${id}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch whatsapp contact!");
  }

  const { data } = await res.json();

  return data;
}

export async function getWhatsAppContacts() {
  const res = await poc<ApiResp<WhatsAppContact[]>>(`api/v1/whatsapp/contacts`);

  if (!res.ok) {
    throw new Error("Failed to fetch whatsapp contacts!");
  }

  const { data } = await res.json();

  return data ?? [];
}

export async function getWhatsAppGroup(id: string) {
  const res = await poc<ApiResp<WhatsAppGroup>>(`api/v1/whatsapp/groups/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch whatsapp group!");
  }

  const { data } = await res.json();

  return data;
}

export async function getWhatsAppGroups() {
  const res = await poc<ApiResp<WhatsAppGroup[]>>(`api/v1/whatsapp/groups`);

  if (!res.ok) {
    throw new Error("Failed to fetch whatsapp groups!");
  }

  const { data } = await res.json();

  return data ?? [];
}

export function whatsappContactQueryOptions(id: string) {
  return queryOptions({
    queryFn: () => getWhatsAppContact(id),
    queryKey: ["whatsappContact", id],
    staleTime: Infinity,
  });
}

export function whatsappContactsQueryOptions() {
  return queryOptions({
    queryFn: () => getWhatsAppContacts(),
    queryKey: ["whatsappContacts"],
    staleTime: Infinity,
  });
}

export function whatsappGroupQueryOptions(id: string) {
  return queryOptions({
    queryFn: () => getWhatsAppGroup(id),
    queryKey: ["whatsappGroup", id],
    staleTime: Infinity,
  });
}

export function whatsappGroupsQueryOptions() {
  return queryOptions({
    queryFn: () => getWhatsAppGroups(),
    queryKey: ["whatsappGroups"],
    staleTime: Infinity,
  });
}
