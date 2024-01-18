import { Algorithm } from "../validations/algorithm";

// TODO: add actual descriptions
export const GenerousAlgorithm = {
  algName: "generous",
  displayName: "Generous",
  description: "description",
  flag1: "MAXSIZE",
  flag2: "GEN",
  flag3: "LSB",
} satisfies Algorithm;

export const GreedyAlgorithm = {
  algName: "greedy",
  displayName: "Greedy",
  description: "description",
  flag1: "MAXSIZE",
  flag2: "GRE",
  flag3: "LSB",
} satisfies Algorithm;

export const MinCostAlgorithm = {
  algName: "minimum-cost",
  displayName: "Minimum Cost",
  description: "description",
  flag1: "MAXSIZE",
  flag2: "MINCOST",
  flag3: "LSB",
} satisfies Algorithm;

export const GreedyGenAlgorithm = {
  algName: "greedy-generous",
  displayName: "Greedy-Generous",
  description: "description",
  flag1: "MAXSIZE",
  flag2: "GRE",
  flag3: "LSB",
} satisfies Algorithm;
