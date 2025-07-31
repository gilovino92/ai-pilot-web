import { queryOptions } from "@tanstack/react-query";
import { EventSourcePolyfill } from "event-source-polyfill";

import { userManager } from "@/config/auth";

import type { ApiResp } from "./types";

import { chatbot } from "./fetch";

export type ChatbotConversation = {
  created_at: string;
  id: string;
  serialized_context: null;
  title: string;
  updated_at: string;
  user_id: string;
};
export type ChatbotMessage = {
  agent_action?: string;
  chat_id: string;
  content: ChatbotUserInputContent | string;
  created_at: string;
  id: string;
  role: string;
  type: string;
  updated_at: string;
  user_id: string;
};

export type ChatbotUserInputContent = {
  inputType: string;
  label: string;
  options: UserInputOption[];
};
export type ChatHistoryResponse = {
  data: ChatbotMessage[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
  };
};

export type UserInputOption = {
  label: string;
  selected: boolean;
  value: string;
};

export function chatbotConversationQueryOption() {
  return queryOptions({
    queryFn: () => getChatbotConversations(),
    queryKey: ["chatbotConversations"],
  });
}

export async function createChatbotConversation() {
  const res = await chatbot<ApiResp<ChatbotConversation>>(`copilot-chat/chat`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to create chatbot conversation!");
  }

  const { data } = await res.json();

  return data;
}

export async function getChatbotConversations() {
  const res =
    await chatbot<ApiResp<ChatbotConversation[]>>(`copilot-chat/chat`);

  if (!res.ok) {
    throw new Error("Failed to get chat conversations!");
  }

  const { data } = await res.json();

  return data;
}

export async function getChatHistory(chat_id: string, page: number) {
  const res = await chatbot<ChatHistoryResponse>(
    `copilot-chat/chat/${chat_id}?page=${page}`,
  );

  if (!res.ok) {
    throw new Error("Failed to get chat history!");
  }

  const { data, pagination } = await res.json();

  return { data, pagination };
}

export async function sendMessage({
  chat_id,
  message,
  type,
}: {
  chat_id: string;
  message: string;
  type: string;
}) {
  const res = await chatbot<ApiResp<null>>(
    `copilot-chat/chat/${chat_id}/messages`,
    {
      json: { message, type },
      method: "POST",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to send message!");
  }

  const { data } = await res.json();

  return data;
}

export async function streamMessage(chat_id: string) {
  const user = await userManager.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const eventSource = new EventSourcePolyfill(
    `${import.meta.env.VITE_CHATBOT_API_BASE_URL}/copilot-chat/chat/${chat_id}/stream`,
    {
      headers: {
        Authorization: `Bearer ${user.access_token}`,
      },
      heartbeatTimeout: 86400000,
    },
  );

  return eventSource;
}
