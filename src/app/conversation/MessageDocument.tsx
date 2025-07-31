import { useMutation } from "@tanstack/react-query";
import { Download, Loader2 } from "lucide-react";

import type { ConversationMessage } from "@/data/types";

import { cn } from "@/components/libs/utils";
import { Button } from "@/components/ui/button";
import { getWhatsAppFile } from "@/data/conversation.whatsapp";
import { downloadFile, formatFileSize, trimFilename } from "@/libs/file";

type MessageDocumentProps = {
  data: ConversationMessage;
  isMe: boolean;
};

export default function MessageDocument({ data, isMe }: MessageDocumentProps) {
  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      const blob = await getWhatsAppFile(data.id);

      await downloadFile(blob, data.id);
    },
  });

  if (data.message_type !== "document") {
    return null;
  }

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "bg-muted flex max-w-full items-center gap-2 rounded-md p-2",
          isMe && "bg-muted/20",
        )}
      >
        <Button
          disabled={isPending}
          onClick={() => {
            mutate();
          }}
          size="icon"
          variant={isMe ? "secondary" : "default"}
        >
          {isPending ? <Loader2 className="animate-spin" /> : <Download />}
        </Button>
        <div className="flex-1">
          <p className="text-sm font-medium">
            {trimFilename(data.document_message_info.file_name)}
          </p>
          <p className="truncate text-xs opacity-80">
            {formatFileSize(data.document_message_info.file_length)}
          </p>
        </div>
      </div>
      {data.document_message_info.caption && (
        <p className="px-2 text-sm">{data.document_message_info.caption}</p>
      )}
    </div>
  );
}
