import { z } from "zod";

import { todoFormSchema } from "../../../../lib/validation/schemas/todo-form.schema";

export type TodoFormValues = z.infer<typeof todoFormSchema>;
