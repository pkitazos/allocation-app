import { z } from "zod";

export const updatedInstanceSchema = z.object({
  instanceName: z.string(),
  flags: z.array(z.object({ id: z.string(), title: z.string() })),
  tags: z.array(z.object({ id: z.string(), title: z.string() })),
  projectSubmissionDeadline: z.date(),
  minNumPreferences: z.number(),
  maxNumPreferences: z.number(),
  maxNumPerSupervisor: z.number(),
  preferenceSubmissionDeadline: z.date(),
});

export type UpdatedInstance = z.infer<typeof updatedInstanceSchema>;
