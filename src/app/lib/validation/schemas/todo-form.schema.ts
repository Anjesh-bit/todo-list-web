import { z } from "zod";

export const todoFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  date: z.date({
    required_error: "Date and time is required",
    invalid_type_error: "Invalid date",
  }),
});
