import { useQueryClient } from "@tanstack/react-query";
import { createLazyFileRoute, useRouter } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { Loader2, RefreshCcw } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect } from "react";

import type { Me } from "@/data/types";

import { Button } from "@/components/ui/button";
import { whatsappLoginStore } from "@/stores/whatsapp";

export const Route = createLazyFileRoute(
  "/_main/_app/conversations/connect/$network",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { loginQr, status } = useStore(whatsappLoginStore);

  useEffect(() => {
    if (status === "CONNECTED") {
      queryClient.setQueryData<Me>(["me"], (data) => {
        if (!data) {
          return;
        }

        return {
          ...data,
          is_whatapp_connected: true,
        };
      });
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });
      router.navigate({ to: "/conversations" });
    }
  }, [queryClient, router, status]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <p className="text-muted-foreground text-center text-sm">
        Open WhatsApp on your phone and scan the QR code below to connect.
      </p>
      <div className="flex size-72 items-center justify-center rounded-lg border p-4">
        {status === "PENDING" && (
          <Loader2 className="text-muted-foreground animate-spin" size={64} />
        )}
        {status === "LOGIN" && loginQr && (
          <QRCodeSVG className="size-full" size={256} value={loginQr} />
        )}
        {(status === "DISCONNECTED" || status === "ERROR") && (
          <div className="flex flex-col items-center justify-center gap-2">
            <Button
              onClick={() => {
                whatsappLoginStore.setState(() => ({
                  status: "PENDING",
                }));
              }}
              size="icon"
              variant="outline"
            >
              <RefreshCcw />
            </Button>
            <p className="text-muted-foreground text-center text-sm">
              Failed to connect to WhatsApp.
            </p>
          </div>
        )}
      </div>
      <p className="text-muted-foreground text-center text-sm">
        <em>
          We are not responsible for any issues that may occur with your
          WhatsApp account.
          <br />
          Use at your own risk.
        </em>
      </p>
    </div>
  );
}
