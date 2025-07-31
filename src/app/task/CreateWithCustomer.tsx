import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppForm } from "@/config/form";
import { createTask } from "@/data/task";
import { getTimeInSeconds } from "@/libs/utils";

import Form from "./Form";
import formOpts from "./formOpts";

type CreateProps = {
  customerId: string;
};

export default function Create({ customerId }: CreateProps) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: createTask,
    mutationKey: ["createTask"],
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      }),
  });

  const form = useAppForm({
    ...formOpts,
    onSubmit: async ({ value }) => {
      await mutateAsync({
        customer_id: parseInt(value.customerId, 10),
        description: value.description,
        due_date: getTimeInSeconds(value.dueDate),
      });

      setOpen(false);
    },
  });

  return (
    <Dialog
      onOpenChange={(v) => {
        setOpen(v);
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
            <DialogDescription>
              Create a new task to follow up on a conversation.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <form.AppField defaultValue={customerId} name="customerId">
              {(f) => <input type="hidden" value={f.state.value} />}
            </form.AppField>
            <Form form={form} />
          </div>
          <DialogFooter>
            <form.AppForm>
              <form.Submit>Submit</form.Submit>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
