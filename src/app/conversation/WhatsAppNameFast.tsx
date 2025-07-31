import WhatsAppContactName from "./WhatsAppContactName";
import WhatsAppGroupName from "./WhatsAppGroupName";

type WhatsAppNameFastProps = {
  conversationId: string;
};

export default function WhatsAppNameFast({
  conversationId,
}: WhatsAppNameFastProps) {
  if (conversationId.endsWith("@g.us")) {
    return <WhatsAppGroupName conversationId={conversationId} />;
  }

  if (conversationId.endsWith("@s.whatsapp.net")) {
    return <WhatsAppContactName contactId={conversationId} />;
  }

  return "<UNNAMED>";
}
