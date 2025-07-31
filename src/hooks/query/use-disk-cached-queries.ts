import type {
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import { skipToken, useQueries } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { createCachedQueryFn } from "./utils";

type QueryOptions<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = {
  queryKey: TQueryKey;
} & Omit<
  UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  "initialData"
>;

export default function useDiskCachedQueries<
  TQueryFnData,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queriesOptions: QueryOptions<TQueryFnData, TError, TData, TQueryKey>[],
  concurrencyLimit = 3,
  cacheTime: number = 60 * 60 * 1000, // 1 hour default cache time
): UseQueryResult<TData, TError>[] {
  // Track which queries are currently enabled
  const [enabledIndices, setEnabledIndices] = useState<Set<number>>(new Set());
  const queriesRef = useRef(queriesOptions);
  const isInitialMount = useRef(true);

  // Prepare query options with caching and concurrency control
  const preparedQueriesOptions = useMemo(() => {
    return queriesOptions.map((options, index) => {
      const cacheKey = `query:${JSON.stringify(options.queryKey)}`;

      let cachedQueryFn = options.queryFn;

      if (options.queryFn && options.queryFn !== skipToken) {
        cachedQueryFn = createCachedQueryFn(
          options.queryFn,
          cacheKey,
          cacheTime,
        );
      }

      return {
        ...options,
        cacheTime: cacheTime * 2, // Keep cached data in memory longer than disk cache
        enabled: enabledIndices.has(index),
        queryFn: cachedQueryFn,
        staleTime: Infinity,
      } as const;
    });
  }, [queriesOptions, enabledIndices, cacheTime]);

  // Execute the queries
  const results = useQueries({
    queries: preparedQueriesOptions,
  }) as UseQueryResult<TData, TError>[];

  // Update which queries should be enabled based on concurrency limit
  const updateEnabledIndices = useCallback(() => {
    let activeCount = 0;
    const completedIndices = new Set<number>();
    const pendingIndices: number[] = [];

    // Categorize queries as active, completed, or pending
    results.forEach((result, index) => {
      if (enabledIndices.has(index)) {
        if (result.isFetching) {
          activeCount++;
        } else if (result.isSuccess || result.isError) {
          completedIndices.add(index);
        }
      } else if (!result.isSuccess && !result.isError) {
        pendingIndices.push(index);
      }
    });

    // Update enabled indices based on completed queries and available slots
    if (activeCount < concurrencyLimit && pendingIndices.length > 0) {
      setEnabledIndices((prev) => {
        const newEnabled = new Set(prev);
        completedIndices.forEach((index) => newEnabled.delete(index));

        let availableSlots = concurrencyLimit - activeCount;
        for (let i = 0; i < pendingIndices.length && availableSlots > 0; i++) {
          newEnabled.add(pendingIndices[i]);
          availableSlots--;
        }

        return newEnabled;
      });
    } else if (completedIndices.size > 0) {
      setEnabledIndices((prev) => {
        const newEnabled = new Set(prev);
        completedIndices.forEach((index) => newEnabled.delete(index));
        return newEnabled;
      });
    }
  }, [results, enabledIndices, concurrencyLimit]);

  // Update enabled indices when results change
  useEffect(() => {
    if (!isInitialMount.current) {
      updateEnabledIndices();
    }
  }, [updateEnabledIndices]);

  // Initialize the first batch of queries
  useEffect(
    () => {
      if (isInitialMount.current && queriesOptions.length > 0) {
        const initialBatch = new Set<number>();
        const initialSize = Math.min(concurrencyLimit, queriesOptions.length);

        for (let i = 0; i < initialSize; i++) {
          initialBatch.add(i);
        }

        setEnabledIndices(initialBatch);
        isInitialMount.current = false;
      }

      queriesRef.current = queriesOptions;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [queriesOptions.length, concurrencyLimit],
  );

  return results;
}
