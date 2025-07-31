import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload as UploadIcon } from "lucide-react";
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
import { uploadDocument } from "@/data/document";

export default function Upload() {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (file: File) => {
      return uploadDocument(file);
    },
    mutationKey: ["uploadDocument"],
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["documents"] }),
    onSuccess: (data) => {
      window.gtag("event", "admin_upload_file", {
        file_id: data.id,
        file_name: data.filename,
        file_size: data.size,
        file_type: data.mime_type,
      });
    },
  });

  const form = useAppForm({
    defaultValues: {
      files: null as FileList | null,
    },
    onSubmit: async ({ value }) => {
      if (!value.files) {
        return;
      }

      mutate(value.files[0]);
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
          <UploadIcon />
          Upload
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
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a file to your organization&apos;s repository.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <form.AppField name="files">
              {(f) => <f.FileField label="File" />}
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
