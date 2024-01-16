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

const serverMatchingDetailsSchema = z.object({
  student_id: z.string(),
  project_id: z.string(),
  project_capacities: z.object({
    lower_bound: z.number(),
    upper_bound: z.number(),
  }),
  preference_rank: z.number(),
  supervisor_id: z.string(),
  supervisor_capacities: z.object({
    lower_bound: z.number(),
    target: z.number(),
    upper_bound: z.number(),
  }),
});

export const serverResponseDataSchema = z.object({
  matching: z.array(serverMatchingDetailsSchema),
  profile: z.array(z.number()),
  weight: z.number(),
  size: z.number(),
  degree: z.number(),
});

export const algorithmResultSchema = serverResponseDataSchema.extend({
  selected: z.boolean(),
});

export const builtInAlgSchema = z.enum([
  "generous",
  "greedy",
  "minimum-cost",
  "greedy-generous",
]);

export const algorithmFlagSchema = z.nativeEnum(AlgorithmFlag);

export type ServerResponseData = z.infer<typeof serverResponseDataSchema>;

export type AlgorithmResult = z.infer<typeof algorithmResultSchema>;

export type MatchingData = z.infer<typeof matchingDataSchema>;

export type MatchingDataWithArgs = z.infer<typeof mathcingDataWithArgsSchema>;

export type AlgorithmServerData =
  | { algName: "custom"; matchingData: MatchingDataWithArgs }
  | { algName: BuiltInAlg; matchingData: MatchingData };

export type BuiltInAlg = z.infer<typeof builtInAlgSchema>;
