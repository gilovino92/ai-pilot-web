import { Store } from "@tanstack/store";

export const whatsappLoginStore = new Store<{
  loginQr?: string;
  status: "CONNECTED" | "DISCONNECTED" | "ERROR" | "LOGIN" | "PENDING";
}>({
  status: "PENDING",
});
