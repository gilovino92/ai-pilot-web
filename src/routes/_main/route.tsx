import { createFileRoute, redirect } from "@tanstack/react-router";

import websocketClient from "@/config/socket";
import { authenticateSocket, handleAuthRequest } from "@/data/socket";

export const Route = createFileRoute("/_main")({
  beforeLoad: async ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({
        to: "/welcome",
      });
    }
  },
  onEnter: async ({ context }) => {
    if (!context.isAuthenticated) {
      return;
    }

    await websocketClient.connect();

    websocketClient.once("message", handleAuthRequest);
    authenticateSocket();
  },
});
