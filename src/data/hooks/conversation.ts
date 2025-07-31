/* eslint-disable perfectionist/sort-objects */

import { useInfiniteQuery } from "@tanstack/react-query";

import {
  getWhatsAppConversation,
  getWhatsAppConversations,
} from "../conversation.whatsapp";

export function useInfiniteWhatsAppConversation(id: string) {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) => getWhatsAppConversation(id, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.meta.page * lastPage.meta.limit < lastPage.meta.total
        ? lastPage.meta.page + 1
        : undefined,
    getPreviousPageParam: (_firstPage, _pages, firstPageParam) =>
      firstPageParam > 1 ? firstPageParam - 1 : undefined,
    initialPageParam: 1,
    queryKey: ["whatsappConversationInf", id],
    select: (data) => ({
      pages: data.pages.toReversed().flatMap((page) => page.messages),
      pageParams: data.pageParams.toReversed(),
    }),
  });
}

export function useInfiniteWhatsAppConversations() {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) => getWhatsAppConversations(pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.meta.page * lastPage.meta.limit < lastPage.meta.total
        ? lastPage.meta.page + 1
        : undefined,
    getPreviousPageParam: (_firstPage, _pages, firstPageParam) =>
      firstPageParam > 1 ? firstPageParam - 1 : undefined,
    initialPageParam: 1,
    queryKey: ["whatsappConversationsInf"],
    select: (data) => ({
      data: data.pages
        .flatMap((page) => page.data)
        .filter(
          (conversation) =>
            conversation.type === "personal" || conversation.type === "group",
        ),
      pageParams: data.pageParams,
    }),
  });
}
