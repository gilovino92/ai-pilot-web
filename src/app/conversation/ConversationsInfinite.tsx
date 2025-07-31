import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

import { ScrollArea } from "@/components/cui/scroll-area";
import { useInfiniteWhatsAppConversations } from "@/data/hooks/conversation";

import Conversation from "./Conversation";

type ConversationsInfiniteProps = {
  from: "/companies/$companyId/conversations" | "/conversations";
};

export default function ConversationsInfinite({
  from,
}: ConversationsInfiniteProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  const [inViewTopRef, isInViewTop] = useInView();
  const [inViewBottomRef, isInViewBottom] = useInView();
  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchedAfterMount,
    isFetching,
  } = useInfiniteWhatsAppConversations();

  const conversations = data?.data ?? [];
  const total = conversations.length;

  const virtualizer = useVirtualizer({
    count: total,
    estimateSize: () => 100,
    gap: 8,
    getScrollElement: () => viewportRef.current,
  });

  const rows = virtualizer.getVirtualItems();

  useEffect(() => {
    if (isInViewTop && isFetchedAfterMount && hasPreviousPage && !isFetching) {
      fetchPreviousPage();
    }

    if (isInViewBottom && isFetchedAfterMount && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchedAfterMount,
    isFetching,
    isInViewBottom,
    isInViewTop,
  ]);

  return (
    <div className="min-h-0 flex-1">
      <ScrollArea className="h-full" viewport={{ ref: viewportRef }}>
        <div ref={inViewTopRef} />
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
                transform: `translateY(${row.start}px)`,
              }}
            >
              <Conversation
                data={conversations[row.index]}
                from={from}
                network="whatsapp"
              />
            </div>
          ))}
        </div>
        <div ref={inViewBottomRef} />
      </ScrollArea>
    </div>
  );
}
