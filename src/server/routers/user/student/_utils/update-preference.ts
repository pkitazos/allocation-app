import { InstanceParams } from "@/lib/validations/params";
import { PreferenceType, PrismaClient } from "@prisma/client";

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

    const allPreferences = await tx.preference.groupBy({
      where: {
        allocationGroupId: group,
        allocationSubGroupId: subGroup,
        allocationInstanceId: instance,
        userId,
      },
      by: "type",
      _max: { rank: true },
    });

    const maxRankPerType = {
      [PreferenceType.PREFERENCE]:
        allPreferences.find(({ type }) => type === PreferenceType.PREFERENCE)
          ?._max.rank ?? 1,

      [PreferenceType.SHORTLIST]:
        allPreferences.find(({ type }) => type === PreferenceType.SHORTLIST)
          ?._max.rank ?? 1,
    };

    const currentPreference = await tx.preference.findFirst({
      where: {
        allocationGroupId: group,
        allocationSubGroupId: subGroup,
        allocationInstanceId: instance,
        projectId,
        userId,
      },
    });

    if (!currentPreference) {
      await tx.preference.create({
        data: {
          allocationGroupId: group,
          allocationSubGroupId: subGroup,
          allocationInstanceId: instance,
          projectId,
          userId,
          type: preferenceType,
          rank: maxRankPerType[preferenceType] + 1,
        },
      });
      return;
    }

    await tx.preference.update({
      where: {
        preferenceId: {
          allocationGroupId: group,
          allocationSubGroupId: subGroup,
          allocationInstanceId: instance,
          projectId,
          userId,
        },
      },
      data: {
        type: preferenceType,
        rank: maxRankPerType[preferenceType] + 1,
      },
    });
    return;
  });
}
