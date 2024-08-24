import { z } from "zod";

export const supervisorDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  projectTarget: z.number(),
  projectUpperQuota: z.number(),
});

export type SupervisorDto = z.infer<typeof supervisorDtoSchema>;

export const supervisorInviteDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  joined: z.boolean(),
});

export type SupervisorInviteDto = z.infer<typeof supervisorInviteDtoSchema>;
