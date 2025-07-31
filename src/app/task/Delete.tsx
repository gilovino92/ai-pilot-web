import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

import type { Task } from "@/data/types";

import ConfirmDialog from "@/app/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { deleteTask } from "@/data/task";

type DeleteProps = {
  data: Task;
  onDelete?: () => void;
};

export default function Delete({ data, onDelete }: DeleteProps) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () => deleteTask(data.id),
    mutationKey: ["deleteTask"],
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      }),
    onSuccess: () => {
      onDelete?.();

      window.gtag("event", "task_deleted", {
        task_id: data.id,
        task_source: data.is_ai_generated ? "ai" : "manual",
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <Trash2 className="text-destructive" />
        </Button>
      </DialogTrigger>
      <ConfirmDialog
        onConfirm={() => {
          mutate();
        }}
      />
    </Dialog>
  );
}
