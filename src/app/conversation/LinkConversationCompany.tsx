import { useMutation } from "@tanstack/react-query";
import { Briefcase } from "lucide-react";
import { useState } from "react";

import type { Network } from "@/data/types";

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
import { linkCustomerConversation } from "@/data/conversation";
import { useInfiniteCustomers } from "@/data/hooks/company";

type LinkConversationCompanyProps = {
  conversationId: string;
  network: Network;
};

export default function LinkConversationCompany({
  conversationId,
  network,
}: LinkConversationCompanyProps) {
  const [open, setOpen] = useState(false);

  const { data, fetchNextPage } = useInfiniteCustomers();
  const { mutateAsync } = useMutation({
    mutationFn: async (companyId: string) =>
      linkCustomerConversation(companyId, [
        {
          conversationId,
          network,
        },
      ]),
    onSuccess: (_, vars) => {
      window.gtag("event", "link_company", {
        company_id: vars,
        conversation_id: conversationId,
      });
    },
  });

  const form = useAppForm({
    defaultValues: {
      company: "",
    },
    onSubmit: async ({ value }) => {
      if (!value.company) {
        return;
      }

      await mutateAsync(value.company);

      form.reset();
      setOpen(false);
    },
  });

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Briefcase />
          Link to Company
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link Conversation</DialogTitle>
          <DialogDescription>
            Select a company to link to the conversation
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid gap-4 py-4">
            <form.AppField name="company">
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
                  placeholder="Select company"
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
