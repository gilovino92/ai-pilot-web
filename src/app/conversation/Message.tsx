import { format } from "date-fns";
import { Check, CheckCheck, MoreVertical } from "lucide-react";
import { useState } from "react";

import type { ConversationMessage, Network } from "@/data/types";

import { cn } from "@/components/libs/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sendMessage } from "@/data/socket";

import MessageDocument from "./MessageDocument";
import MessageMedia from "./MessageMedia";
import MessageReply from "./MessageReply";
import MessageText from "./MessageText";
import WhatsAppContactName from "./WhatsAppContactName";

type MessageProps = {
  data: ConversationMessage;
  getIsMe: (id: string) => boolean;
  getMessage: (id: string) =>
    | {
        data: ConversationMessage;
        index: number;
      }
    | undefined;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
  isConsecutive: boolean;
  isMe: boolean;
  isShowStatus: boolean;
  network: Network;
  onEditMessage?: (data: ConversationMessage) => void;
  onMessageClick?: (data: { data: ConversationMessage; index: number }) => void;
  onReplyMessage?: (data: ConversationMessage) => void;
};

const ALLOW_EDIT_TIME = 10 * 60 * 1000;

export default function Message({
  data,
  getIsMe,
  getMessage,
  inputRef,
  isConsecutive = false,
  isMe = false,
  isShowStatus = false,
  network,
  onEditMessage,
  onMessageClick,
  onReplyMessage,
}: MessageProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const isEditable =
    isMe && data.timestamp * 1000 + ALLOW_EDIT_TIME > Date.now();

  return (
    <div
      className={cn(
        "flex",
        !isConsecutive ? "mt-4" : "mt-2",
        isMe ? "justify-end pr-3" : "justify-start pl-3",
      )}
      id={data.id}
    >
      <div className="flex max-w-4/5 flex-col items-start gap-1">
        {!isConsecutive && (
          <p
            className={cn("text-muted-foreground text-xs", isMe && "self-end")}
          >
            {isMe ? (
              "You"
            ) : network === "whatsapp" ? (
              <WhatsAppContactName contactId={data.sender_id} />
            ) : null}
          </p>
        )}
        <div
          className={cn(
            "flex max-w-full items-end gap-2",
            !isMe && "flex-row-reverse",
          )}
        >
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "hover:bg-muted-foreground/10 cursor-pointer rounded-full p-1",
              )}
            >
              <MoreVertical className="text-muted-foreground" size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={!isMe ? "start" : "end"}
              onCloseAutoFocus={(e) => {
                e.preventDefault();
              }}
              side="top"
            >
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => {
                  onReplyMessage?.(data);
                  window.gtag("event", "conversation_message_replied", {
                    conversation_id: data.id,
                    network,
                  });
                }}
              >
                Reply
              </DropdownMenuItem>
              {data.message_type === "text" && (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => {
                    if (data.conversation) {
                      navigator.clipboard.writeText(data.conversation);
                    }
                  }}
                >
                  Copy {data.message_type === "text" ? "message" : "caption"}
                </DropdownMenuItem>
              )}
              {data.message_type === "text" &&
                !isMe &&
                (showTranslation ? (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={() => {
                      setShowTranslation(false);
                      window.gtag(
                        "event",
                        "conversation_translation_show_original",
                        {
                          conversation_id: data.id,
                          network,
                        },
                      );
                    }}
                  >
                    Show original
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={() => {
                      setShowTranslation(true);
                      window.gtag(
                        "event",
                        "conversation_translation_requested",
                        {
                          conversation_id: data.id,
                          network,
                        },
                      );
                    }}
                  >
                    Translate
                  </DropdownMenuItem>
                ))}
              {data.message_type === "text" && isEditable && (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => {
                    onEditMessage?.(data);
                  }}
                >
                  Edit
                </DropdownMenuItem>
              )}
              {isEditable && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={() => {
                      sendMessage({
                        data: {
                          message: {
                            id: data.id,
                          },
                        },
                        network: network.toUpperCase(),
                        type: "DELETE_MESSAGE",
                      });
                    }}
                    variant="destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            className={cn(
              "max-w-full space-y-1 overflow-hidden rounded-lg p-1",
              isMe
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground",
            )}
          >
            {data.message_context?.replied_message_id ? (
              <MessageReply
                getIsMe={getIsMe}
                getMessage={getMessage}
                isMe={isMe}
                messageId={data.message_context.replied_message_id}
                network={network}
                onClick={onMessageClick}
              />
            ) : null}
            {data.message_type === "text" ? (
              <MessageText
                data={data}
                inputRef={inputRef}
                isMe={isMe}
                showTranslation={showTranslation}
              />
            ) : data.message_type === "document" ? (
              <MessageDocument data={data} isMe={isMe} />
            ) : data.message_type === "image" ||
              data.message_type === "video" ? (
              <MessageMedia data={data} isMe={isMe} />
            ) : (
              <div className="text-muted-foreground text-sm italic">
                Unsupported message
              </div>
            )}
            <div className="mt-2 flex items-center justify-between gap-2 px-2">
              <span className="text-primary-foreground opacity-80">
                {isMe && isShowStatus ? (
                  data.status === "read" ? (
                    <CheckCheck size={14} />
                  ) : (
                    <Check size={14} />
                  )
                ) : (
                  ""
                )}
              </span>
              <span
                className={cn(
                  "text-[10px] opacity-80",
                  isMe ? "text-primary-foreground" : "text-muted-foreground",
                )}
              >
                {data.is_edited ? "Edited at " : ""}
                {format(data.timestamp * 1000, "HH:mm")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
