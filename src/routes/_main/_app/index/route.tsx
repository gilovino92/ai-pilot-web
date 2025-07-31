import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/_app/")({
  beforeLoad: async () => {
    return redirect({ to: "/conversations" });
  },
});
