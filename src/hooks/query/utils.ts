import type {
  QueryFunction,
  QueryFunctionContext,
  QueryKey,
} from "@tanstack/react-query";

import { get, set } from "idb-keyval";

export function createCachedQueryFn<
  TQueryFnData = unknown,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  cacheKey: string,
  cacheTime: number,
) {
  return async (
    context: QueryFunctionContext<TQueryKey>,
  ): Promise<TQueryFnData> => {
    type CachedData = {
      data: TQueryFnData;
      timestamp: number;
    };

    const cachedResult = await get<CachedData>(cacheKey);

    if (cachedResult) {
      const isExpired =
        cacheTime === Infinity
          ? false
          : Date.now() - cachedResult.timestamp > cacheTime;

      if (!isExpired) {
        return cachedResult.data;
      }
    }

    const freshData = await queryFn(context);

    await set(cacheKey, {
      data: freshData,
      timestamp: Date.now(),
    });

    return freshData;
  };
}
