import { z } from "zod";

export const studentInviteDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  joined: z.boolean(),
});

export type StudentInviteDto = z.infer<typeof studentInviteDtoSchema>;
