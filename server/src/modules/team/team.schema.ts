import { z } from "zod";

export const CreateTeamBody = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(255).nullish(),
  memberEmails: z.array(z.email()).default([]),
});

export const AddTeamMemberBody = z.object({
  email: z.email(),
});

export const TeamIdParams = z.object({
  id: z.uuidv4(),
});

export const TeamMemberParams = z.object({
  id: z.uuidv4(),
  memberId: z.uuidv4(),
});

export type CreateTeamBody = z.infer<typeof CreateTeamBody>;
export type AddTeamMemberBody = z.infer<typeof AddTeamMemberBody>;
export type TeamIdParams = z.infer<typeof TeamIdParams>;
export type TeamMemberParams = z.infer<typeof TeamMemberParams>;
