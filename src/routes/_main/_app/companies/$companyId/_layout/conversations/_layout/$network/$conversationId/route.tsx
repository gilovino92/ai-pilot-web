import { createFileRoute } from "@tanstack/react-router";

import websocketClient from "@/config/socket";
import {
  handleCurrentConversationMessages,
  handleMessageStatus,
  sendMessage,
} from "@/data/socket";
import {
  currentConversationStore,
  defaultCurrentConversationState,
} from "@/stores/conversation";

export const Route = createFileRoute(
  "/_main/_app/companies/$companyId/_layout/conversations/_layout/$network/$conversationId",
)({
  onEnter: async ({ context, params }) => {
    websocketClient.on("message", handleCurrentConversationMessages);
    websocketClient.on("message", handleMessageStatus);
    currentConversationStore.setState((state) => ({
      ...state,
      id: params.conversationId,
    }));
    context.queryClient.invalidateQueries(
      {
        queryKey: ["whatsappConversationsInf"],
      },
      { cancelRefetch: false },
    );
    sendMessage({
      data: {
        conversation_id: params.conversationId,
        status: "open",
      },
      network: params.network.toUpperCase(),
      type: "UPDATE_CONVERSATION_STATUS",
    });
  },
  onLeave: async ({ params }) => {
    websocketClient.off("message", handleCurrentConversationMessages);
    websocketClient.off("message", handleMessageStatus);
    currentConversationStore.setState(() => defaultCurrentConversationState);
    sendMessage({
      data: {
        conversation_id: params.conversationId,
        status: "close",
      },
      network: params.network.toUpperCase(),
      type: "UPDATE_CONVERSATION_STATUS",
    });
  },
});
