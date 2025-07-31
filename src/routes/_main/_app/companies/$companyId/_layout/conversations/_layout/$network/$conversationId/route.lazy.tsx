import { createLazyFileRoute } from "@tanstack/react-router";
import { useRef } from "react";

import Header from "@/app/conversation/Header";
import Input from "@/app/conversation/Input";
import Messages from "@/app/conversation/Messages";
import { isSupportedNetwork } from "@/app/conversation/utils";
import Reminder from "@/app/task/Reminder";

export const Route = createLazyFileRoute(
  "/_main/_app/companies/$companyId/_layout/conversations/_layout/$network/$conversationId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { conversationId, network } = Route.useParams();

  const inputRef = useRef<HTMLTextAreaElement>(null);

  if (isSupportedNetwork(network)) {
    return (
      <div className="flex h-full flex-col gap-2 p-4">
        <Header conversationId={conversationId} hideLink network={network} />
        <Reminder conversationId={conversationId} />
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
