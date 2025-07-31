import { format, isPast } from "date-fns";
import { Bot, CalendarDays, MessageCircleCode } from "lucide-react";

import type { Task as TTask } from "@/data/types";

import { Badge } from "@/components/cui/badge";
import { cn } from "@/components/libs/utils";

import Add from "./Add";
import Delete from "./Delete";
import Edit from "./Edit";

type TaskProps = {
  data: TTask;
};

export default function Task({ data }: TaskProps) {
  const dueDate = new Date(data.due_date * 1000);
  const isOverdue = isPast(dueDate) && data.status !== "Completed";
  const isNewAiGenerated = data.is_ai_generated && data.status === "New";

  const variant =
    data.status === "Completed"
      ? "success"
      : data.status === "InProgress"
        ? "warning"
        : data.status === "New"
          ? "secondary"
          : "default";

  return (
    <div className="flex justify-between gap-2 rounded-md border px-3 py-2">
      <div className="space-y-1">
        <p className="font-medium">{data.description}</p>
        <div className="text-muted-foreground flex items-center gap-1">
          <MessageCircleCode size={14} />
          <p className="text-xs">Company: {data.customer_name}</p>
        </div>
        {!isNewAiGenerated && (
          <div className="text-muted-foreground flex items-center gap-1">
            <CalendarDays
              className={cn(isOverdue && "text-destructive")}
              size={14}
            />
            <p className={cn("text-xs", isOverdue && "text-destructive")}>
              Due: {format(dueDate, "PPpp")}
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col items-end justify-between">
        <div className="flex items-center gap-2">
          {data.is_ai_generated && (
            <Badge variant="secondary">
              <Bot /> AI Generated
            </Badge>
          )}
          {!isNewAiGenerated && <Badge variant={variant}>{data.status}</Badge>}
        </div>
        <div>
          {isNewAiGenerated ? <Add data={data} /> : <Edit data={data} />}
          <Delete data={data} />
        </div>
      </div>
    </div>
  );
}
