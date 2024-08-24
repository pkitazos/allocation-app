import { z } from "zod";

const studentMatchingDataSchema = z.object({
  id: z.string(),
  preferences: z.array(z.string()),
});

const projectMatchingDataSchema = z.object({
  id: z.string(),
  lowerBound: z.number(),
  upperBound: z.number(),
  supervisorId: z.string(),
});

const supervisorMatchingDataSchema = z.object({
  id: z.string(),
  lowerBound: z.number(),
  target: z.number(),
  upperBound: z.number(),
});

export const matchingDataSchema = z.object({
  students: z.array(studentMatchingDataSchema),
  projects: z.array(projectMatchingDataSchema),
  supervisors: z.array(supervisorMatchingDataSchema),
});

export type MatchingData = z.infer<typeof matchingDataSchema>;

export const matchingDataWithArgsSchema = matchingDataSchema.extend({
  args: z.array(z.string()),
});

export type MatchingDataWithArgs = z.infer<typeof matchingDataWithArgsSchema>;

export const matchingDetailsSchema = z.object({
  student_id: z.string(),
  project_id: z.string(),
  project_capacities: z.object({
    lower_bound: z.number().int(),
    upper_bound: z.number().int(),
  }),
  preference_rank: z.number().int(),
  supervisor_id: z.string(),
  supervisor_capacities: z.object({
    lower_bound: z.number().int(),
    target: z.number().int(),
    upper_bound: z.number().int(),
  }),
});

export type MatchingDetails = z.infer<typeof matchingDetailsSchema>;

export const matchingResultSchema = z.object({
  profile: z.array(z.number()),
  degree: z.number(),
  size: z.number(),
  weight: z.number(),
  cost: z.number(),
  costSq: z.number(),
  maxLecAbsDiff: z.number(),
  sumLecAbsDiff: z.number(),
  matching: z.array(matchingDetailsSchema),
  ranks: z.array(z.number()),
});

export const blankResult: MatchingResult = {
  profile: [],
  degree: NaN,
  size: NaN,
  weight: NaN,
  cost: NaN,
  costSq: NaN,
  maxLecAbsDiff: NaN,
  sumLecAbsDiff: NaN,
  matching: [],
  ranks: [],
};

export type MatchingResult = z.infer<typeof matchingResultSchema>;

export const serverResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: matchingResultSchema.optional(),
});

export type MatchingDetailsDto = {
  studentId: string;
  studentName: string;
  projectId: string;
  projectTitle: string;
  studentRank: number;
};

export const supervisorMatchingDetailsDtoSchema = z.object({
  supervisorId: z.string(),
  supervisorName: z.string(),
  projectTarget: z.number(),
  projectUpperQuota: z.number(),
  allocationCount: z.number(),
});

export type SupervisorMatchingDetailsDto = z.infer<
  typeof supervisorMatchingDetailsDtoSchema
>;
