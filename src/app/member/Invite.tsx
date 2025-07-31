import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { UserPlus2 } from "lucide-react";
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
import { inviteOrganizationMember } from "@/data/organization";
import { profileQueryOptions } from "@/data/user";

export default function Invite() {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { data: profile } = useSuspenseQuery(profileQueryOptions());
  const { mutate } = useMutation({
    mutationFn: (email: string) =>
      inviteOrganizationMember(profile.organization_id, email),
    mutationKey: ["inviteOrganizationMember"],
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["organizationMembers"] }),
    onSuccess: (data) => {
      window.gtag("event", "admin_invite_user", {
        user_email: data.email,
      });
    },
  });

  const form = useAppForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      mutate(value.email);
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
          <UserPlus2 />
          Invite
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
            <DialogTitle>Invite Member</DialogTitle>
            <DialogDescription>
              Invite your colleague to the organization.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <form.AppField name="email">
              {(f) => (
                <f.TextField
                  label="Email"
                  placeholder="m@example.com"
                  type="email"
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
