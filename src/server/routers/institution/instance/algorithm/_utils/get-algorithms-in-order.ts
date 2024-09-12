import {
  GenerousAlgorithm,
  GreedyAlgorithm,
  GreedyGenAlgorithm,
  MinCostAlgorithm,
} from "@/lib/algorithms";
import { relativeComplement } from "@/lib/utils/general/set-difference";

export function getAlgorithmsInOrder<T extends { algName: string }>(
  algorithmData: T[],
) {
  const builtInAlgs = [
    GenerousAlgorithm,
    GreedyAlgorithm,
    GreedyGenAlgorithm,
    MinCostAlgorithm,
  ];

  const customAlgs = relativeComplement(
    algorithmData,
    builtInAlgs,
    (a, b) => a.algName === b.algName,
  ).sort((a, b) => a.algName.localeCompare(b.algName));

  return [...builtInAlgs, ...customAlgs];
}
