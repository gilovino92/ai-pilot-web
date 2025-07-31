import { SiGmail, SiWhatsapp } from "@icons-pack/react-simple-icons";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { meQueryOptions } from "@/data/contact";

export const Route = createLazyFileRoute("/_main/_app/conversations/connect/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: me } = useSuspenseQuery(meQueryOptions());

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Connect an app to start
      </h3>
      <div className="flex gap-6">
        <div className="flex flex-col items-center gap-4">
          <SiWhatsapp className="h-12 w-12" color="default" />
          <Button disabled={me.is_whatapp_connected}>
            <Link
              params={{ network: "whatsapp" }}
              preload={false}
              to="/conversations/connect/$network"
            >
              {me.is_whatapp_connected ? "Connected" : "Connect"}
            </Link>
          </Button>
        </div>
        <Separator orientation="vertical" />
        <div className="flex flex-col items-center gap-4">
          <img alt="LinkedIn" className="h-12 w-auto" src="/li_in.png" />
          <Button disabled>Coming soon</Button>
        </div>
        <Separator orientation="vertical" />
        <div className="flex flex-col items-center gap-4">
          <SiGmail className="h-12 w-12" color="default" />
          <Button disabled>Coming soon</Button>
        </div>
      </div>
    </div>
  );
}
