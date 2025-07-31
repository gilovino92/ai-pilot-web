import type { KyResponse } from "ky";

import ky from "ky";

import type { ChatEvent } from "./types.dify";

function companyResearchQuery(companyName: string) {
  return `Provide comprehensive details about ${companyName} including its services, history, locations, and any other relevant information`;
}

const dfCompanyResearch = ky.create({
  hooks: {
    beforeRequest: [
      async (request) => {
        request.headers.set(
          "Authorization",
          `Bearer app-hqwAwOoM6GEMhoeGhqEAyh8g`,
        );
        request.headers.set("Accept", "text/event-stream");
      },
    ],
  },
  prefixUrl: import.meta.env.VITE_DIFY_API_BASE_URL,
  timeout: false,
});

export async function researchCompany({
  companyName,
  conversationId,
}: {
  companyName: string;
  conversationId?: string;
}) {
  return dfCompanyResearch("chat-messages", {
    json: {
      conversation_id: conversationId,
      inputs: {
        depth: 3,
      },
      query: companyResearchQuery(companyName),
      response_mode: "streaming",
      user: "x-pilot-web",
    },
    method: "POST",
  });
}

export const fetchEventSource = async <T>(
  fetchFn: () => Promise<KyResponse<T>>,
  onEvent: (event: ChatEvent) => void,
  onError: (error: Error) => void,
  onComplete: () => void,
): Promise<void> => {
  try {
    const response = await fetchFn();

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        onComplete();
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      // Process complete lines in the buffer
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Keep the last incomplete line in the buffer

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith("data: ")) {
          try {
            const jsonStr = trimmedLine.substring(6); // Remove 'data: ' prefix
            const event = JSON.parse(jsonStr) as ChatEvent;
            onEvent(event);
          } catch (e) {
            console.error("Error parsing event:", e);
          }
        }
      }
    }
  } catch (error) {
    onError(error instanceof Error ? error : new Error(String(error)));
  }
};
