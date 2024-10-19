import { z } from "zod";

export const TodoSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
  date: z.string().transform((date) => new Date(date).toISOString()),
  done: z.boolean().default(false),
});

export type ITodoSchema = z.infer<typeof TodoSchema>;
