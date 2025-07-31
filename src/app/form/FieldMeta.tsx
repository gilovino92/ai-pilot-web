import type { AnyFieldApi } from "@tanstack/react-form";

type FieldMetaProps = {
  field: AnyFieldApi;
};

export default function FieldMeta({ field }: FieldMetaProps) {
  if (field.state.meta.isTouched && field.state.meta.errors.length > 0) {
    return (
      <p className="text-destructive text-sm" data-slot="form-message">
        {field.state.meta.errors.map((err) => err.message).join(",")}
      </p>
    );
  }

  return null;
}
