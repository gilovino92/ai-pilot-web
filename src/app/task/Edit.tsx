import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit as EditIcon } from "lucide-react";
import { useState } from "react";

import type { Task } from "@/data/types";

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
import { updateTask } from "@/data/task";
import { getTimeInSeconds } from "@/libs/utils";

import Form from "./Form";
import formOpts from "./formOpts";

type EditProps = {
  data: Task;
};

export default function Edit({ data }: EditProps) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: (body: Partial<Task>) => updateTask(data.id, body),
    mutationKey: ["updateTask"],
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      }),
    onSuccess: (data) => {
      window.gtag("event", "task_updated", {
        task_id: data.id,
      });
    },
  });

  const form = useAppForm({
    defaultValues: {
      customerId: data.customer_id.toString(),
      description: data.description,
      dueDate: new Date(data.due_date * 1000),
      status: data.status,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync({
        description: value.description.trim(),
        due_date: getTimeInSeconds(value.dueDate),
        status: value.status,
      });

      setOpen(false);
    },
    validators: formOpts.validators,
  });

  return (
    <Dialog
      onOpenChange={(v) => {
        setOpen(v);
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <EditIcon />
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
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Edit the task description and due date.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <form.AppField
              defaultValue={data.customer_id.toString()}
              name="customerId"
            >
              {(f) => <input type="hidden" value={f.state.value} />}
            </form.AppField>
            <Form form={form} />
            <form.AppField name="status">
              {(f) => (
                <f.SelectField
                  label="Status"
                  options={[
                    { label: "Pending", value: "Pending" },
                    { label: "In Progress", value: "InProgress" },
                    { label: "Completed", value: "Completed" },
                  ]}
                  placeholder="Select a status"
                />
              )}
            </form.AppField>
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
