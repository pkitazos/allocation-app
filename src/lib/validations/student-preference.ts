import { PreferenceType } from "@prisma/client";
import { z } from "zod";

export const studentPreferenceSchema = z
  .nativeEnum(PreferenceType)
  .or(z.literal("None"));

export type StudentPreferenceType = z.infer<typeof studentPreferenceSchema>;
