import { useQuery } from "@tanstack/react-query";

import { whatsappGroupsQueryOptions } from "@/data/contact.whatsapp";

import { getWhatsAppGroupName } from "./utils";

type WhatsAppNameProps = {
  conversationId: string;
};

export default function WhatsAppGroupName({
  conversationId,
}: WhatsAppNameProps) {
  const { data: group } = useQuery({
    ...whatsappGroupsQueryOptions(),
    select: (groups) => groups.find((group) => group.id === conversationId),
  });

  return getWhatsAppGroupName(group);
}
