import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

import type { Customer } from "@/data/types";

import ConfirmDialog from "@/app/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { deleteCustomer } from "@/data/customer";

type DeleteProps = {
  data: Customer;
  onDelete?: () => void;
};

export default function Delete({ data, onDelete }: DeleteProps) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () => deleteCustomer(data.id.toString()),
    mutationKey: ["deleteCustomer"],
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
    onSuccess: () => {
      onDelete?.();
      window.gtag("event", "customer_deleted", {
        customer_id: data.id,
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
