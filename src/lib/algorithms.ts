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

// TODO update this with proper values (flags, etc.)
export const GenerousAlgorithm = {
  algName: "generous",
  displayName: "",
  description: "",
  flag: "GEN",
} satisfies Algorithm;

export const GreedyAlgorithm = {
  algName: "greedy",
  displayName: "",
  description: "",
  flag: "GEN",
} satisfies Algorithm;

export const MinCostAlgorithm = {
  algName: "minimum-cost",
  displayName: "",
  description: "",
  flag: "GEN",
} satisfies Algorithm;

export const GreedyGenAlgorithm = {
  algName: "greedy-generous",
  displayName: "",
  description: "",
  flag: "GEN",
} satisfies Algorithm;
