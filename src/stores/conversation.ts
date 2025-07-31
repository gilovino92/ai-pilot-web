import { Store } from "@tanstack/store";

import type { ConversationMessage } from "@/data/types";

export const defaultCurrentConversationState = {
  id: "",
  messages: [],
};

export const currentConversationStore = new Store<{
  edit?: ConversationMessage;
  id: string;
  messages: ConversationMessage[];
  reply?: ConversationMessage;
}>(defaultCurrentConversationState);
