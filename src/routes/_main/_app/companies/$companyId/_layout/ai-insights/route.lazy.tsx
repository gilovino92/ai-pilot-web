import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { customerQueryOptions } from "@/data/customer";
import { useCompanyResearch } from "@/data/hooks/company";

export const Route = createLazyFileRoute(
  "/_main/_app/companies/$companyId/_layout/ai-insights",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { companyId } = Route.useParams();

  const [workflowStatus, setWorkflowStatus] = useState<string>("");

  const { data: customer } = useSuspenseQuery(customerQueryOptions(companyId));
  const { cachedAnswer, currentAnswer, isPending, mutate } = useCompanyResearch(
    {
      cacheKey: `ai-insights-${companyId}`,
      onMessageComplete: () => {
        setWorkflowStatus("Completed");
      },
      onMessageStart: () => {
        setWorkflowStatus("Processing");
      },
      onWorkflowEnd: () => {
        setWorkflowStatus("Completed");
      },
      onWorkflowStart: () => {
        setWorkflowStatus("Started");
      },
    },
  );

  return (
    <div className="min-h-0 flex-1">
      <ScrollArea className="h-full">
        <div className="flex items-center gap-2">
          <Button
            disabled={isPending}
            onClick={() => {
              if (!customer.website && !customer.company_name) {
                toast.error("Customer website or company name is required");

                return;
              }

              mutate({
                companyName: customer.website ?? customer.company_name,
              });

              window.gtag("event", "company_get_ai_insights", {
                customer_id: companyId,
              });
            }}
          >
            <Sparkles />
            Get AI Insights
          </Button>
          <p className="text-muted-foreground text-sm">{workflowStatus}</p>
        </div>
        <Separator className="my-4" />
        <div className="prose">
          <Markdown>
            {currentAnswer
              ? currentAnswer.replace(/\d\/Noneth search executed\.\n?/g, "")
              : cachedAnswer.replace(/\d\/Noneth search executed\.\n?/g, "")}
          </Markdown>
        </div>
      </ScrollArea>
    </div>
  );
}
