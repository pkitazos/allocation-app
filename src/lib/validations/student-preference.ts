import { PreferenceType } from "@prisma/client";
import { z } from "zod";

export const studentPreferenceType = z
  .nativeEnum(PreferenceType)
  .or(z.literal("None"));

export type StudentPreferenceType = z.infer<typeof studentPreferenceType>;
