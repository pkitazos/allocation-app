import { Stage } from "@prisma/client";

import { stageOrd } from "@/lib/db";
import { stageSchema } from "@/lib/validations/stage";

export function stageGt(currentStage: Stage, minStage: Stage) {
  return stageOrd[currentStage] > stageOrd[minStage];
}

export function stageGte(currentStage: Stage, minStage: Stage) {
  return stageOrd[currentStage] >= stageOrd[minStage];
}

export function stageLt(currentStage: Stage, minStage: Stage) {
  return stageOrd[currentStage] < stageOrd[minStage];
}

export function stageLte(currentStage: Stage, minStage: Stage) {
  return stageOrd[currentStage] <= stageOrd[minStage];
}

export function subsequentStages(minStage: Stage) {
  return stageSchema.options.filter((s) => stageOrd[s] >= stageOrd[minStage]);
}

export function previousStages(maxStage: Stage) {
  return stageSchema.options.filter((s) => stageOrd[s] <= stageOrd[maxStage]);
}
