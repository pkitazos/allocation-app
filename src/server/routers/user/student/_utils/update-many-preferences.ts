import { PreferenceType, PrismaClient } from "@prisma/client";

import { relativeComplement } from "@/lib/utils/general/set-difference";
import {
  getFlagFromStudentLevel,
  getStudentLevelFromFlag,
} from "@/lib/utils/permissions/get-student-level";
import { InstanceParams } from "@/lib/validations/params";

export async function updateManyPreferenceTransaction({
  db,
  params: { group, subGroup, instance },
  student,
  projectIds,
  preferenceType,
}: {
  db: PrismaClient;
  params: InstanceParams;
  student: { id: string; studentLevel: number };
  projectIds: string[];
  preferenceType: PreferenceType | "None";
}) {
  await db.$transaction(async (tx) => {
    const data = await tx.project.findMany({
      where: { id: { in: projectIds } },
      select: { flagOnProjects: { select: { flag: true } } },
    });

    const suitable = data.every((p) =>
      p.flagOnProjects.some(
        ({ flag }) => getStudentLevelFromFlag(flag) === student.studentLevel,
      ),
    );

    if (!suitable) {
      throw new Error(
        `One or more of the selected projects are not suitable for ${getFlagFromStudentLevel(student.studentLevel)} students`,
      );
    }

    if (preferenceType === "None") {
      await tx.preference.deleteMany({
        where: {
          allocationGroupId: group,
          allocationSubGroupId: subGroup,
          allocationInstanceId: instance,
          userId: student.id,
          projectId: { in: projectIds },
        },
      });
      return;
    }

    if (preferenceType === PreferenceType.SHORTLIST) {
      const alreadyInLists = await tx.preference.findMany({
        where: {
          allocationGroupId: group,
          allocationSubGroupId: subGroup,
          allocationInstanceId: instance,
          userId: student.id,
          projectId: { in: projectIds },
        },
        select: { projectId: true },
      });

      const newAdditions = relativeComplement(
        projectIds,
        alreadyInLists,
        (a, b) => a === b.projectId,
      );

      await tx.preference.createMany({
        data: newAdditions.map((id) => ({
          allocationGroupId: group,
          allocationSubGroupId: subGroup,
          allocationInstanceId: instance,
          projectId: id,
          type: preferenceType,
          rank: 1,
          userId: student.id,
        })),
      });

      await tx.preference.updateMany({
        where: {
          allocationGroupId: group,
          allocationSubGroupId: subGroup,
          allocationInstanceId: instance,
          userId: student.id,
          projectId: { in: alreadyInLists.map((p) => p.projectId) },
        },
        data: { type: preferenceType },
      });
    }

    const preferences = await tx.preference.aggregate({
      where: {
        allocationGroupId: group,
        allocationSubGroupId: subGroup,
        allocationInstanceId: instance,
        userId: student.id,
        type: preferenceType,
      },
      _max: { rank: true },
    });

    let nextRank = (preferences._max?.rank ?? 0) + 1;

    for (const projectId of projectIds) {
      await tx.preference.upsert({
        where: {
          preferenceId: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            projectId,
            userId: student.id,
          },
        },
        create: {
          allocationGroupId: group,
          allocationSubGroupId: subGroup,
          allocationInstanceId: instance,
          projectId,
          userId: student.id,
          type: preferenceType,
          rank: nextRank,
        },
        update: {
          type: preferenceType,
          rank: nextRank,
        },
      });
      nextRank++;
    }
  });
}
