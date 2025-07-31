export type WithOptimistic<T> = {
  optimisticState?: "error" | "pending";
} & Partial<T>;
