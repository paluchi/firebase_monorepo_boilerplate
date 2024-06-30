import { z } from "zod";

export const TodoSchema = z.object({
  id: z.string().optional(),
  text: z.string(),
  completed: z.boolean(),
  userId: z.string(),
  createdAt: z.date().optional(),
});

export type Todo = z.infer<typeof TodoSchema>;
