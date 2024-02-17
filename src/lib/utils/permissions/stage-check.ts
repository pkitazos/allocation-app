import { stageOrd } from "@/lib/db";
import { Stage } from "@prisma/client";

export function stageCheck(currentStage: Stage, minStage: Stage) {
  return stageOrd[currentStage] >= stageOrd[minStage];
}
