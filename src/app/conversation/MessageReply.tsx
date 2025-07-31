import type { ConversationMessage, Network } from "@/data/types";

import { cn } from "@/components/libs/utils";

import WhatsAppContactName from "./WhatsAppContactName";

type MessageReplyProps = {
  getIsMe: (id: string) => boolean;
  getMessage: (id: string) =>
    | {
        data: ConversationMessage;
        index: number;
      }
    | undefined;
  isMe: boolean;
  messageId: string;
  network: Network;
  onClick?: (data: { data: ConversationMessage; index: number }) => void;
};

export default function MessageReply({
  getIsMe,
  getMessage,
  isMe,
  messageId,
  network,
  onClick,
}: MessageReplyProps) {
  const message = getMessage(messageId);
  const isMessageBelongToMe = getIsMe(message?.data.sender_id ?? "");

  if (!message) {
    return (
      <div className={cn("bg-muted rounded-md px-1", isMe && "bg-muted/20")}>
        <div className="px-2 py-1 text-xs">
          <p className="italic">Message not found</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("bg-muted rounded-md px-1", isMe && "bg-muted/20")}
      onClick={() => {
        onClick?.(message);
      }}
    >
      <div className="px-2 py-1 text-xs">
        <p className="text-[10px] font-medium opacity-75">
          {isMessageBelongToMe ? (
            "You"
          ) : network === "whatsapp" ? (
            <WhatsAppContactName contactId={message.data.sender_id} />
          ) : null}
        </p>
        <p className="line-clamp-2 text-sm">
          {message.data.message_type === "text" ? (
            message.data.conversation
          ) : (
            <em>[Media/Document]</em>
          )}
        </p>
      </div>
    </div>
  );
}
