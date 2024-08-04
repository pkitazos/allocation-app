import { z } from "zod";

import { flagToLevel } from "@/content/configs/flag-to-level";

export const studentLevelSchema = z
  .literal(flagToLevel.bsc.level)
  .or(z.literal(flagToLevel.msci.level));
