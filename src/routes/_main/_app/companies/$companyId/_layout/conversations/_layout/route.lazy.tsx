import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute, Outlet } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useDebounceValue } from "usehooks-ts";

import Conversations from "@/app/conversation/Conversations";
import ConversationsSearchResult from "@/app/conversation/ConversationsSearchResult";
import LinkConversation from "@/app/conversation/LinkConversation";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { customerConversationQueryOptions } from "@/data/conversation";
import { whatsappSearchConversationsQueryOptions } from "@/data/conversation.whatsapp";

import { Route as RouteImport } from "./route";

export const Route = createLazyFileRoute(
  "/_main/_app/companies/$companyId/_layout/conversations/_layout",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { companyId } = Route.useParams();
  const [query, setQuery] = useDebounceValue("", 500);

  const { data } = useSuspenseQuery(
    customerConversationQueryOptions(companyId, "whatsapp"),
  );

  const { data: searchResult, isLoading } = useQuery(
    whatsappSearchConversationsQueryOptions(query),
  );

  return (
    <div className="grid min-h-0 flex-1 grid-cols-3 gap-2">
      <div className="flex h-full min-h-0 flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Conversations
          </h4>
          <LinkConversation customerId={companyId} />
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
        {searchResult ? (
          <ConversationsSearchResult
            data={searchResult}
            from={RouteImport.fullPath}
          />
        ) : isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="text-muted-foreground animate-spin" />
          </div>
        ) : (
          <Conversations data={data} from={RouteImport.fullPath} />
        )}
      </div>
      <div className="bg-muted col-span-2 h-full min-h-0 rounded-md">
        <Outlet />
      </div>
    </div>
  );
}
