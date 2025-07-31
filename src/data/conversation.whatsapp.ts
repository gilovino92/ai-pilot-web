import { queryOptions } from "@tanstack/react-query";

import type { ApiResp, Conversation, ConversationMessage } from "./types";
import type {
  WhatsAppAvatar,
  WhatsAppConversationSearchResult,
} from "./types.whatsapp";

import { poc } from "./fetch";

export async function getWhatsAppAvatars(ids: string[]) {
  const res = await poc(`api/v1/whatsapp/avatar`, {
    json: { ids },
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch whatsapp avatars!");
  }

  const { data } = (await res.json()) as ApiResp<WhatsAppAvatar[]>;

  return data;
}

export async function getWhatsAppConversation(
  id: string,
  page = 1,
  pageSize = 50,
) {
  const res = await poc(`api/v1/whatsapp/conversations/${id}`, {
    searchParams: {
      page,
      page_size: pageSize,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch whatsapp conversation!");
  }

  const { data, meta } = (await res.json()) as ApiResp<ConversationMessage[]>;

  return {
    messages: data.filter((m) => !!m),
    meta,
  };
}

export async function getWhatsAppConversations(page = 1, pageSize = 6) {
  const res = await poc(`api/v1/whatsapp/conversations`, {
    searchParams: {
      page,
      page_size: pageSize,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch whatsapp conversations!");
  }

  const { data, meta } = (await res.json()) as ApiResp<Conversation[]>;

  return {
    data,
    meta,
  };
}

export async function getWhatsAppFile(id: string) {
  const res = await poc(`api/v1/whatsapp/messages/${id}/file`);

  if (!res.ok) {
    throw new Error("Failed to fetch message file!");
  }

  const data = await res.blob();

  return data;
}

export async function getWhatsAppMessageThumbnail(id: string) {
  const res = await poc(`api/v1/whatsapp/messages/${id}/file`);

  if (!res.ok) {
    throw new Error("Failed to fetch message thumbnail!");
  }

  const blob = await res.blob();

  return URL.createObjectURL(blob);
}

export async function searchWhatsAppConversations(query: string) {
  const res = await poc<ApiResp<WhatsAppConversationSearchResult[]>>(
    "api/v1/whatsapp/conversations/search",
    {
      searchParams: {
        keyword: query,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to search whatsapp conversations!");
  }

  const { data } = await res.json();

  return data;
}

export async function sendWhatsAppMediaMessage({
  caption = "",
  file,
  targetId,
}: {
  caption?: string;
  file: File;
  targetId: string;
}) {
  const formData = new FormData();

  formData.append("caption", caption);
  formData.append("file", file);
  formData.append("media_type", getWhatsAppMediaMessageType(file.type));
  formData.append("target_id", targetId);

  const res = await poc(`api/v1/whatsapp/messages/send-media`, {
    body: formData,
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to send whatsapp media message!");
  }

  return res.json();
}

export async function unsyncWhatsAppConversations(ids: string[]) {
  const res = await poc(`api/v1/whatsapp/conversations/not-sync`, {
    body: JSON.stringify({
      chat_ids: ids,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to unsync whatsapp conversations!");
  }
}

export function whatsappAvatarQueryOptions(id: string) {
  return queryOptions({
    queryFn: () => getWhatsAppAvatars([id]),
    queryKey: ["whatsappAvatars", id],
  });
}

export function whatsappAvatarsQueryOptions(ids: string[]) {
  return queryOptions({
    queryFn: () => getWhatsAppAvatars(ids),
    queryKey: ["whatsappAvatars", ids],
  });
}

export function whatsappConversationQueryOptions(id: string) {
  return queryOptions({
    queryFn: () => getWhatsAppConversation(id),
    queryKey: ["whatsappConversation", id],
  });
}

export function whatsappConversationsQueryOptions() {
  return queryOptions({
    queryFn: () => getWhatsAppConversations(),
    queryKey: ["whatsappConversations"],
    staleTime: Infinity,
  });
}

export function whatsappFileQueryOptions(id: string) {
  return queryOptions({
    queryFn: () => getWhatsAppFile(id),
    queryKey: ["whatsappFile", id],
  });
}

export function whatsappSearchConversationsQueryOptions(query: string) {
  return queryOptions({
    enabled: !!query,
    queryFn: () => searchWhatsAppConversations(query),
    queryKey: ["whatsappSearchConversations", query],
  });
}

function getWhatsAppMediaMessageType(mimeType: string) {
  if (mimeType.startsWith("image/")) {
    return "image";
  }

  if (mimeType.startsWith("audio/")) {
    return "audio";
  }

  if (mimeType.startsWith("video/")) {
    return "video";
  }

  return "document";
}
