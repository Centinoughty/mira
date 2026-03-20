import { z } from "zod";

export const TaskCreateBody = z.object({
  title: z.string().min(1).max(255),
  description: z.string().nullish(),
  dueDate: z.coerce.date(),
  priority: z.enum(["low", "medium", "high"]),
  memberIds: z.array(z.uuidv4()).default([]),
});

export const TaskUpdateBody = z.object({
  title: z.string().min(1).max(255),
  description: z.string().nullish(),
  dueDate: z.coerce.date(),
  priority: z.enum(["low", "medium", "high"]),
  memberIds: z.array(z.uuidv4()).default([]),
});

export const TaskIdParams = z.object({
  id: z.uuidv4(),
});

export type TaskCreateBody = z.infer<typeof TaskCreateBody>;
export type TaskUpdateBody = z.infer<typeof TaskUpdateBody>;
export type TaskIdParams = z.infer<typeof TaskIdParams>;
