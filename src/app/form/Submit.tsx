import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFormContext } from "@/config/form";

type SubmitProps = React.ComponentProps<typeof Button>;

export default function Submit({ children, ...rest }: SubmitProps) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button {...rest} disabled={!canSubmit || isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          {children}
        </Button>
      )}
    </form.Subscribe>
  );
}
