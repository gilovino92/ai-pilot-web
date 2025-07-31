import { createLazyFileRoute } from "@tanstack/react-router";
import { useRef } from "react";

import { ConversationSummary } from "@/app/conversation/ConversationSummary";
import Header from "@/app/conversation/Header";
import Input from "@/app/conversation/Input";
import Messages from "@/app/conversation/Messages";
import { isSupportedNetwork } from "@/app/conversation/utils";
import Reminder from "@/app/task/Reminder";

import "@/custom.css";

export const Route = createLazyFileRoute(
  "/_main/_app/conversations/_layout/$network/$conversationId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { conversationId, network } = Route.useParams();

  const inputRef = useRef<HTMLTextAreaElement>(null);

  if (isSupportedNetwork(network)) {
    return (
      <div className="flex h-full flex-col gap-2 p-2">
        <Header conversationId={conversationId} network={network} />
        <Reminder conversationId={conversationId} />
        <ConversationSummary conversationId={conversationId} />
        <Messages
          conversationId={conversationId}
          inputRef={inputRef}
          network={network}
        />
        <Input
          conversationId={conversationId}
          inputRef={inputRef}
          network={network}
        />
      </div>
    );
  }

  return null;
}
