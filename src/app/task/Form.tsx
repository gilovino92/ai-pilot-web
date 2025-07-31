import { withForm } from "@/config/form";

import formOpts from "./formOpts";

const FormTask = withForm({
  ...formOpts,
  render: ({ form }) => (
    <>
      <form.AppField name="description">
        {(f) => (
          <f.TextareaField
            label="Description"
            placeholder="Describe the follow-up task"
          />
        )}
      </form.AppField>
      <form.AppField name="dueDate">
        {(f) => <f.DateField label="Due Date" placeholder="Pick a date" />}
      </form.AppField>
    </>
  ),
});

export default FormTask;
