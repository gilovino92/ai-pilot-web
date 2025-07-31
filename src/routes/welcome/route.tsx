import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/welcome")({
  beforeLoad: async ({ context }) => {
    if (context.isAuthenticated) {
      throw redirect({
        replace: true,
        to: "/",
      });
    }
  },
});
