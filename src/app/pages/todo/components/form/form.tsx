import { Box, Button, Text, TextInput, Textarea } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useEffect } from "react";

import styles from "./form.module.css";
import { TodoFormValues } from "./form.types";
import { Form } from "../../../../components/form/form";
import { useForm } from "../../../../hooks/use-form";
import { todoFormSchema } from "../../../../lib/validation/schemas/todo-form.schema";
import { useToast } from "../../hooks/use-toast";
import { useTodoUpsert } from "../../services/use-todo-mutate.services";
import { Todo } from "../../todo.types";

type TodoFormProps = {
  initialData?: Todo | null;
  onClear: () => void;
};

export const TodoForm = ({ initialData, onClear }: TodoFormProps) => {
  const isUpdateMode = Boolean(initialData?._id);

  const { mutate, isPending } = useTodoUpsert();
  const { message: toastMessage, showToast } = useToast();

  const form = useForm({
    schema: todoFormSchema,
    defaultValues: {
      name: "",
      description: "",
      date: new Date(),
    },
    mode: "onChange",
  });

  const {
    register,
    formState: { errors },
  } = form;

  const handleDateTime = (value: Date | null) => {
    if (value instanceof Date) form.setValue("date", value, { shouldValidate: true });
  };

  const onSubmit = (payload: TodoFormValues) => {
    mutate(
      { id: initialData?._id, payload },
      {
        onSuccess: (response) => {
          onClear();
          form.reset({
            name: "",
            description: "",
            date: undefined,
          });

          if (response?.message) showToast(response.message);
        },
      }
    );
  };

  useEffect(() => {
    if (initialData)
      form.reset({
        name: initialData.name,
        description: initialData.description,
        date: new Date(initialData.date),
      });
  }, [initialData, form]);

  return (
    <>
      <Box bg="white" p="xl" className={styles["form"]}>
        <Text className={styles["form-header"]}>{isUpdateMode ? "Update Todo" : "Create a New Todo"}</Text>
        <Form form={form} onSubmit={onSubmit}>
          <TextInput
            label="Name"
            placeholder="Enter todo title"
            radius="md"
            withAsterisk
            {...register("name")}
            error={errors.name?.message}
            mb="md"
          />
          <Textarea
            label="Description"
            placeholder="Briefly describe the task"
            radius="md"
            minRows={3}
            withAsterisk
            {...register("description")}
            error={errors.description?.message}
            mb="md"
          />
          <DateTimePicker
            classNames={{
              day: styles["form-date-picker"],
              submitButton: styles["form-date-picker-submitBtn"],
            }}
            value={form.watch("date")}
            onChange={handleDateTime}
            label="Pick date and time"
            placeholder="Pick date and time"
            radius="md"
            withAsterisk
            error={errors.date?.message}
          />
          <Button
            type="submit"
            fullWidth
            radius="md"
            loading={isPending}
            classNames={{ root: styles["form-submit-button"] }}
          >
            {isUpdateMode ? "Update Todo" : "Create Todo"}
          </Button>
        </Form>

        {toastMessage && <div className={styles["toast"]}>{toastMessage}</div>}
      </Box>
    </>
  );
};
