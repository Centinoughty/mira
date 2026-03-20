import { z } from "zod";

export const TaskCreateBody = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(255).optional(),
  dueDate: z.coerce.date(),
  priority: z.enum(["low", "medium", "high"]),
});

export type TaskCreateBody = z.infer<typeof TaskCreateBody>;
