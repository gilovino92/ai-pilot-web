import { useQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { useVirtualizer } from "@tanstack/react-virtual";
import { isSameDay } from "date-fns";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

import { ScrollArea } from "@/components/cui/scroll-area";
import { meQueryOptions } from "@/data/contact";
import { useInfiniteWhatsAppConversation } from "@/data/hooks/conversation";
import { currentConversationStore } from "@/stores/conversation";

import Message from "./Message";
import MessageDate from "./MessageDate";

type WhatsAppMessagesProps = {
  conversationId: string;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
};

export default function WhatsAppMessages({
  conversationId,
  inputRef,
}: WhatsAppMessagesProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  const [inViewRef, isInView] = useInView();
  const { data: meWhatsAppId } = useQuery({
    ...meQueryOptions(),
    select: (data) => data.whatsapp_connected_id,
  });
  const { data, fetchNextPage } =
    useInfiniteWhatsAppConversation(conversationId);

  const historyMessages = data?.pages ?? [];
  const currentMessages = useStore(currentConversationStore, (s) => s.messages);

  const messages = [...historyMessages, ...currentMessages];
  const totalMessages = messages.length;

  const virtualizer = useVirtualizer({
    count: totalMessages,
    estimateSize: () => 150,
    getScrollElement: () => viewportRef.current,
    overscan: 5,
    paddingEnd: 8,
    scrollPaddingEnd: 8,
  });

  const rows = virtualizer.getVirtualItems();

  useEffect(() => {
    if (data?.pageParams[0] === 1) {
      virtualizer.scrollToIndex(totalMessages - 1);
    }
  }, [totalMessages, virtualizer, data?.pageParams]);

  useEffect(() => {
    if (isInView) {
      fetchNextPage();
    }
  }, [isInView, fetchNextPage]);

  return (
    <div className="min-h-0 flex-1">
      <ScrollArea className="h-full" viewport={{ ref: viewportRef }}>
        <div ref={inViewRef} />
        <div
          className="relative w-full"
          style={{
            height: `${virtualizer.getTotalSize()}px`,
          }}
        >
          {rows.map((row) => (
            <div
              className="absolute top-0 left-0 w-full"
              data-index={row.index}
              key={row.key}
              ref={virtualizer.measureElement}
              style={{
                height: `${rows[row.index]}px`,
                transform: `translateY(${row.start}px)`,
              }}
            >
              <MessageDate
                show={
                  !messages[row.index - 1] ||
                  !isSameDay(
                    messages[row.index].timestamp * 1000,
                    messages[row.index - 1].timestamp * 1000,
                  )
                }
                timestamp={messages[row.index].timestamp * 1000}
              />
              <Message
                data={messages[row.index]}
                getIsMe={(id) => id === meWhatsAppId}
                getMessage={(id) => {
                  const index = messages.findIndex(
                    (message) => message.id === id,
                  );

                  if (index === -1) {
                    return undefined;
                  }

                  return {
                    data: messages[index],
                    index,
                  };
                }}
                inputRef={inputRef}
                isConsecutive={
                  messages[row.index].sender_id ===
                  messages[row.index - 1]?.sender_id
                }
                isMe={messages[row.index].sender_id === meWhatsAppId}
                isShowStatus={row.index === totalMessages - 1}
                network="whatsapp"
                onEditMessage={(data) => {
                  currentConversationStore.setState((state) => ({
                    ...state,
                    edit: data,
                  }));

                  setTimeout(() => {
                    if (!inputRef?.current || data.message_type !== "text") {
                      return;
                    }

                    inputRef.current.value = data.conversation;

                    inputRef.current.focus();
                  }, 100);
                }}
                onMessageClick={(data) => {
                  virtualizer.scrollToIndex(data.index, {
                    align: "start",
                  });
                }}
                onReplyMessage={(data) => {
                  currentConversationStore.setState((state) => ({
                    ...state,
                    reply: data,
                  }));

                  setTimeout(() => {
                    inputRef?.current?.focus();
                  }, 100);
                }}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
