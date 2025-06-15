import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormProps, useForm as useRHForm } from "react-hook-form";
import { z } from "zod";

interface UseZodFormProps<S extends z.ZodTypeAny> extends Exclude<UseFormProps<z.infer<S>>, "resolver"> {
  schema: S;
}

export const useForm = <S extends z.ZodTypeAny>({ schema, ...formConfigs }: UseZodFormProps<S>) => {
  const methods = useRHForm<z.infer<S>>({
    ...formConfigs,
    resolver: zodResolver(schema),
  });

  (methods as typeof methods & { _schema: S })._schema = schema;

  return methods;
};
