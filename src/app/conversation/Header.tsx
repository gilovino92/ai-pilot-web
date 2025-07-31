import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { Tag } from "lucide-react";

import type { Network } from "@/data/types";

import { Button } from "@/components/ui/button";

import LinkConversationCompany from "./LinkConversationCompany";
import WhatsAppNameFast from "./WhatsAppNameFast";

type HeaderProps = {
  conversationId: string;
  hideLink?: boolean;
  network: Network;
};

export default function Header({
  conversationId,
  hideLink,
  network,
}: HeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {network === "whatsapp" && (
            <WhatsAppNameFast conversationId={conversationId} />
          )}
        </h3>
        <div className="flex items-center gap-2">
          {network === "whatsapp" && (
            <div className="text-muted-foreground inline-flex items-center gap-2 text-sm">
              <SiWhatsapp className="shrink-0 text-[#25D366]" size={14} />
              WhatsApp
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline">
          <Tag />
          Tag
        </Button>
        {!hideLink && (
          <LinkConversationCompany
            conversationId={conversationId}
            network={network}
          />
        )}
      </div>
    </div>
  );
}
