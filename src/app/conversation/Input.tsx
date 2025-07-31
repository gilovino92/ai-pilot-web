import { useStore } from "@tanstack/react-store";
import { Send } from "lucide-react";

import type { Network } from "@/data/types";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sendMessage } from "@/data/socket";
import { currentConversationStore } from "@/stores/conversation";

import InputAttachment from "./InputAttachment";
import InputReply from "./InputReply";
import MessageRefinement from "./MessageRefinement";

type InputProps = {
  conversationId: string;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
  network: Network;
};

export default function InputMessage({
  conversationId,
  inputRef,
  network,
}: InputProps) {
  const reply = useStore(currentConversationStore, (s) => s.reply);
  const edit = useStore(currentConversationStore, (s) => s.edit);

  const handleSend = () => {
    if (!inputRef?.current) {
      return;
    }

    const content = inputRef.current.value.trim();

    if (!content) {
      return;
    }

    if (edit) {
      sendMessage({
        data: {
          message: {
            ...edit,
            conversation: content,
          },
        },
        network: network.toUpperCase(),
        type: "EDIT_MESSAGE",
      });

      window.gtag("event", "conversation_message_edited", {
        conversation_id: conversationId,
        message_length: content.length,
        message_type: "text",
        network,
      });

      currentConversationStore.setState((state) => ({
        ...state,
        edit: undefined,
      }));

      inputRef.current.value = "";

      return;
    }

    sendMessage({
      data: {
        conversation: content,
        replied_message_id: reply?.id,
        target_id: conversationId,
      },
      network: network.toUpperCase(),
      type: "SEND_MESSAGE",
    });

    window.gtag("event", "conversation_message_sent", {
      conversation_id: conversationId,
      message_length: content.length,
      message_type: "text",
      network,
    });

    currentConversationStore.setState((state) => ({
      ...state,
      reply: undefined,
    }));

    inputRef.current.value = "";
  };

  return (
    <div className="relative flex items-end gap-2">
      {reply && (
        <InputReply
          data={reply}
          onCancel={() =>
            currentConversationStore.setState((state) => ({
              ...state,
              reply: undefined,
            }))
          }
        />
      )}
      <div className="flex w-full flex-col gap-2 rounded-md border bg-white p-2">
        <Textarea
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="border-transparent shadow-none ring-transparent"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.stopPropagation();
              handleSend();
            }
          }}
          placeholder="Type your message here..."
          ref={inputRef}
          spellCheck={false}
        />
        <div className="flex items-center gap-2 self-end">
          <MessageRefinement
            conversationId={conversationId}
            inputRef={inputRef}
          />
          <InputAttachment conversationId={conversationId} />
          <Button onClick={handleSend} size="icon">
            <Send />
          </Button>
        </div>
      </div>
    </div>
  );
}
