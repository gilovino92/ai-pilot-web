import { createFileRoute, redirect } from "@tanstack/react-router";

import websocketClient from "@/config/socket";
import { meQueryOptions } from "@/data/contact";
import {
  whatsappContactsQueryOptions,
  whatsappGroupsQueryOptions,
} from "@/data/contact.whatsapp";
import { customerConversationQueryOptions } from "@/data/conversation";
import {
  handleConversationUpdate,
  handleWhatsAppConnect,
  requestConnectToNetwork,
} from "@/data/socket";

export const Route = createFileRoute(
  "/_main/_app/companies/$companyId/_layout/conversations/_layout",
)({
  beforeLoad: async ({ context }) => {
    const me = await context.queryClient.ensureQueryData(meQueryOptions());

    if (!me.is_whatapp_connected) {
      return redirect({ to: "/conversations/connect" });
    }
  },
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      customerConversationQueryOptions(params.companyId, "whatsapp"),
    );
  },
  onEnter: async ({ context }) => {
    const me = await context.queryClient.ensureQueryData(meQueryOptions());

    if (me.is_whatapp_connected) {
      const handler = handleWhatsAppConnect(() => {
        websocketClient.off("message", handler);
      });

      websocketClient.on("message", handler);
      requestConnectToNetwork("whatsapp");
    }

    context.queryClient.prefetchQuery(whatsappContactsQueryOptions());
    context.queryClient.prefetchQuery(whatsappGroupsQueryOptions());

    websocketClient.on("message", handleConversationUpdate);
  },
  onLeave: async () => {
    websocketClient.off("message", handleConversationUpdate);
  },
});
