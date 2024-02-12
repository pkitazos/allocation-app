import { AdminLevel, PrismaClient } from "@prisma/client";

export async function isSuperAdmin(db: PrismaClient, userId: string) {
  const superAdmin = await db.adminInSpace.findFirst({
    where: { userId, adminLevel: AdminLevel.SUPER },
    select: { adminLevel: true },
  });
  return !!superAdmin;
}
