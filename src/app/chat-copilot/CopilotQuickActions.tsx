import { Building, Calendar, CheckCircle2, Search, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CopilotQuickActionsProps = {
  disabled: boolean;
  setInputValue: (value: string) => void;
};

export function CopilotQuickActions({
  disabled,
  setInputValue,
}: CopilotQuickActionsProps) {
  const prmopts = {
    research_lead_prompt: {
      label: "Research a lead",
      value: "Research Company X and provide key insights.",
    },
    update_company_prompt: {
      label: "Update company information",
      value: "Update the address of Company X to S St, Town B, Country C.",
    },
  };
  return (
    <Card className="max-h-full gap-4 py-0">
      <CardHeader className="bg-background rounded-t-xl pt-4">
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks you can request</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[calc(100%-74px)] space-y-3 overflow-y-auto pb-6">
        <Button
          className="w-full cursor-pointer justify-start"
          disabled={disabled}
          onClick={() => {
            setInputValue(prmopts.update_company_prompt.value);
          }}
          variant="outline"
        >
          <Users className="mr-2" size={16} />
          {prmopts.update_company_prompt.label}
        </Button>
        <Button
          className="w-full cursor-pointer justify-start"
          disabled={disabled}
          onClick={() => {
            setInputValue(prmopts.research_lead_prompt.value);
          }}
          variant="outline"
        >
          <Building className="mr-2" size={16} />
          {prmopts.research_lead_prompt.label}
        </Button>
        <Button
          className="w-full cursor-pointer justify-start"
          disabled={true}
          onClick={() => {
            setInputValue(
              "Schedule a meeting with Robert from Global AgriTrade for tomorrow at 2pm",
            );
          }}
          variant="outline"
        >
          <Calendar className="mr-2" size={16} />
          Schedule a meeting
        </Button>
        <Button
          className="w-full cursor-pointer justify-start"
          disabled={true}
          onClick={() => {
            setInputValue(
              "Create a new task to follow up with FarmFresh Exports next week",
            );
          }}
          variant="outline"
        >
          <CheckCircle2 className="mr-2" size={16} />
          Manage tasks
        </Button>
        <Button
          className="w-full cursor-pointer justify-start"
          disabled={true}
          onClick={() => {
            setInputValue(
              "Find potential leads in the organic produce export market",
            );
          }}
          variant="outline"
        >
          <Search className="mr-2" size={16} />
          Find a lead
        </Button>
      </CardContent>
    </Card>
  );
}
