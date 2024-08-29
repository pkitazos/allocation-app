import { PreferenceType } from "@prisma/client";
import { z } from "zod";

export const savedPreferenceDto = z.object({
  id: z.string(),
  title: z.string(),
  supervisor: z.object({
    id: z.string(),
    name: z.string(),
  }),
  rank: z.number(),
});

export type SavedPreferenceDto = z.infer<typeof savedPreferenceDto>;

export const preferenceSubmissionDto = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  submissionCount: z.number(),
  submitted: z.boolean(),
});

export type PreferenceSubmissionDto = z.infer<typeof preferenceSubmissionDto>;

export const newProjectPreferenceDtoSchema = z.object({
  projectId: z.string(),
  preferenceType: z.nativeEnum(PreferenceType),
});

export type NewProjectPreferenceDto = z.infer<
  typeof newProjectPreferenceDtoSchema
>;
