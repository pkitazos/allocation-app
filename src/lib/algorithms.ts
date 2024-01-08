import {
  algorithmFlagSchema,
  builtInAlgSchema,
} from "@/lib/validations/algorithm";

import { z } from "zod";

export const algorithmSchema = z.object({
  algName: builtInAlgSchema,
  displayName: z.string(),
  description: z.string(),
  flag: algorithmFlagSchema,
});

export type Algorithm = z.infer<typeof algorithmSchema>;

// TODO: add actual descriptions
export const GenerousAlgorithm = {
  algName: "generous",
  displayName: "Generous",
  description: "description",
  flag: "GEN",
} satisfies Algorithm;

export const GreedyAlgorithm = {
  algName: "greedy",
  displayName: "Greedy",
  description: "description",
  flag: "GRE",
} satisfies Algorithm;

export const MinCostAlgorithm = {
  algName: "minimum-cost",
  displayName: "Minimum Cost",
  description: "description",
  flag: "MINCOST",
} satisfies Algorithm;

export const GreedyGenAlgorithm = {
  algName: "greedy-generous",
  displayName: "Greedy-Generous",
  description: "description",
  flag: "GRE",
} satisfies Algorithm;
