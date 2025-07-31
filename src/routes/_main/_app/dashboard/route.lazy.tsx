import { createLazyFileRoute } from "@tanstack/react-router";
import {
  CalendarClock,
  ChartColumn,
  MessagesSquare,
  Users2,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import Task from "@/app/task/Task";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ScrollArea } from "@/components/ui/scroll-area";

const chartData = [
  { count: 187, fill: "var(--chart-1)", state: "new" },
  { count: 200, fill: "var(--chart-2)", state: "qualified" },
  { count: 275, fill: "var(--chart-3)", state: "proposal" },
  { count: 173, fill: "var(--chart-4)", state: "negotiation" },
  { count: 90, fill: "var(--chart-5)", state: "closed" },
];

const chartConfig = {
  closed: {
    color: "var(--chart-5)",
    label: "Closed",
  },
  negotiation: {
    color: "var(--chart-4)",
    label: "Negotiation",
  },
  new: {
    color: "var(--chart-1)",
    label: "New",
  },
  proposal: {
    color: "var(--chart-3)",
    label: "Proposal",
  },
  qualified: {
    color: "var(--chart-2)",
    label: "Qualified",
  },
  state: {
    label: "States",
  },
} satisfies ChartConfig;

export const Route = createLazyFileRoute("/_main/_app/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ScrollArea className="h-full">
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Active Deals</p>
              <ChartColumn className="text-muted-foreground" size={16} />
            </div>
            <p className="text-2xl font-bold">123</p>
            <p className="text-muted-foreground text-xs">
              +123.45% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Pending Tasks</p>
              <CalendarClock className="text-muted-foreground" size={16} />
            </div>
            <p className="text-2xl font-bold">23</p>
            <p className="text-muted-foreground text-xs">5 due today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Customers</p>
              <Users2 className="text-muted-foreground" size={16} />
            </div>
            <p className="text-2xl font-bold">45</p>
            <p className="text-muted-foreground text-xs">+4 this quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Unread Messages</p>
              <MessagesSquare className="text-muted-foreground" size={16} />
            </div>
            <p className="text-2xl font-bold">12</p>
            <p className="text-muted-foreground text-xs">8 highest priority</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Sales Pipeline
              </CardTitle>
              <CardDescription>Your active deals by stage</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey="state"
                  tickFormatter={(value) =>
                    chartConfig[value as keyof typeof chartConfig]?.label
                  }
                  tickLine={false}
                  tickMargin={10}
                />
                <ChartTooltip
                  content={<ChartTooltipContent hideLabel />}
                  cursor={false}
                />
                <Bar dataKey="count" radius={8} strokeWidth={2} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Upcoming Tasks
              </CardTitle>
              <CardDescription>Tasks required your attention</CardDescription>
            </div>
            <Button variant="outline">View All</Button>
          </CardHeader>
          <CardContent className="space-y-2">
            <Task
              data={{
                conversation_id: "demo@conversation.com",
                created_at: new Date().getTime(),
                customer_id: 123,
                customer_name: "John Doe",
                description: "Provide a quote for the project",
                due_date: new Date().getTime(),
                id: "123",
                is_ai_generated: false,
                status: "New",
                updated_at: new Date().getTime(),
                user_id: "123",
              }}
            />
            <Task
              data={{
                conversation_id: "demo@conversation.com",
                created_at: new Date().getTime(),
                customer_id: 123,
                customer_name: "John Doe",
                description: "Provide a quote for the project",
                due_date: new Date().getTime(),
                id: "123",
                is_ai_generated: false,
                status: "New",
                updated_at: new Date().getTime(),
                user_id: "123",
              }}
            />
            <Task
              data={{
                conversation_id: "demo@conversation.com",
                created_at: new Date().getTime(),
                customer_id: 123,
                customer_name: "John Doe",
                description: "Provide a quote for the project",
                due_date: new Date().getTime(),
                id: "123",
                is_ai_generated: false,
                status: "New",
                updated_at: new Date().getTime(),
                user_id: "123",
              }}
            />
            <Task
              data={{
                conversation_id: "demo@conversation.com",
                created_at: new Date().getTime(),
                customer_id: 123,
                customer_name: "John Doe",
                description: "Provide a quote for the project",
                due_date: new Date().getTime(),
                id: "123",
                is_ai_generated: false,
                status: "New",
                updated_at: new Date().getTime(),
                user_id: "123",
              }}
            />
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
