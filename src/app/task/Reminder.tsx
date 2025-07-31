import { useQuery } from "@tanstack/react-query";
import { formatDistance } from "date-fns";
import { Clock } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { conversationTasksQueryOptions } from "@/data/task";

type ReminderProps = {
  conversationId: string;
};

export default function Reminder({ conversationId }: ReminderProps) {
  const { data } = useQuery({
    ...conversationTasksQueryOptions(conversationId),
    select: (data) =>
      data
        .sort((a, b) => a.due_date - b.due_date)
        .find((task) => task.status !== "Completed"),
  });

  if (!data) {
    return null;
  }

  const dueDate = new Date(data.due_date * 1000);

  return (
    <Alert>
      <Clock />
      <AlertTitle>Task due in {formatDistance(dueDate, new Date())}</AlertTitle>
      <AlertDescription>{data.description}</AlertDescription>
    </Alert>
  );
}
