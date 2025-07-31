import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

import type { Conversation as TConversation } from "@/data/types";

import { ScrollArea } from "@/components/cui/scroll-area";

import Conversation from "./Conversation";

type ConversationsProps = {
  data: TConversation[];
  from: "/companies/$companyId/conversations" | "/conversations";
};

export default function Conversations({ data, from }: ConversationsProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  const total = data.length;

  const virtualizer = useVirtualizer({
    count: total,
    estimateSize: () => 100,
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
                data={data[row.index]}
                from={from}
                network="whatsapp"
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
