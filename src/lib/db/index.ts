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

export const adminLevelOrd = Object.values(AdminLevel);
