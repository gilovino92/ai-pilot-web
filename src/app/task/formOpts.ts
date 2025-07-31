import { formOptions } from "@tanstack/react-form";
import * as z from "zod";

import type { Task } from "@/data/types";

const taskSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.date(),
  status: z.enum(["New", "Completed", "InProgress", "Pending"]),
});

const formOpts = formOptions({
  defaultValues: {
    customerId: "",
    description: "",
    dueDate: new Date(),
    status: "New" as Task["status"],
  },
  validators: {
    onChange: taskSchema,
  },
});

export default formOpts;
