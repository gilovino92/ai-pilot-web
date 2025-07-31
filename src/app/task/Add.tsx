import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startOfTomorrow } from "date-fns";
import { Plus } from "lucide-react";

import type { Task } from "@/data/types";

import { Button } from "@/components/ui/button";
import { updateTask } from "@/data/task";
import { getTimeInSeconds } from "@/libs/utils";

type AddProps = {
  data: Task;
};

export default function Add({ data }: AddProps) {
  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: (body: Partial<Task>) => updateTask(data.id, body),
    mutationKey: ["updateTask"],
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      }),
    onSuccess: (data) => {
      window.gtag("event", "ai_task_added_from_pool", {
        task_id: data.id,
      });
    },
  });

  return (
    <Button
      disabled={isPending}
      onClick={() => {
        mutate({
          description: data.description,
          due_date: getTimeInSeconds(startOfTomorrow()),
          status: "Pending",
        });
      }}
      size="icon"
      variant="ghost"
    >
      <Plus />
    </Button>
  );
}
