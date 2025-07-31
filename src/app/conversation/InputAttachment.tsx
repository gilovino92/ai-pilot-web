import { useMutation } from "@tanstack/react-query";
import { FileText, Paperclip } from "lucide-react";
import { useRef, useState } from "react";

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
import { sendWhatsAppMediaMessage } from "@/data/conversation.whatsapp";
import { formatFileSize, trimFilename } from "@/libs/file";

import { canPreviewFile } from "./utils";

type InputAttachmentProps = {
  conversationId: string;
};

export default function InputAttachment({
  conversationId,
}: InputAttachmentProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  const { mutateAsync } = useMutation({
    mutationFn: sendWhatsAppMediaMessage,
  });

  const form = useAppForm({
    defaultValues: {
      caption: "",
      files: null as FileList | null,
    },
    onSubmit: async ({ value }) => {
      if (!value.files?.[0]) {
        return;
      }

      const file = value.files[0];

      await mutateAsync({
        caption: value.caption,
        file,
        targetId: conversationId,
      });

      form.reset();
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
          <Paperclip />
        </Button>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={() => {
          fileRef.current?.click();
        }}
      >
        <DialogHeader>
          <DialogTitle>Attachment</DialogTitle>
          <DialogDescription>
            Attach a file to your message. Accepts image, audio, video and
            documents with the following extensions: .pdf, .txt, .doc, .docx.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.AppField name="files">
            {(f) => {
              const file = f.state.value?.[0];

              return (
                <div className="space-y-2">
                  <f.FileField
                    accept="image/*,audio/*,video/*,.pdf,.txt,.doc,.docx"
                    label="Document"
                    ref={fileRef}
                  />
                  <div className="space-y-2">
                    {file && (
                      <div className="flex flex-col items-center">
                        <FileText size={48} />
                        <p className="mt-2 text-center font-medium">
                          {trimFilename(file.name)}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    )}
                    {file && canPreviewFile(file.type) && (
                      <div className="bg-muted space-y-2 rounded-md border p-2">
                        {file.type.startsWith("image/") && (
                          <img
                            alt="Attachment"
                            className="mx-auto h-auto max-h-60 max-w-full"
                            src={URL.createObjectURL(file)}
                          />
                        )}
                        {file.type.startsWith("audio/") && (
                          <audio
                            className="w-full"
                            controls
                            src={URL.createObjectURL(file)}
                          />
                        )}
                        {file.type.startsWith("video/") && (
                          <video
                            className="aspect-video"
                            controls
                            src={URL.createObjectURL(file)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            }}
          </form.AppField>
          <form.AppField name="caption">
            {(f) => <f.TextField label="Caption" placeholder="Add a caption" />}
          </form.AppField>
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
