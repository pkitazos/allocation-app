import { AlgorithmFlag } from "@prisma/client";
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

export const mathcingDataWithArgsSchema = matchingDataSchema.extend({
  args: z.array(z.string()),
});

export const builtInAlgSchema = z.enum([
  "generous",
  "greedy",
  "minimum-cost",
  "greedy-generous",
]);

export const algorithmFlagSchema = z.nativeEnum(AlgorithmFlag);

export type MatchingData = z.infer<typeof matchingDataSchema>;

export type MatchingDataWithArgs = z.infer<typeof mathcingDataWithArgsSchema>;

export type BuiltInAlg = z.infer<typeof builtInAlgSchema>;

export const algorithmSchema = z.object({
  algName: z.string(),
  displayName: z.string(),
  description: z.string(),
  flag1: z.nativeEnum(AlgorithmFlag),
  flag2: z.nativeEnum(AlgorithmFlag).optional(),
  flag3: z.nativeEnum(AlgorithmFlag).optional(),
});

export type Algorithm = z.infer<typeof algorithmSchema>;

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

export const serverResponseSchema = z.object({
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

export type ServerResponse = z.infer<typeof serverResponseSchema>;
