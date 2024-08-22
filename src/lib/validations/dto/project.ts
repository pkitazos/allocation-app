import { z } from "zod";

import { tagTypeSchema } from "@/components/tag/tag-input";

export const projectTableDataDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  supervisor: z.object({
    id: z.string(),
    name: z.string(),
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
