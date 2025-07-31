import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, MessageSquarePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useDebounceValue } from "usehooks-ts";

import type { Network } from "@/data/types";

import { ScrollArea } from "@/components/cui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAppForm } from "@/config/form";
import {
  customerConversationQueryOptions,
  linkCustomerConversation,
} from "@/data/conversation";
import { whatsappSearchConversationsQueryOptions } from "@/data/conversation.whatsapp";
import { useInfiniteWhatsAppConversations } from "@/data/hooks/conversation";

import ConversationWhatsApp from "./ConversationWhatsApp";

type LinkConversationProps = {
  customerId: string;
};

export default function LinkConversation({
  customerId,
}: LinkConversationProps) {
  const [open, setOpen] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useDebounceValue("", 500);
  const [inViewRef, isInView] = useInView();
  const queryClient = useQueryClient();
  const { data: whatsappCustomerConversations } = useQuery({
    ...customerConversationQueryOptions(customerId, "whatsapp"),
    select: (data) =>
      data.map(
        (c) =>
          ({
            conversationId: c.id,
            network: "whatsapp",
          }) as const,
      ),
  });
  const { data, fetchNextPage, hasNextPage, isFetching } =
    useInfiniteWhatsAppConversations();
  const { mutateAsync } = useMutation({
    mutationFn: async (body: { conversationId: string; network: Network }[]) =>
      linkCustomerConversation(customerId, body),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["customerConversations"],
      }),
    onSuccess: (_, vars) => {
      window.gtag("event", "link_conversation", {
        conversation_id: vars[0].conversationId,
        customer_id: customerId,
      });
    },
  });
  const { data: searchResult, isLoading } = useQuery(
    whatsappSearchConversationsQueryOptions(query),
  );

  const form = useAppForm({
    defaultValues: {
      conversations: whatsappCustomerConversations,
    },
    onSubmit: async ({ value }) => {
      if (!value.conversations) {
        return;
      }

      await mutateAsync(value.conversations);

      form.reset();
      setOpen(false);
    },
  });

  useEffect(() => {
    if (isInView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetching, isInView]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MessageSquarePlus />
          Link Conversation
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link Conversation</DialogTitle>
          <DialogDescription>
            Select conversations to link to the customer
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid gap-4 py-4">
            <Input
              defaultValue=""
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              placeholder="Search"
            />
            {isLoading && (
              <div className="flex items-center justify-center">
                <Loader2 className="text-muted-foreground animate-spin" />
              </div>
            )}
            <ScrollArea className="h-96" viewport={{ ref: viewportRef }}>
              <form.AppField name="conversations">
                {(f) => (
                  <f.MultiSelectItemField
                    getScrollElement={() => viewportRef.current}
                    isSelected={(v) => (s) =>
                      s.some((c) => c.conversationId === v.conversationId)
                    }
                    items={
                      searchResult
                        ? searchResult.map((s) => ({
                            conversationId: s.conversation.id,
                            network: "whatsapp",
                          }))
                        : (data?.data ?? []).map((c) => ({
                            conversationId: c.id,
                            network: "whatsapp",
                          }))
                    }
                    removeItem={(v) => (s) =>
                      s.filter((c) => c.conversationId !== v.conversationId)
                    }
                    renderItem={({ handleChange, selected, value }) => (
                      <div
                        className="group"
                        data-status={selected ? "active" : "inactive"}
                        key={value.conversationId}
                        onClick={() => {
                          handleChange(!selected);
                        }}
                      >
                        <ConversationWhatsApp
                          data={{
                            id: value.conversationId,
                            type: "personal",
                            unread_count: 0,
                          }}
                        />
                      </div>
                    )}
                  />
                )}
              </form.AppField>
              {!query && <div ref={inViewRef} />}
            </ScrollArea>
          </div>
          <DialogFooter>
            <form.AppForm>
              <form.Submit>Submit</form.Submit>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
