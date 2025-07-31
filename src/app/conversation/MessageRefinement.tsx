import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

import { getRefinementMessage } from "@/data/ai-suggestion";

type MessageRefinementProps = {
  conversationId: string;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
};

export default function MessageRefinement({
  conversationId,
  inputRef,
}: MessageRefinementProps) {
  const [isRefining, setIsRefining] = useState(false);

  const refineMessage = async () => {
    if (!inputRef?.current) return;

    setIsRefining(true);

    window.gtag("event", "conversation_enhance_message_requested", {
      conversation_id: conversationId,
      message_length: inputRef.current.value.length,
    });

    const refinedMessage = await getRefinementMessage({
      conversationId: conversationId,
      message: inputRef.current.value,
      network: "whatsapp",
    });

    inputRef.current.value = refinedMessage;

    setIsRefining(false);
  };

  return (
    <div className="flex animate-[sparkle_1.5s_ease-in-out_infinite] cursor-pointer items-center justify-center">
      {isRefining ? (
        <div className="flex items-center gap-1">
          <Loader2 className="text-primary animate-spin" size={16} />
          <span className="text-primary text-xs font-bold">Enhancing...</span>
        </div>
      ) : (
        <button
          className="hover:bg-primary/10 flex cursor-pointer items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] opacity-80 transition-all hover:opacity-100"
          onClick={refineMessage}
        >
          <Sparkles className="text-primary" size={12} />
          <span className="text-primary text-xs font-bold">
            Enhance Response
          </span>
        </button>
      )}
    </div>
  );
}
