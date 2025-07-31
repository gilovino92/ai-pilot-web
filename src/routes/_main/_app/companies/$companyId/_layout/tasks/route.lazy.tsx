import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Bot } from "lucide-react";

import CreateWithCustomer from "@/app/task/CreateWithCustomer";
import Task from "@/app/task/Task";
import { ScrollArea } from "@/components/ui/scroll-area";
import { tasksQueryOptions } from "@/data/task";

export const Route = createLazyFileRoute(
  "/_main/_app/companies/$companyId/_layout/tasks",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { companyId } = Route.useParams();

  const { data: tasks } = useSuspenseQuery(
    tasksQueryOptions({
      customer_id: parseInt(companyId, 10),
    }),
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="flex items-center justify-between">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Tasks
        </h4>
        <CreateWithCustomer customerId={companyId} />
      </div>
      <div className="min-h-0 flex-1">
        <ScrollArea className="h-full">
          <div className="space-y-2">
            {tasks
              .filter(
                (task) =>
                  !task.is_ai_generated ||
                  (task.is_ai_generated && task.status !== "New"),
              )
              .map((task) => (
                <Task data={task} key={task.id} />
              ))}
            <h5 className="flex items-center gap-2 py-2 leading-7 font-medium">
              <Bot size={18} /> AI Task Suggestions
            </h5>
            {tasks
              .filter((task) => task.is_ai_generated && task.status === "New")
              .map((task) => (
                <Task data={task} key={task.id} />
              ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
