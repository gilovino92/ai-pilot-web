import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod";

export const Route = createFileRoute(
  "/_main/_app/companies/$companyId/_layout/conversations/_layout/$network",
)({
  params: {
    parse: z.object({
      network: z.enum(["whatsapp"]),
    }).parse,
  },
});
