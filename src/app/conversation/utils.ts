import type { Network } from "@/data/types";
import type { WhatsAppContact, WhatsAppGroup } from "@/data/types.whatsapp";

import { networks } from "@/data/consts";

export function canPreviewFile(mimeType: string) {
  return (
    mimeType.startsWith("image/") ||
    mimeType.startsWith("audio/") ||
    mimeType.startsWith("video/")
  );
}

export function getWhatsAppContactName(contact?: WhatsAppContact) {
  return (
    contact?.full_name ||
    contact?.first_name ||
    contact?.push_name ||
    contact?.phone_number ||
    "<UNNAMED PERSON>"
  );
}

export function getWhatsAppGroupName(group?: WhatsAppGroup) {
  return group?.name || "<UNNAMED GROUP>";
}

export function isSupportedNetwork(network: string): network is Network {
  return networks.includes(network as Network);
}
