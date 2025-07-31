import { Bot, Globe, Search, Send, User } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Markdown from "react-markdown";

import type {
  ChatbotConversation,
  ChatbotMessage,
  ChatbotUserInputContent,
  UserInputOption,
} from "@/data/chatbot";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getChatHistory, sendMessage, streamMessage } from "@/data/chatbot";

import { CopilotQuickActions } from "./CopilotQuickActions";
import { CopilotRecentChats } from "./CopilotRecentChats";

export function CopilotConversation({
  chatbotConversations,
  chatId,
  createNewChat,
  setChatId,
}: {
  chatbotConversations: ChatbotConversation[];
  chatId: string;
  createNewChat: () => void;
  setChatId: (chatId: string) => void;
}) {
  const [history, setHistory] = useState<ChatbotMessage[]>([]);
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [agentAction, setAgentAction] = useState<string>("");
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const handleSendMessage = async (inputValue: string) => {
    if (!inputValue.trim() || isAgentTyping) return;

    let nextMessageType = "USER_QUERY";

    const latestAgentMessage = messages.findLast(
      (msg) => msg.role === "assistant",
    );
    if (latestAgentMessage?.type === "INPUT_REQUIRED") {
      nextMessageType = "USER_RESPONSE";
    }

    const payload = {
      chat_id: chatId,
      message: inputValue,
      type: nextMessageType,
    };

    await sendMessage(payload);

    setInputValue("");
    // Simulate agent typing
    setIsAgentTyping(true);

    window.gtag("event", "agent_message_sent", {
      conversation_id: chatId,
      message_length: inputValue.length,
      message_type: "text",
    });
  };
  const eventSource = useRef<EventSource | null>(null);

  const mappedMessages = useMemo(() => {
    return messages;
  }, [messages]);

  const onInputChange = (inputValue: string) => {
    setInputValue(inputValue);
  };

  const fetchChatHistory = useCallback(
    async (currentPage: number) => {
      const { data } = await getChatHistory(chatId, currentPage);
      if (!data) return [];

      const newHistory = data.reverse().map((message, index) => {
        if (message.type === "INPUT_REQUIRED") {
          const content = JSON.parse(
            message.content as string,
          ) as ChatbotUserInputContent;
          if (content.inputType === "select") {
            const selectedValue = data[index + 1]?.content || "";
            content.options = content.options.map(
              (option: { label: string; value: string }) => ({
                label: option.label,
                selected: option.label === selectedValue,
                value: option.value,
              }),
            );
          }
          return {
            ...message,
            content: content,
          };
        }
        return message;
      });

      setHistory((prev) => {
        return [...newHistory, ...prev];
      });

      const timeout = setTimeout(() => {
        if (chatRef.current) {
          if (currentPage === 1) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
          }
        }

        clearTimeout(timeout);
      }, 100);
    },
    [chatId],
  );

  // Handle stream message
  useEffect(
    () => {
      const init = async () => {
        setCurrentPage(1);
        setHistory([]);
        setMessages([]);
        await fetchChatHistory(currentPage);
        if (eventSource.current) {
          eventSource.current.close();
        }
        eventSource.current = await streamMessage(chatId);
        eventSource.current?.addEventListener("message", (event) => {
          const message: ChatbotMessage = JSON.parse(event.data);
          const { agent_action, content, created_at, id, role, type } = message;

          window.gtag("event", "agent_message_received", {
            conversation_id: chatId,
            message_type: "text",
          });

          if (role === "assistant") {
            switch (type) {
              case "ALLOW_USER_INPUT": {
                setIsAgentTyping(false);
                setAgentAction("");
                break;
              }
              case "INPUT_REQUIRED": {
                setMessages((prev) => [
                  ...prev,
                  {
                    content: JSON.parse(
                      content as string,
                    ) as ChatbotUserInputContent,
                    created_at,
                    id,
                    role,
                    type,
                  } as ChatbotMessage,
                ]);
                break;
              }
              case "START_STREAM": {
                setIsAgentTyping(true);
                break;
              }
              case "STREAM": {
                if (agent_action) {
                  setAgentAction(agent_action);
                }
                if (content) {
                  setMessages((prev) => {
                    const lastMessageIndex = prev.findIndex(
                      (msg) => msg.id === id,
                    );
                    if (lastMessageIndex !== -1) {
                      const prevContent = prev[lastMessageIndex]
                        .content as string;
                      prev[lastMessageIndex].content = prevContent + content;
                      prev[lastMessageIndex].type = "STREAM";
                      return [...prev];
                    }
                    return [
                      ...prev,
                      {
                        content,
                        created_at,
                        id,
                        role,
                        type,
                      } as ChatbotMessage,
                    ];
                  });
                }

                break;
              }
              case "THINKING": {
                setMessages((prev) => [
                  ...prev,
                  {
                    content,
                    created_at,
                    id,
                    role,
                    type,
                  } as ChatbotMessage,
                ]);
                break;
              }
              case "AGENT_RESPONSE":
              case "USER_QUERY":
              case "USER_RESPONSE":
              default: {
                setMessages((prev) => [
                  ...prev,
                  {
                    content,
                    created_at,
                    id,
                    role,
                    type,
                  } as ChatbotMessage,
                ]);
                break;
              }
            }
          } else {
            setMessages((prev) => [
              ...prev,
              {
                content,
                created_at,
                id,
                role,
                type,
              } as ChatbotMessage,
            ]);
          }
          const timeout = setTimeout(() => {
            clearTimeout(timeout);
            if (chatRef.current) {
              chatRef.current.scrollTo({
                behavior: "smooth",
                top: chatRef.current.scrollHeight,
              });
            }
          }, 100);
        });
      };

      init();

      return () => {
        if (eventSource.current) {
          eventSource.current.close();
        }
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chatId],
  );

  // Handle chat container scroll
  const handleChatContainerScroll = () => {
    if (!chatRef.current) return;
    // const { scrollHeight, scrollTop } = chatRef.current;
  };

  return (
    <div className="grid h-full max-h-full grid-cols-1 gap-4 lg:grid-cols-12">
      <div className="col-span-1 max-h-full overflow-hidden lg:col-span-8">
        <Card className="flex h-full max-h-full flex-col gap-0 py-0 lg:col-span-2">
          <CardHeader className="bg-background rounded-t-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 rounded-full p-2">
                  <Bot className="text-primary size-5" />
                </div>
                <div className="space-y-1">
                  <CardTitle>X-Pilot Assistant</CardTitle>
                  <CardDescription>Your intelligent assistant</CardDescription>
                </div>
              </div>
              <Button
                onClick={() => {
                  createNewChat();
                }}
                size="sm"
                variant="outline"
              >
                New Chat
              </Button>
            </div>
          </CardHeader>
          <CardContent
            className="h-[calc(100%-142px)] overflow-y-auto pb-[120px]"
            onScroll={handleChatContainerScroll}
            ref={chatRef}
          >
            <div className="mb-4 flex-1 space-y-4 pr-2">
              {history.map((message, index) =>
                message.type === "INPUT_REQUIRED" ? (
                  <div
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    key={message.id}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="mb-1 flex items-center gap-2">
                        {message.role === "assistant" ? (
                          <Bot size={16} />
                        ) : (
                          <User size={16} />
                        )}
                        <span className="text-xs font-medium">
                          {message.role === "assistant"
                            ? "X-Pilot Assistant"
                            : "You"}
                        </span>
                      </div>
                      {message.content ? (
                        <>
                          <p className="text-sm whitespace-pre-line">
                            {(message.content as ChatbotUserInputContent).label}
                          </p>
                          {(message.content as ChatbotUserInputContent)
                            .inputType === "select" && (
                            <div className="mt-4">
                              {(
                                message.content as ChatbotUserInputContent
                              ).options.map((option: UserInputOption) => (
                                <div
                                  className={`border-input mb-2 w-full rounded-md border px-4 py-2 text-sm last:mb-0 ${
                                    option.selected
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-background text-muted-foreground"
                                  }`}
                                  key={option.value}
                                >
                                  {option.label}
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    id={`message-${index + 1}`}
                    key={message.id}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="mb-1 flex items-center gap-2">
                        {message.role === "assistant" ? (
                          <Bot size={16} />
                        ) : (
                          <User size={16} />
                        )}
                        <span className="text-xs font-medium">
                          {message.role === "assistant"
                            ? "X-Pilot Assistant"
                            : "You"}
                        </span>
                      </div>
                      {message.content ? (
                        <div className="markdown-body">
                          <Markdown>
                            {(message.content as string).trim()}
                          </Markdown>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ),
              )}
              {mappedMessages.map((message) =>
                message.type === "INPUT_REQUIRED" ? (
                  <div
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    key={message.id}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="mb-1 flex items-center gap-2">
                        {message.role === "assistant" ? (
                          <Bot size={16} />
                        ) : (
                          <User size={16} />
                        )}
                        <span className="text-xs font-medium">
                          {message.role === "assistant"
                            ? "X-Pilot Assistant"
                            : "You"}
                        </span>
                      </div>
                      {message.content ? (
                        <>
                          <p className="text-sm whitespace-pre-line">
                            {(message.content as ChatbotUserInputContent).label}
                          </p>
                          {(message.content as ChatbotUserInputContent)
                            .inputType === "select" && (
                            <div className="mt-4">
                              {(
                                message.content as ChatbotUserInputContent
                              ).options.map((option: UserInputOption) => (
                                <Button
                                  className="mb-2 w-full cursor-pointer last:mb-0"
                                  key={option.value}
                                  onClick={() => {
                                    handleSendMessage(option.label);
                                  }}
                                  variant="outline"
                                >
                                  {option.label}
                                </Button>
                              ))}
                            </div>
                          )}
                        </>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    key={message.id}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="mb-1 flex items-center gap-2">
                        {message.role === "assistant" ? (
                          <Bot size={16} />
                        ) : (
                          <User size={16} />
                        )}
                        <span className="text-xs font-medium">
                          {message.role === "assistant"
                            ? "X-Pilot Assistant"
                            : "You"}
                        </span>
                      </div>

                      {message.content ? (
                        <div className="markdown-body">
                          <Markdown>
                            {(message.content as string).trim()}
                          </Markdown>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ),
              )}
              {isAgentTyping && (
                <div className={`flex items-center justify-start`}>
                  {agentAction === "SEARCHING_WEB" && (
                    <div className="bg-muted flex items-center gap-1 rounded-full p-3">
                      <Globe size={16} />
                      <span className="text-xs font-medium italic">
                        Searching
                      </span>
                      <div className="dot-loader"></div>
                    </div>
                  )}
                  {(!agentAction ||
                    agentAction === "ANSWERING" ||
                    agentAction === "THINKING") && (
                    <div className="bg-muted flex items-center gap-1 rounded-full p-3">
                      {/* <ProcessingTriangle color="#3b82f6" size={16} /> */}
                      <span className="text-xs font-medium italic">
                        {agentAction === "ANSWERING"
                          ? "Answering"
                          : "Thinking"}
                      </span>
                      <div className="dot-loader"></div>
                    </div>
                  )}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter className="bg-background w-full rounded-b-xl py-4">
            <div className="flex w-full items-center gap-2">
              <Input
                disabled={isAgentTyping}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && !isAgentTyping) {
                    await handleSendMessage(inputValue);
                  }
                }}
                placeholder="Ask me anything..."
                value={inputValue}
              />
              <Button
                disabled={isAgentTyping}
                onClick={async () => await handleSendMessage(inputValue)}
              >
                <Send size={16} />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="col-span-1 grid max-h-full grid-rows-2 gap-4 space-y-4 overflow-hidden lg:col-span-4">
        <div className="h-full">
          <CopilotRecentChats
            chatbotConversations={chatbotConversations}
            disabled={isAgentTyping}
            emitSetChatId={setChatId}
          />
        </div>
        <div className="h-full">
          <CopilotQuickActions
            disabled={isAgentTyping}
            setInputValue={onInputChange}
          />
        </div>
      </div>
    </div>
  );
}
