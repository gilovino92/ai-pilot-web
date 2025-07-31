import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

import type { ConversationSearchResult } from "@/data/types";

import { ScrollArea } from "@/components/cui/scroll-area";

import Conversation from "./Conversation";

type ConversationsSearchResultProps = {
  data: ConversationSearchResult[];
  from: "/companies/$companyId/conversations" | "/conversations";
};

export default function ConversationsSearchResult({
  data,
  from,
}: ConversationsSearchResultProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  const total = data.length;

  const virtualizer = useVirtualizer({
    count: total,
    estimateSize: () => 64,
    gap: 8,
    getScrollElement: () => viewportRef.current,
  });

  const rows = virtualizer.getVirtualItems();

  return (
    <div className="min-h-0 flex-1">
      <ScrollArea className="h-full" viewport={{ ref: viewportRef }}>
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
                contact={data[row.index].contact}
                data={data[row.index].conversation}
                from={from}
                group={data[row.index].group}
                network="whatsapp"
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
