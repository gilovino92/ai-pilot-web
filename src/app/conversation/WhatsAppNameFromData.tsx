import type { WhatsAppContact, WhatsAppGroup } from "@/data/types.whatsapp";

import { getWhatsAppContactName, getWhatsAppGroupName } from "./utils";

type WhatsAppNameFromDataProps = {
  contact?: WhatsAppContact;
  group?: WhatsAppGroup;
};

export default function WhatsAppNameFromData({
  contact,
  group,
}: WhatsAppNameFromDataProps) {
  if (group) {
    return getWhatsAppGroupName(group);
  }

  if (contact) {
    return getWhatsAppContactName(contact);
  }

  return "<UNNAMED>";
}
