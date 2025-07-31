import { useQuery } from "@tanstack/react-query";

import { whatsappConversationsQueryOptions } from "@/data/conversation.whatsapp";

import WhatsAppContactName from "./WhatsAppContactName";
import WhatsAppGroupName from "./WhatsAppGroupName";

type WhatsAppNameProps = {
  conversationId: string;
};

export default function WhatsAppName({ conversationId }: WhatsAppNameProps) {
  const { data } = useQuery({
    ...whatsappConversationsQueryOptions(),
    select: (conversations) =>
      conversations.data.find((c) => c.id === conversationId),
  });

  if (!data) {
    return null;
  }

  if (data.type === "group") {
    return <WhatsAppGroupName conversationId={conversationId} />;
  }

  return <WhatsAppContactName contactId={conversationId} />;
}
