import { QueryClient } from "@tanstack/react-query";
import { lazy } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const QueryDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : lazy(() =>
        import("@tanstack/react-query-devtools").then((r) => ({
          default: r.ReactQueryDevtools,
        })),
      );

export default queryClient;
