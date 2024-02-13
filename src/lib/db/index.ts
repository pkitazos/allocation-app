import { AdminLevel, PrismaClient } from "@prisma/client";

export const db = new PrismaClient();

export const adminLevelOrd = {
  [AdminLevel.SUPER]: 3,
  [AdminLevel.GROUP]: 2,
  [AdminLevel.SUB_GROUP]: 1,
} as const;
