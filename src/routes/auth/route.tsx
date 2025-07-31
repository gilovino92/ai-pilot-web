import { createFileRoute, redirect } from "@tanstack/react-router";
import * as z from "zod";

export const Route = createFileRoute("/auth")({
  beforeLoad: async ({ context, search }) => {
    if (context.isAuthenticated) {
      throw redirect({
        replace: true,
        to: search.redirect ?? "/",
      });
    }
  },
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
});
