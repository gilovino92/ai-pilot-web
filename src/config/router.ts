import { createRouter } from "@tanstack/react-router";
import { lazy } from "react";

import queryClient from "./query";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
  context: {
    isAuthenticated: false,
    queryClient,
  },
  routeTree,
});

export const RouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : lazy(() =>
        import("@tanstack/react-router-devtools").then((r) => ({
          default: r.TanStackRouterDevtools,
        })),
      );

router.history.subscribe(({ location }) => {
  window.gtag("event", "page_view", {
    page_location: location.href,
  });
});

export default router;
