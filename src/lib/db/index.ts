import { AdminLevel, PrismaClient, Role } from "@prisma/client";

export const db = new PrismaClient();

export type CompositeUser = {
  id: string;
  role: Role | null | undefined;
} & {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
};

export const adminLevelOrd = {
  [AdminLevel.SUPER]: 3,
  [AdminLevel.GROUP]: 2,
  [AdminLevel.SUB_GROUP]: 1,
} as const;

export function permissionCheck(level: AdminLevel, minimumLevel: AdminLevel) {
  return adminLevelOrd[level] >= adminLevelOrd[minimumLevel];
}
