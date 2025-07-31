import { ImageIcon, Loader2 } from "lucide-react";

import type { ConversationMessage } from "@/data/types";

import { cn } from "@/components/libs/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { whatsappFileQueryOptions } from "@/data/conversation.whatsapp";
import useDiskCachedQuery from "@/hooks/query/use-disk-cached-query";

type MediaMessageProps = {
  data: ConversationMessage;
  isMe: boolean;
};

export default function MessageMedia({ data, isMe }: MediaMessageProps) {
  const {
    data: blob,
    isLoading,
    isSuccess,
  } = useDiskCachedQuery(whatsappFileQueryOptions(data.id));

  if (data.message_type !== "video" && data.message_type !== "image") {
    return null;
  }

  const caption =
    data.message_type === "image"
      ? data.image_message_info.caption
      : data.video_message_info.caption;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative max-w-48 space-y-2">
          <div
            className={cn(
              "flex min-h-20 w-full min-w-20 items-center justify-center overflow-hidden rounded-md",
              isMe ? "bg-secondary/20" : "bg-primary/10",
            )}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : isSuccess ? (
              <img alt="Image" src={URL.createObjectURL(blob)} />
            ) : (
              <ImageIcon />
            )}
          </div>
          {caption && <p className="px-2 text-sm">{caption}</p>}
        </div>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-full max-w-full"
      >
        <DialogTitle>{caption}</DialogTitle>
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : isSuccess ? (
          <img alt="Image" src={URL.createObjectURL(blob)} />
        ) : (
          <ImageIcon />
        )}
      </DialogContent>
    </Dialog>
  );
}
