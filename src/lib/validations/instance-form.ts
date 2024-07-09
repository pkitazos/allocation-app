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

export const editFormDetailsSchema2 = z.object({
  tags: z.array(z.object({ title: z.string() })),
  flags: z.array(z.object({ title: z.string() })),

  projectSubmissionDeadline: z.date(),

  minNumPreferences: z.coerce.number().int().positive(),
  maxNumPreferences: z.coerce.number().int().positive(),
  maxNumPerSupervisor: z.coerce.number().int().positive(),
  preferenceSubmissionDeadline: z.date(),
});

export type EditFormData = z.infer<typeof editFormDetailsSchema2>;
