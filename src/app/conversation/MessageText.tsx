import { useSuspenseQuery } from "@tanstack/react-query";
import { Bot, Loader2, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import type { ConversationMessage, MessageTranslation } from "@/data/types";

import { Button } from "@/components/ui/button";
import { getConversationSuggestion } from "@/data/ai-suggestion";
import { meQueryOptions } from "@/data/contact";
import { getMessageTranslation } from "@/data/conversation";

type MessageTextProps = {
  data: ConversationMessage;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
  isMe: boolean;
  showTranslation: boolean;
};

export default function MessageText({
  data,
  inputRef,
  isMe,
  showTranslation = false,
}: MessageTextProps) {
  const { data: me } = useSuspenseQuery(meQueryOptions());
  const [isTranslating, setIsTranslating] = useState(false);
  const [translations, setTranslations] = useState<MessageTranslation[]>([]);
  const [translation, setTranslation] = useState<string>("");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestedResponse, setSuggestedResponse] = useState<string>("");
  const [showSuggestedResponse, setShowSuggestedResponse] = useState(false);

  useEffect(() => {
    if (data.translations) {
      setTranslations(data.translations);
    }
  }, [data.translations]);

  const handleShowTranslation = useCallback(async () => {
    const translation = translations.find(
      (translation) => translation.language === me.translation_language,
    );
    if (translation) {
      setTranslation(translation.content);
    } else {
      setIsTranslating(true);
      const response = await getMessageTranslation(
        data,
        me.translation_language,
      );
      if (response) {
        setTranslations([...translations, response]);
        setTranslation(response.content);
        setIsTranslating(false);
      }
    }
  }, [data, me.translation_language, translations]);

  useEffect(() => {
    if (showTranslation) {
      handleShowTranslation();
    } else {
      setTranslation("");
    }
  }, [showTranslation, handleShowTranslation]);

  if (data.message_type !== "text") {
    return null;
  }

  const handleSuggestAnswer = async () => {
    setIsSuggesting(true);
    const response = await getConversationSuggestion({
      conversationId: data.chat_id,
      network: "whatsapp",
      userMessage: data.conversation,
    });
    setSuggestedResponse(response);
    setShowSuggestedResponse(true);
    setIsSuggesting(false);
  };

  const closeSuggestedResponse = () => {
    setShowSuggestedResponse(false);
    setIsSuggesting(false);
    setSuggestedResponse("");
  };

  const useSuggestedResponse = () => {
    if (inputRef?.current) {
      inputRef.current.value = suggestedResponse;
      inputRef.current.focus();
    }
  };

  return (
    <div className="max-w-full min-w-24">
      {showTranslation ? (
        isTranslating ? (
          <div className="flex items-center gap-2 px-2 text-sm">
            <Loader2 className="animate-spin" size={16} /> Translating...
          </div>
        ) : (
          <div className="px-2 text-sm break-words whitespace-pre-wrap">
            {translation}
            <div className="text-muted-foreground mt-1 text-right text-xs italic">
              Translated
            </div>
          </div>
        )
      ) : (
        <p className="px-2 text-sm break-words whitespace-pre-wrap">
          {data.conversation}
        </p>
      )}
      {!isMe && (
        <>
          <div className="mt-1 flex items-center justify-end px-2">
            {isSuggesting && !showSuggestedResponse && (
              <Sparkles className="text-primary animate-pulse" size={12} />
            )}
            {!isSuggesting && !showSuggestedResponse && (
              <button
                className="hover:bg-primary/10 flex cursor-pointer items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] opacity-80 transition-all hover:opacity-100"
                onClick={handleSuggestAnswer}
              >
                <Sparkles className="text-primary" size={12} />
                <span className="text-primary text-xs font-medium">
                  Suggest Answer
                </span>
              </button>
            )}
          </div>
          {!isSuggesting && suggestedResponse && showSuggestedResponse && (
            <div className="animate-in fade-in slide-in-from-top-2 mt-2 duration-200">
              <div className="border-primary/20 bg-primary/5 hover:bg-primary/10 flex cursor-pointer flex-col gap-2 rounded-md border p-3 transition-all hover:shadow-sm">
                <div className="flex items-center gap-2">
                  <Bot className="text-primary" size={12} />
                  <span className="text-primary text-xs font-medium">
                    AI Suggested Response
                  </span>
                  <button
                    className="hover:bg-primary/20 ml-auto cursor-pointer rounded-full p-1"
                    onClick={() => closeSuggestedResponse()}
                  >
                    <X size={12} />
                  </button>
                </div>
                <p className="text-sm">{suggestedResponse}</p>
                <Button
                  className="bg-primary/10 hover:bg-primary/20 mt-1 h-7 cursor-pointer self-start px-2 text-xs"
                  onClick={useSuggestedResponse}
                  size="sm"
                  variant="ghost"
                >
                  Use This Response
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
