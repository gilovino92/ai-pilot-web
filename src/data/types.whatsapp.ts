import type { Conversation } from "./types";

export type WhatsAppAvatar = {
  avatar: string;
  chat_id: string;
};

export type WhatsAppContact = {
  first_name: string;
  full_name: string;
  id: string;
  phone_number: string;
  push_name: string;
};

export type WhatsAppConversationSearchResult = {
  contact?: WhatsAppContact;
  conversation: Conversation;
  group?: WhatsAppGroup;
};

export type WhatsAppGroup = {
  created: number;
  id: string;
  name: string;
  participant_count: number;
  participants: {
    id: string;
    is_admin: boolean;
  }[];
};
