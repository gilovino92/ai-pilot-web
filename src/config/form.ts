import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import DateField from "@/app/form/DateField";
import FileField from "@/app/form/FileField";
import MultiSelectItemField from "@/app/form/MultiSelectItemField";
import PasswordField from "@/app/form/PasswordField";
import SelectField from "@/app/form/SelectField";
import Submit from "@/app/form/Submit";
import TextareaField from "@/app/form/TextareaField";
import TextField from "@/app/form/TextField";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    DateField,
    FileField,
    MultiSelectItemField,
    PasswordField,
    SelectField,
    TextareaField,
    TextField,
  },
  fieldContext,
  formComponents: {
    Submit,
  },
  formContext,
});
