import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";

import Create from "@/app/task/Create";
import Task from "@/app/task/Task";
import { ScrollArea } from "@/components/ui/scroll-area";
import { tasksQueryOptions } from "@/data/task";

export const Route = createLazyFileRoute("/_main/_app/tasks")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: tasks } = useSuspenseQuery(tasksQueryOptions());

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Tasks
          </h3>
          <p className="text-muted-foreground text-sm">
            Manage and track your follow-up tasks
          </p>
        </div>
        <Create />
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-3 gap-2">
        <div className="col-span-2 h-full min-h-0">
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
            </div>
          </ScrollArea>
        </div>
        <div className="col-span-1 h-full min-h-0">
          <div className="h-full space-y-2 rounded-md border p-4">
            <div>
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                AI Task Suggestions
              </h4>
              <p className="text-muted-foreground text-sm">
                Based on your recent conversations
              </p>
            </div>
            <ScrollArea className="h-full">
              <div className="space-y-2">
                {tasks
                  .filter(
                    (task) => task.is_ai_generated && task.status === "New",
                  )
                  .map((task) => (
                    <Task data={task} key={task.id} />
                  ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
