import { Stage } from "@prisma/client";

import { stageOrd } from "@/lib/db";

export function stageCheck(currentStage: Stage, minStage: Stage) {
  return stageOrd[currentStage] >= stageOrd[minStage];
}
