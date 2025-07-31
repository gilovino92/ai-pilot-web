import { format } from "date-fns";
import { Clock } from "lucide-react";

import type { ChatbotConversation } from "@/data/chatbot";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CopilotRecentChats({
  chatbotConversations,
  disabled,
  emitSetChatId,
}: {
  chatbotConversations: ChatbotConversation[];
  disabled: boolean;
  emitSetChatId: (chatId: string) => void;
}) {
  return (
    <Card className="h-full gap-4 py-0">
      <CardHeader className="bg-background rounded-t-xl pt-4">
        <CardTitle>History Chat</CardTitle>
        <CardDescription>Your previous conversations</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[calc(100%-74px)] space-y-3 overflow-y-auto pb-6">
        {chatbotConversations.map((conversation) => (
          <div
            className={`flex items-start gap-3 rounded-md border p-3 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
            key={conversation.id}
            onClick={() => (disabled ? null : emitSetChatId(conversation.id))}
          >
            <Clock className="text-muted-foreground mt-0.5" size={16} />
            <div className="space-y-1">
              <div className="max-w-[200px] truncate overflow-hidden text-sm font-medium">
                {conversation.title || "New Chat"}
              </div>
              <div className="text-muted-foreground text-xs">
                {format(conversation.created_at, "MMM d, yyyy h:mm a")}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
