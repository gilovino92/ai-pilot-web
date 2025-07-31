import { createFileRoute } from "@tanstack/react-router";

import { chatbotConversationQueryOption } from "@/data/chatbot";
export const Route = createFileRoute("/_main/_app/chat")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(chatbotConversationQueryOption()),

      new Promise((resolve) =>
        setTimeout(() => {
          resolve(true);
        }, 1000),
      ),
    ]);
  },
});
