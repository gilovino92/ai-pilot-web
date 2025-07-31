import WebSocketClient from "@/libs/ws";
import { socketStatsStote } from "@/stores/socket";

const websocketClient = new WebSocketClient(import.meta.env.VITE_POC_WS_URL);

websocketClient.on("open", () => {
  console.log("[XWS] connected");

  updateSocketStats();
});

websocketClient.on("close", () => {
  console.log("[XWS] disconnected");
});

websocketClient.on("error", (error) => {
  console.error("[XWS] error:", error);
});

websocketClient.on("latencyUpdate", () => {
  updateSocketStats();
});

export function updateSocketStats() {
  const stats = websocketClient.getStats();

  socketStatsStote.setState(() => stats);
}

export default websocketClient;
