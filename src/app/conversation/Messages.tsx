import type { Network } from "@/data/types";

import WhatsAppMessages from "./WhatsAppMessages";

type MessagesProps = {
  conversationId: string;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
  network: Network;
};

export default function Messages({
  conversationId,
  inputRef,
  network,
}: MessagesProps) {
  if (network === "whatsapp") {
    return (
      <WhatsAppMessages conversationId={conversationId} inputRef={inputRef} />
    );
  }

  return null;
}
