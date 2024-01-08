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

export const serverResponseDataSchema = z.object({
  matching: z.array(z.tuple([z.string(), z.string(), z.number()])),
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

export const algorithmFlag: Record<BuiltInAlg, AlgorithmFlag> = {
  generous: "GEN",
  greedy: "GRE",
  "minimum-cost": "MINCOST",
  "greedy-generous": "GRE",
};

export type ServerResponseData = z.infer<typeof serverResponseDataSchema>;

export type AlgorithmResult = z.infer<typeof algorithmResultSchema>;

export type MatchingData = z.infer<typeof matchingDataSchema>;

export type MatchingDataWithArgs = z.infer<typeof mathcingDataWithArgsSchema>;

export type AlgorithmServerData =
  | { algorithm: "custom"; matchingData: MatchingDataWithArgs }
  | { algorithm: BuiltInAlg; matchingData: MatchingData };

export type BuiltInAlg = z.infer<typeof builtInAlgSchema>;
