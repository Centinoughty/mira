import { z } from "zod";

export const TaskCreateBody = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  dueDate: z.coerce.date(),
  priority: z.enum(["low", "medium", "high"]),
});

export type TaskCreateBody = z.infer<typeof TaskCreateBody>;

export const ToggleTaskParams = z.object({
  id: z.uuidv4(),
});

export type ToggleTaskParams = z.infer<typeof ToggleTaskParams>;
