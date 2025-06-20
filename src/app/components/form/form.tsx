import { ComponentProps } from "react";
import { FieldValues, FormProvider, SubmitHandler, UseFormReturn } from "react-hook-form";

interface Props<T extends FieldValues> extends Omit<ComponentProps<"form">, "onSubmit"> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
}

const Form = <T extends FieldValues>({ form, onSubmit, children, ...props }: Props<T>) => {
  const { formState } = form;
  const isSubmitting = formState.isSubmitting;

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} {...props}>
        <fieldset disabled={isSubmitting} style={{ border: "none" }}>
          {children}
        </fieldset>
      </form>
    </FormProvider>
  );
};

export { Form };
