import { queryOptions } from "@tanstack/react-query";

import type { Network } from "./types";

import { poc } from "./fetch";

export async function getConversationSuggestion(data: {
  conversationId: string;
  network: Network;
  userMessage: string;
}) {
  const res = await poc<{ suggestion: string }>(
    `api/v1/conversations/suggestion-v2`,
    {
      json: {
        chat_id: data.conversationId,
        network: data.network,
        user_message: data.userMessage,
      },
      method: "POST",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch conversation suggestion!");
  }

  const { suggestion } = await res.json();

  return suggestion;
}

export async function getRefinementMessage(data: {
  conversationId: string;
  message: string;
  network: Network;
}) {
  const res = await poc<{ suggestion: string }>(
    `api/v1/conversations/refine-message`,
    {
      json: {
        chat_id: data.conversationId,
        message: data.message,
      },
      method: "POST",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch conversation suggestion!");
  }

  const { suggestion } = await res.json();

  return suggestion;
}

export function messageRefinementQueryOptions(data: {
  conversationId: string;
  message: string;
  network: Network;
}) {
  return queryOptions({
    queryFn: () => getRefinementMessage(data),
    queryKey: ["messageRefinement", data],
    retry: false,
  });
}
