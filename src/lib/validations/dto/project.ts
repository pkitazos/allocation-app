import { z } from "zod";

import { tagTypeSchema } from "@/components/tag/tag-input";
import { title } from "process";

export const projectDtoSchema = z.object({
  title: z.string(),
  description: z.string(),
  supervisor: z.object({ id: z.string(), name: z.string() }),
  capacityUpperBound: z.number(),
  preAllocatedStudentId: z.string().or(z.null()), // TODO: change to undefined
  specialTechnicalRequirements: z.string(),
  flags: z.array(tagTypeSchema),
  tags: z.array(tagTypeSchema),
});

export type ProjectDto = z.infer<typeof projectDtoSchema>;

export const projectTableDataDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  specialTechnicalRequirements: z.string(),
  supervisor: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
  flags: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
    }),
  ),
  tags: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
    }),
  ),
});

export type ProjectTableDataDto = z.infer<typeof projectTableDataDtoSchema>;

export const lateProjectDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  supervisorId: z.string(),
  flags: z.array(tagTypeSchema),
  capacityUpperBound: z.number(),
});

export type LateProjectDto = z.infer<typeof lateProjectDtoSchema>;

export const projectSubmissionDtoSchema = z.object({
  name: z.string(),
  email: z.string(),
  userId: z.string(),
  submittedProjectsCount: z.number(),
  submissionTarget: z.number(),
  targetMet: z.boolean(),
});

export type ProjectSubmissionDto = z.infer<typeof projectSubmissionDtoSchema>;

export const newStudentProjectDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  flags: z.array(tagTypeSchema),
});

export type NewStudentProjectDto = z.infer<typeof newStudentProjectDtoSchema>;
