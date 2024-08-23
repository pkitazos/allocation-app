import { z } from "zod";

export const supervisorDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  projectTarget: z.number(),
  projectUpperQuota: z.number(),
});

export type SupervisorDto = z.infer<typeof supervisorDtoSchema>;
