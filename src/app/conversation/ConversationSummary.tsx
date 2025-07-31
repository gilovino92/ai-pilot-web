import { format } from "date-fns";
import { ChevronDown, ChevronUp, RefreshCw, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";

import type { ConversationSummary } from "@/data/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  createLatestConversationSummary,
  getConversationSummary,
} from "@/data/conversation";


type ConversationSummaryProps = {
  conversationId: string;
};

export function ConversationSummary({
  conversationId,
}: ConversationSummaryProps) {
  const [conversationSummary, setConversationSummary] =
    useState<ConversationSummary | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // TODO: modify this function with handleShowSummary
  useEffect(() => {
    const init = async () => {
      if (!showSummary) {
        return;
      }

      window.gtag("event", "conversation_summary", {
        conversation_id: conversationId,
      });

      const conversationSummary = await getConversationSummary(conversationId);

      setConversationSummary(conversationSummary);
    };

    init();
  }, [conversationId, showSummary]);

  const handleRegenerateSummary = async () => {
    window.gtag("event", "conversation_summary_regenerated", {
      conversation_id: conversationId,
    });

    setIsGeneratingSummary(true);
    const conversationSummary =
      await createLatestConversationSummary(conversationId);
    setConversationSummary(conversationSummary);
    setIsGeneratingSummary(false);
  };

  const handleShowSummary = async (show: boolean) => {
    setShowSummary(show);
  };

  return (
    <>
      <div className="bg-primary/10 mb-2 flex w-full items-center justify-between rounded-md p-3">
        <div
          className="flex w-full cursor-pointer items-center justify-between gap-2"
          onClick={() => handleShowSummary(!showSummary)}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary" size={16} />
            <h4 className="text-sm font-medium">Conversation Summary</h4>
          </div>
          {showSummary ? (
            <ChevronUp className="ml-1" size={16} />
          ) : (
            <ChevronDown className="ml-1" size={16} />
          )}
        </div>
      </div>

      {showSummary && conversationSummary && (
        <div className="animate-in fade-in slide-in-from-top-2 mb-4 duration-200">
          <div className="bg-primary/10 border-primary/20 rounded-md border p-4">
            <div className="mb-3 flex flex-col justify-between sm:flex-row sm:items-center">
              <div className="mb-2 flex items-center gap-2 sm:mb-0">
                <Badge className="text-xs" variant="outline">
                  Last updated:{" "}
                  {format(
                    new Date(conversationSummary?.updated_at),
                    "h:mma MM/dd/yyyy",
                  )}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  className="h-8 cursor-pointer text-xs"
                  disabled={isGeneratingSummary}
                  onClick={handleRegenerateSummary}
                  size="sm"
                  variant="ghost"
                >
                  {isGeneratingSummary ? (
                    <>
                      <RefreshCw className="mr-2 animate-spin" size={16} />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2" size={16} />
                      Regenerate
                    </>
                  )}
                </Button>
                <Button
                  className="size-8 cursor-pointer p-0"
                  onClick={() => handleShowSummary(false)}
                  size="sm"
                  variant="ghost"
                >
                  <X className="size-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </div>
            <hr className="border-primary/20 my-4 border" />
            <div className="custom-scrollbar markdown-body max-h-[50vh] overflow-y-auto">
              <Markdown>{conversationSummary?.summary?.trim()}</Markdown>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
