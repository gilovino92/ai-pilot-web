import type { EventMap } from "@/libs/ws";

import { userManager } from "@/config/auth";
import queryClient from "@/config/query";
import websocketClient from "@/config/socket";
import { fastDedupe } from "@/libs/dedupe";
import { currentConversationStore } from "@/stores/conversation";
import { socketStateStore } from "@/stores/socket";
import { whatsappLoginStore } from "@/stores/whatsapp";

import type {
  ApiResp,
  Conversation,
  ConversationMessage,
  Network,
} from "./types";
import type { ParsedRawData } from "./types.ws";

type InfConversationsData = {
  pageParams: number[];
  pages: ApiResp<Conversation[]>[];
};

export async function authenticateSocket() {
  const user = await userManager.getUser();

  const token = user!.access_token;

  websocketClient.send(JSON.stringify({ token, type: "auth" }));
}

export function handleAuthRequest(data: EventMap["message"]) {
  try {
    const parsedData = parseData(data);

    if (parsedData.type !== "auth_success") {
      return;
    }

    console.log("[XWS] authenticated");
    websocketClient.enqueueMultiple(socketStateStore.state.messageQueue);
    socketStateStore.setState(() => ({
      authenticated: true,
      messageQueue: [],
    }));
  } catch (error) {
    console.error("[XWS] error:", error);
  }
}

export function handleConversationUpdate(data: EventMap["message"]) {
  try {
    const parsedData = parseData(data);

    if (parsedData.type !== "MESSAGE_RECIEVED") {
      return;
    }

    queryClient.setQueryData<InfConversationsData>(
      ["whatsappConversationsInf"],
      (data) => {
        if (!data) {
          return;
        }

        const newPages = data.pages.map((page) => {
          const filteredConversations = page.data.filter(
            (conversation) =>
              conversation.id !== parsedData.data.conversation.id,
          );

          if (page.meta.page === 1) {
            return {
              ...page,
              data: [
                {
                  ...parsedData.data.conversation,
                  latest_message: parsedData.data.message,
                },
                ...filteredConversations,
              ],
            };
          }

          return {
            ...page,
            data: filteredConversations,
          };
        });

        return {
          pageParams: data.pageParams,
          pages: newPages,
        };
      },
    );
  } catch (error) {
    console.error("[XWS] error:", error);
  }
}

export function handleCurrentConversationMessages(data: EventMap["message"]) {
  try {
    const parsedData = parseData(data);

    if (
      parsedData.type !== "MESSAGE_RECIEVED" &&
      parsedData.type !== "MESSAGE_EDITED" &&
      parsedData.type !== "MESSAGE_DELETED"
    ) {
      return;
    }

    if (parsedData.data.message.chat_id !== currentConversationStore.state.id) {
      return;
    }

    let messages: ConversationMessage[] = [];

    if (parsedData.type === "MESSAGE_RECIEVED") {
      messages = [
        ...currentConversationStore.state.messages,
        parsedData.data.message,
      ];
    }

    if (parsedData.type === "MESSAGE_EDITED") {
      messages = currentConversationStore.state.messages.map((m) =>
        m.id === parsedData.data.message.id ? parsedData.data.message : m,
      );
    }

    if (parsedData.type === "MESSAGE_DELETED") {
      messages = currentConversationStore.state.messages.filter(
        (m) => m.id !== parsedData.data.message.id,
      );
    }

    currentConversationStore.setState((state) => ({
      ...state,
      messages: fastDedupe(messages, "id"),
    }));
  } catch (error) {
    console.error("[XWS] error:", error);
  }
}

export function handleMessageStatus(data: EventMap["message"]) {
  try {
    const parsedData = parseData(data);

    if (parsedData.type !== "MESSAGE_STATUS") {
      return;
    }

    const { data: mst } = parsedData;

    currentConversationStore.setState((state) => ({
      ...state,
      messages: state.messages.map((m) =>
        mst.message_ids.includes(m.id) ? { ...m, status: mst.status } : m,
      ),
    }));
  } catch (error) {
    console.error("[XWS] error:", error);
  }
}

export function handleWhatsAppConnect(onConnected: () => void) {
  return (data: EventMap["message"]) => {
    try {
      const parsedData = parseData(data);

      if (parsedData.type !== "CONNECT_STATUS") {
        return;
      }

      const connectStatusData = parsedData.data;

      if (connectStatusData.status !== "CONNECTED") {
        return;
      }

      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["whatsappContacts"],
        });
        queryClient.invalidateQueries({
          queryKey: ["whatsappGroups"],
        });
        queryClient.invalidateQueries({
          queryKey: ["whatsappConversationsInf"],
        });
      }, 2000);

      onConnected();
    } catch (error) {
      console.error("[XWS] error:", error);
    }
  };
}

export function handleWhatsAppLoginRequest(data: EventMap["message"]) {
  try {
    const parsedData = parseData(data);

    if (parsedData.type !== "CONNECT_STATUS") {
      return;
    }

    const connectStatusData = parsedData.data;

    whatsappLoginStore.setState(() => ({
      loginQr:
        connectStatusData.status === "LOGIN"
          ? connectStatusData.qr_code
          : undefined,
      status: connectStatusData.status,
    }));
  } catch (error) {
    console.error("[XWS] error:", error);
  }
}

export function requestConnectToNetwork(network: Network) {
  sendMessage({ network: network.toUpperCase(), type: "REQUEST_CONNECT" });
}

export function sendMessage(data: Record<string, unknown>) {
  const sdata = JSON.stringify(data);

  if (!socketStateStore.state.authenticated) {
    socketStateStore.setState((state) => ({
      ...state,
      messageQueue: [...state.messageQueue, sdata],
    }));
  } else {
    websocketClient.send(sdata);
  }
}

function parseData(data: ArrayBuffer | string) {
  if (typeof data !== "string") {
    throw new Error("Invalid data");
  }

  const parsedData = JSON.parse(data);

  if (!parsedData?.type) {
    throw new Error("Invalid data");
  }

  return parsedData as ParsedRawData;
}
