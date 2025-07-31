import { createFileRoute, redirect } from "@tanstack/react-router";
import * as z from "zod";

import websocketClient from "@/config/socket";
import { meQueryOptions } from "@/data/contact";
import {
  handleWhatsAppLoginRequest,
  requestConnectToNetwork,
} from "@/data/socket";

export const Route = createFileRoute(
  "/_main/_app/conversations/connect/$network",
)({
  beforeLoad: async ({ context, params }) => {
    const me = await context.queryClient.ensureQueryData(meQueryOptions());

    if (params.network === "whatsapp" && me.is_whatapp_connected) {
      return redirect({ to: "/conversations" });
    }
  },
  loader: async () => {
    websocketClient.on("message", handleWhatsAppLoginRequest);
    requestConnectToNetwork("whatsapp");
  },
  onLeave: async () => {
    websocketClient.off("message", handleWhatsAppLoginRequest);
  },
  params: {
    parse: z.object({
      network: z.enum(["whatsapp"]),
    }).parse,
  },
});
