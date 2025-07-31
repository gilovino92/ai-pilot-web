import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { CopilotConversation } from "@/app/chat-copilot/CopilotConversation";
import {
  chatbotConversationQueryOption,
  createChatbotConversation,
} from "@/data/chatbot";

import "@/custom.css";

export const Route = createLazyFileRoute("/_main/_app/chat")({
  component: RouteComponent,
});

function RouteComponent() {
  const [currentChatId, setCurrentChatId] = useState<null | string>(null);
  const { data: chatbotConversations, refetch } = useSuspenseQuery(
    chatbotConversationQueryOption(),
  );

  const createNewChat = async () => {
    const data = await createChatbotConversation();
    await refetch();
    setCurrentChatId(data.id);
  };

  useEffect(
    () => {
      const init = async () => {
        let cid = "";

        if (chatbotConversations && chatbotConversations.length > 0) {
          cid = chatbotConversations[0].id;
          setCurrentChatId(chatbotConversations[0].id);
        } else {
          const newChat = await createChatbotConversation();

          if (newChat) {
            cid = newChat.id;
            setCurrentChatId(newChat.id);
            await refetch();
          }
        }
        window.gtag("event", "agent_conversation_view", {
          conversation_id: cid,
        });
      };
      init();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <>
      {currentChatId && (
        <CopilotConversation
          chatbotConversations={chatbotConversations}
          chatId={currentChatId}
          createNewChat={createNewChat}
          setChatId={setCurrentChatId}
        />
      )}
    </>
  );
}
