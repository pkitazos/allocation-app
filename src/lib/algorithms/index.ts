import { AlgorithmFlag } from "@prisma/client";

import { Algorithm } from "@/lib/validations/algorithm";

// TODO: add actual descriptions
export const GenerousAlgorithm = {
  algName: "generous",
  displayName: "Generous",
  description: "description",
  flag1: AlgorithmFlag.MAXSIZE,
  flag2: AlgorithmFlag.GEN,
  flag3: AlgorithmFlag.LSB,
} satisfies Algorithm;

export const GreedyAlgorithm = {
  algName: "greedy",
  displayName: "Greedy",
  description: "description",
  flag1: AlgorithmFlag.MAXSIZE,
  flag2: AlgorithmFlag.GRE,
  flag3: AlgorithmFlag.LSB,
} satisfies Algorithm;

export const MinCostAlgorithm = {
  algName: "minimum-cost",
  displayName: "Minimum Cost",
  description: "description",
  flag1: AlgorithmFlag.MAXSIZE,
  flag2: AlgorithmFlag.MINCOST,
  flag3: AlgorithmFlag.LSB,
} satisfies Algorithm;

export const GreedyGenAlgorithm = {
  algName: "greedy-generous",
  displayName: "Greedy-Generous",
  description: "description",
  flag1: AlgorithmFlag.MAXSIZE,
  flag2: AlgorithmFlag.GRE,
  flag3: AlgorithmFlag.LSB,
} satisfies Algorithm;
