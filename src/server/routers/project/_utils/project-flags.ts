import { PrismaClient } from "@prisma/client";

export async function createProjectFlags(
  db: PrismaClient,
  projectId: string,
  flagIds: string[],
) {
  await db.flagOnProject.createMany({
    data: flagIds.map((id) => ({
      projectId,
      flagId: id,
    })),
    skipDuplicates: true,
  });
}
