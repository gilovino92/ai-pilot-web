import { queryOptions } from "@tanstack/react-query";

import type {
  ApiResp,
  Conversation,
  ConversationMessage,
  ConversationSummary,
  CustomerConversation,
  MessageTranslation,
  Network,
} from "./types";

import { poc, tenant } from "./fetch";

export async function createLatestConversationSummary(conversationId: string) {
  const res = await poc.post<ConversationSummary>(
    `api/v1/conversation-summary/${conversationId}/latest`,
  );

  if (res.status !== 200) {
    throw new Error("Failed to create latest conversation summary");
  }

  const data = await res.json();
  return data;
}
export function customerConversationQueryOptions(
  customerId: string,
  network: Network,
) {
  return queryOptions({
    queryFn: () => getCustomerConversationsWithDetail(customerId, network),
    queryKey: ["customerConversations", customerId, network],
  });
}

export async function getConversationByIds(chatIds: string[]) {
  const res = await poc<ApiResp<Conversation[]>>(
    "api/v1/whatsapp/conversations/chatids",
    {
      json: {
        chat_ids: chatIds,
      },
      method: "POST",
    },
  );

  if (res.status !== 200) {
    throw new Error("Failed to fetch conversation by ids");
  }

  const { data } = await res.json();

  return data;
}

export async function getConversationSummary(conversationId: string) {
  const res = await poc<ConversationSummary>(
    `api/v1/conversation-summary/${conversationId}`,
  );

  if (res.status !== 200) {
    throw new Error("Failed to fetch conversation summary");
  }

  const data = await res.json();

  return data;
}

export async function getCustomerConversations(
  customerId: string,
  network: Network,
) {
  const res = await tenant<ApiResp<CustomerConversation[]>>(
    `tenant-backend/v1/customers/${customerId}/conversations`,
    {
      searchParams: {
        network: network.toUpperCase(),
      },
    },
  );

  if (res.status !== 200) {
    throw new Error("Failed to fetch customer conversations");
  }

  const { data } = await res.json();

  return data;
}

export async function getCustomerConversationsWithDetail(
  customerId: string,
  network: Network,
) {
  const res = await tenant<ApiResp<CustomerConversation[]>>(
    `tenant-backend/v1/customers/${customerId}/conversations`,
    {
      searchParams: {
        network: network.toUpperCase(),
      },
    },
  );

  if (res.status !== 200) {
    throw new Error("Failed to fetch customer conversations");
  }

  const { data } = await res.json();

  const conversations = await getConversationByIds(
    data.map((c) => c.conversation_id),
  );

  return conversations;
}

export async function getMessageTranslation(
  message: ConversationMessage,
  language: string,
) {
  if (message.message_type === "text") {
    const res = await poc.post<MessageTranslation>(`api/v1/translations`, {
      json: {
        content: message.conversation,
        conversation_id: message.chat_id,
        language: language,
        message_id: message.id,
      },
    });

    if (res.status !== 200) {
      throw new Error("Failed to fetch message translation");
    }

    const data = await res.json();

    return data;
  }
}

export async function linkCustomerConversation(
  customerId: string,
  body: {
    conversationId: string;
    network: Network;
  }[],
) {
  const res = await tenant<ApiResp<CustomerConversation[]>>(
    `tenant-backend/v1/customers/${customerId}/conversations/override`,
    {
      json: {
        conversations: body.map((c) => ({
          conversation_id: c.conversationId,
          network: c.network.toUpperCase(),
        })),
      },
      method: "PUT",
    },
  );

  if (res.status !== 200) {
    throw new Error("Failed to link customer conversation");
  }

  const { data } = await res.json();

  return data;
}
