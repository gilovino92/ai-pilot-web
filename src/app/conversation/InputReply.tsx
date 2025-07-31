import { X } from "lucide-react";

import type { ConversationMessage } from "@/data/types";

type InputReplyProps = {
  data: ConversationMessage;
  onCancel: () => void;
};

export default function InputReply({ data, onCancel }: InputReplyProps) {
  return (
    <div className="bg-background absolute right-0 bottom-12 flex w-1/2 flex-col gap-2 rounded-md p-2 shadow-md">
      <button className="absolute top-2 right-2" onClick={onCancel}>
        <X className="text-muted-foreground" size={16} />
      </button>
      <p className="text-muted-foreground text-xs">Replying to</p>
      <div className="border-primary border-l-2 pl-2">
        {data.message_type === "text" ? (
          <p className="text-sm">{data.conversation}</p>
        ) : (
          <p className="text-sm">
            <em>[Media/Document]</em>
          </p>
        )}
      </div>
    </div>
  );
}
