// When the keys are primitives or have reliable string representations, use fastDedupe

export function dedupe<T>(
  items: readonly T[],
  keyOrExtractor: ((item: T) => unknown) | keyof T,
): T[] {
  if (items.length <= 1) {
    return [...items];
  }

  const getKey =
    typeof keyOrExtractor === "function"
      ? keyOrExtractor
      : (item: T) => item[keyOrExtractor];

  const seen = new Map<unknown, T>();

  for (const item of items) {
    const key = getKey(item);
    if (!seen.has(key)) {
      seen.set(key, item);
    }
  }

  return Array.from(seen.values());
}

export function fastDedupe<T>(
  items: readonly T[],
  keyOrExtractor: ((item: T) => number | string) | keyof T,
): T[] {
  if (items.length <= 1) {
    return [...items];
  }

  const getKey =
    typeof keyOrExtractor === "function"
      ? keyOrExtractor
      : (item: T) => item[keyOrExtractor] as unknown as number | string;

  const seen = new Set<number | string>();

  return items.filter((item) => {
    const key = getKey(item);
    if (!seen.has(key)) {
      seen.add(key);
      return true;
    }
    return false;
  });
}
