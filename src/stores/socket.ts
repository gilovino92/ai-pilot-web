import { Store } from "@tanstack/store";

import { type ConnectionStats } from "@/libs/ws";

export const socketStatsStote = new Store<ConnectionStats>({
  bytesReceived: 0,
  bytesSent: 0,
  connectTime: 0,
  disconnectTime: null,
  latency: null,
  messagesReceived: 0,
  messagesSent: 0,
  reconnectCount: 0,
});

export const socketStateStore = new Store<{
  authenticated: boolean;
  messageQueue: string[];
}>({
  authenticated: false,
  messageQueue: [],
});
