import { z } from "zod";

export const UserLoginBody = z.object({
  idToken: z.string(),
});

export type UserLoginBody = z.infer<typeof UserLoginBody>;
