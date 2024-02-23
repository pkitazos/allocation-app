import { AlgorithmFlag } from "@prisma/client";

import { Algorithm } from "@/lib/validations/algorithm";

// TODO: add actual descriptions
export const GenerousAlgorithm = {
  algName: "generous",
  displayName: "Generous",
  description:
    "Aims to to create the fairest distribution of matches across all students, ensuring that even the least desirable projects are as fairly allocated as possible before considering a student's higher preference.",
  flag1: AlgorithmFlag.MAXSIZE,
  flag2: AlgorithmFlag.GEN,
  flag3: AlgorithmFlag.LSB,
} satisfies Algorithm;

export const GreedyAlgorithm = {
  algName: "greedy",
  displayName: "Greedy",
  description:
    "Aims to to optimise the allocation so that the maximum number of students are matched with their higher-preferred choices, even if it compromises the number of students getting their lower-preferred choices.",
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
  description:
    "Starts by satisfying students' highest preferences as much as possible, and once the lowest successful match is identified, it redistributes the remaining opportunities in a way that is as fair as possible to all students.",
  flag1: AlgorithmFlag.MAXSIZE,
  flag2: AlgorithmFlag.GRE,
  flag3: AlgorithmFlag.LSB,
} satisfies Algorithm;
