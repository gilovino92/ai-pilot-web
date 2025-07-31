import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { format, isToday } from "date-fns";
import { User2 } from "lucide-react";

import type { Conversation } from "@/data/types";
import type { WhatsAppContact, WhatsAppGroup } from "@/data/types.whatsapp";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { whatsappAvatarQueryOptions } from "@/data/conversation.whatsapp";
import useDiskCachedQuery from "@/hooks/query/use-disk-cached-query";

import WhatsAppNameFast from "./WhatsAppNameFast";
import WhatsAppNameFromData from "./WhatsAppNameFromData";

type ConversationWhatsAppProps = {
  contact?: WhatsAppContact;
  data: Conversation;
  group?: WhatsAppGroup;
};

export default function ConversationWhatsApp({
  contact,
  data,
  group,
}: ConversationWhatsAppProps) {
  const { data: avatar } = useDiskCachedQuery(
    {
      ...whatsappAvatarQueryOptions(data.id),
      select: (avatars) => avatars[0],
    },
    Infinity,
  );

  const lastMessageDate = data.latest_message
    ? new Date(data.latest_message.timestamp * 1000)
    : undefined;

  return (
    <div className="group-[&[data-status~=active]]:bg-muted flex items-center gap-4 rounded-md border p-2">
      <div className="relative shrink-0">
        <Avatar className="size-12">
          <AvatarImage src={avatar?.avatar || undefined} />
          <AvatarFallback>
            <User2 />
          </AvatarFallback>
        </Avatar>
        <div className="absolute -right-1 -bottom-1 rounded-full bg-[#25D366] p-1">
          <SiWhatsapp color="white" size={12} />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex flex-col justify-between xl:flex-row">
          <p className="line-clamp-1 font-medium">
            {contact || group ? (
              <WhatsAppNameFromData contact={contact} group={group} />
            ) : (
              <WhatsAppNameFast conversationId={data.id} />
            )}
          </p>
          <span className="text-muted-foreground text-[10px]">
            {lastMessageDate &&
              (isToday(lastMessageDate)
                ? format(lastMessageDate, "p")
                : format(lastMessageDate, "PP"))}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-muted-foreground line-clamp-1 text-sm">
            {!data.latest_message ? null : data.latest_message.message_type ===
              "text" ? (
              data.latest_message?.conversation
            ) : (
              <em>[Media/Document]</em>
            )}
          </p>
          {data.unread_count > 0 && (
            <span className="bg-destructive flex size-5 shrink-0 items-center justify-center rounded-full text-xs text-white">
              {data.unread_count}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
