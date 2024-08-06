import { z } from "zod";

export const supervisorProjectSubmissionDetailsSchema = z.object({
  userId: z.string(),
  name: z.string(),
  email: z.string(),
  submittedProjectsCount: z.number(),
  projectAllocationTarget: z.number(),
  allocatedCount: z.number(),
  submissionTarget: z.number(),
});

export type SupervisorProjectSubmissionDetails = z.infer<
  typeof supervisorProjectSubmissionDetailsSchema
>;
