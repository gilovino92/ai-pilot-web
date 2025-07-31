import type {
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import { skipToken, useQuery } from "@tanstack/react-query";

import { createCachedQueryFn } from "./utils";

export default function useDiskCachedQuery<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  cacheTime: number = 60 * 60 * 1000,
): UseQueryResult<TData, TError> {
  const cacheKey = `query:${JSON.stringify(options.queryKey)}`;

  let cachedQueryFn: typeof options.queryFn;

  if (options.queryFn === skipToken) {
    cachedQueryFn = skipToken;
  } else if (!options.queryFn) {
    cachedQueryFn = options.queryFn;
  } else {
    cachedQueryFn = createCachedQueryFn(options.queryFn, cacheKey, cacheTime);
  }

  return useQuery<TQueryFnData, TError, TData, TQueryKey>({
    ...options,
    queryFn: cachedQueryFn,
    staleTime: Infinity,
  });
}
