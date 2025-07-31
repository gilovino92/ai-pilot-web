import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute, Link, Outlet } from "@tanstack/react-router";
import { LayoutGrid, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useDebounceValue } from "usehooks-ts";

import ConversationsInfinite from "@/app/conversation/ConversationsInfinite";
import ConversationsSearchResult from "@/app/conversation/ConversationsSearchResult";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { whatsappSearchConversationsQueryOptions } from "@/data/conversation.whatsapp";

import { Route as RouteImport } from "./route";

export const Route = createLazyFileRoute("/_main/_app/conversations/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const [query, setQuery] = useDebounceValue("", 500);

  const { data, isFetching, isLoading } = useQuery(
    whatsappSearchConversationsQueryOptions(query),
  );

  useEffect(() => {
    if (isFetching) {
      window.gtag("event", "conversations_search", {
        search_query_length: query.length,
      });
    }
  }, [isFetching, query]);

  return (
    <div className="grid min-h-0 flex-1 grid-cols-3 gap-2">
      <div className="flex h-full min-h-0 flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Conversations
          </h4>
          <Button asChild variant="outline">
            <Link to="/conversations/connect">
              <LayoutGrid />
              Connect Apps
            </Link>
          </Button>
        </div>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max gap-2 pb-3">
            <Badge>All</Badge>
            <Badge variant="secondary">WhatsApp</Badge>
            <Badge variant="secondary">WeChat</Badge>
            <Badge variant="secondary">Telegram</Badge>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <Input
          defaultValue=""
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          placeholder="Search"
        />
        {data ? (
          <ConversationsSearchResult data={data} from={RouteImport.fullPath} />
        ) : isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="text-muted-foreground animate-spin" />
          </div>
        ) : (
          <ConversationsInfinite from={RouteImport.fullPath} />
        )}
      </div>
      <div className="bg-muted col-span-2 h-full min-h-0 rounded-md">
        <Outlet />
      </div>
    </div>
  );
}
