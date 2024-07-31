import { PreferenceType, PrismaClient } from "@prisma/client";

import { InstanceParams } from "@/lib/validations/params";

export async function updatePreferenceTransaction(
  db: PrismaClient,
  params: InstanceParams,
  studentId: string,
  projectId: string,
  preferenceType: PreferenceType | "None",
) {
  const { group, subGroup, instance } = params;
  const userId = studentId;
  await db.$transaction(async (tx) => {
    if (preferenceType === "None") {
      await tx.preference.delete({
        where: {
          preferenceId: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            projectId,
            userId,
          },
        },
      });
      return;
    }

    const [{ rank: maxRank }] = await tx.preference.findMany({
      where: {
        allocationGroupId: group,
        allocationSubGroupId: subGroup,
        allocationInstanceId: instance,
        userId,
        type: preferenceType,
      },
      select: { rank: true },
      orderBy: { rank: "desc" },
      take: 1,
    });

    await tx.preference.upsert({
      where: {
        preferenceId: {
          allocationGroupId: group,
          allocationSubGroupId: subGroup,
          allocationInstanceId: instance,
          projectId,
          userId,
        },
      },
      create: {
        allocationGroupId: group,
        allocationSubGroupId: subGroup,
        allocationInstanceId: instance,
        projectId,
        userId,
        type: preferenceType,
        rank: maxRank + 1,
      },
      update: {
        type: preferenceType,
        rank: maxRank + 1,
      },
    });
  });
}
