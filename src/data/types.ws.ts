import type { Conversation, ConversationMessage, Network } from "./types";
import type { WhatsAppContact, WhatsAppGroup } from "./types.whatsapp";

export type ConnectStatusData =
  | {
      qr_code: string;
      status: "LOGIN";
    }
  | {
      status: "CONNECTED" | "DISCONNECTED" | "ERROR";
    };

export type MessageStatusData = {
  chat_id: string;
  message_ids: string[];
  sender_id: string;
  status: "delivered" | "read" | "server";
};

export type ParsedRawData =
  | {
      data: {
        contact: WhatsAppContact;
        conversation: Conversation;
        group_info: WhatsAppGroup;
        message: ConversationMessage;
      };
      network: Uppercase<Network>;
      type: "MESSAGE_DELETED" | "MESSAGE_EDITED" | "MESSAGE_RECIEVED";
    }
  | {
      data: ConnectStatusData;
      network: Uppercase<Network>;
      type: "CONNECT_STATUS";
    }
  | {
      data: MessageStatusData;
      network: Uppercase<Network>;
      type: "MESSAGE_STATUS";
    }
  | {
      type: "auth_success";
      user_id: string;
    };
