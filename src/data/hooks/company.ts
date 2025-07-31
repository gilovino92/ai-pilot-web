/* eslint-disable perfectionist/sort-objects */

import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

import type { ChatEvent, ChatStreamOptions, MessageEvent } from "../types.dify";

import { getCustomers } from "../customer";
import { fetchEventSource, researchCompany } from "../dify";

export function useCompanyResearch(
  options: { cacheKey: string } & ChatStreamOptions,
) {
  const [cachedAnswer, setCachedAnswer] = useLocalStorage(options.cacheKey, "");
  const [currentAnswer, setCurrentAnswer] = useState<string>("");

  const handleEvent = useCallback(
    (event: ChatEvent) => {
      switch (event.event) {
        case "message": {
          const messageEvent = event as MessageEvent;

          setCurrentAnswer((prev) => {
            if (!prev) {
              options.onMessageStart?.();
            }

            return prev + messageEvent.answer;
          });

          break;
        }
        case "message_end": {
          setCurrentAnswer((prev) => {
            options.onMessageComplete?.(prev);
            setCachedAnswer(prev);

            return "";
          });

          break;
        }
        default: {
          break;
        }
      }
    },
    [options, setCachedAnswer],
  );

  const mutation = useMutation({
    mutationFn: async (body: {
      companyName: string;
      conversationId?: string;
    }) => {
      return new Promise<void>((resolve, reject) => {
        fetchEventSource(
          () => researchCompany(body),
          handleEvent,
          (error) => {
            options.onError?.(error);
            reject(error);
          },
          () => {
            resolve();
          },
        );
      });
    },
  });

  return {
    cachedAnswer,
    currentAnswer,
    ...mutation,
  };
}

export function useInfiniteCustomers() {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) => getCustomers(pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.meta.page * lastPage.meta.limit < lastPage.meta.total
        ? lastPage.meta.page + 1
        : undefined,
    getPreviousPageParam: (_firstPage, _pages, firstPageParam) =>
      firstPageParam > 1 ? firstPageParam - 1 : undefined,
    initialPageParam: 1,
    queryKey: ["customersInf"],
    select: (data) => ({
      data: data.pages.flatMap((page) => page.data),
      pageParams: data.pageParams,
    }),
  });
}
