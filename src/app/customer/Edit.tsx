import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit as EditIcon } from "lucide-react";
import { useState } from "react";

import type { Customer } from "@/data/types";

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
import { updateCustomer } from "@/data/customer";

type EditProps = {
  data: Customer;
};

export default function Edit({ data }: EditProps) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: updateCustomer,
    mutationKey: ["updateCustomer"],
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
    onSuccess: (data) => {
      window.gtag("event", "customer_updated", {
        customer_id: data.data.id,
      });
    },
  });

  const form = useAppForm({
    defaultValues: {
      address: data.address,
      company_name: data.company_name,
      email: data.email,
      industry: data.industry,
      notes: data.notes,
      num_employees: data.num_employees.toString(),
      phone_number: data.phone_number,
      status: data.status,
      tax_code: data.tax_code,
      website: data.website,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync({
        ...value,
        id: data.id,
        num_employees: value.num_employees
          ? parseInt(value.num_employees, 10)
          : undefined,
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
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>
              Fill in the details to edit the company.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <form.AppField name="company_name">
              {(f) => (
                <f.TextField
                  label="Company Name"
                  placeholder="ACME Inc."
                  type="text"
                />
              )}
            </form.AppField>
            <form.AppField name="phone_number">
              {(f) => (
                <f.TextField
                  label="Phone"
                  placeholder="+1234567890"
                  type="text"
                />
              )}
            </form.AppField>
            <form.AppField name="email">
              {(f) => (
                <f.TextField
                  label="Email"
                  placeholder="m@example.com"
                  type="text"
                />
              )}
            </form.AppField>
            <form.AppField name="website">
              {(f) => (
                <f.TextField
                  label="Website"
                  placeholder="https://www.example.com"
                  type="text"
                />
              )}
            </form.AppField>
            <div className="col-span-2">
              <form.AppField name="address">
                {(f) => (
                  <f.TextField
                    label="Address"
                    placeholder="Full Address"
                    type="text"
                  />
                )}
              </form.AppField>
            </div>
            <form.AppField name="industry">
              {(f) => (
                <f.TextField
                  label="Industry"
                  placeholder="Grain Export, Produce"
                  type="text"
                />
              )}
            </form.AppField>
            <form.AppField name="status">
              {(f) => (
                <f.SelectField
                  label="Status"
                  options={[
                    { label: "Prospect", value: "prospect" },
                    { label: "New", value: "new" },
                    { label: "Active", value: "active" },
                    { label: "Inactive", value: "inactive" },
                  ]}
                  placeholder="New, Active, Inactive"
                />
              )}
            </form.AppField>
            <form.AppField name="num_employees">
              {(f) => (
                <f.TextField
                  label="Number of Employees"
                  placeholder="100"
                  type="text"
                />
              )}
            </form.AppField>
            <div className="col-span-2">
              <form.AppField name="notes">
                {(f) => (
                  <f.TextareaField
                    label="Notes"
                    placeholder="Notes about the customer"
                  />
                )}
              </form.AppField>
            </div>
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
