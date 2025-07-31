import { useQuery } from "@tanstack/react-query";

import { whatsappContactsQueryOptions } from "@/data/contact.whatsapp";

import { getWhatsAppContactName } from "./utils";

type WhatsAppContactNameProps = {
  contactId: string;
};

export default function WhatsAppContactName({
  contactId,
}: WhatsAppContactNameProps) {
  const { data: contact } = useQuery({
    ...whatsappContactsQueryOptions(),
    select: (contacts) => contacts.find((contact) => contact.id === contactId),
  });

  return getWhatsAppContactName(contact);
}
