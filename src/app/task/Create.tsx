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
import { useInfiniteCustomers } from "@/data/hooks/company";
import { createTask } from "@/data/task";
import { getTimeInSeconds } from "@/libs/utils";

import Form from "./Form";
import formOpts from "./formOpts";

export default function Create() {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { data, fetchNextPage } = useInfiniteCustomers();
  const { mutateAsync } = useMutation({
    mutationFn: createTask,
    mutationKey: ["createTask"],
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      }),
    onSuccess: (data) => {
      window.gtag("event", "task_created", {
        task_id: data.id,
      });
    },
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
            <DialogDescription>Create a new task.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <form.AppField name="customerId">
              {(f) => (
                <f.SelectField
                  label="Company"
                  onEndReached={() => {
                    fetchNextPage();
                  }}
                  options={(data?.data ?? []).map((c) => ({
                    label: c.company_name,
                    value: c.id.toString(),
                  }))}
                  placeholder="Select a company"
                />
              )}
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
