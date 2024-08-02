import { PreferenceType, PrismaClient } from "@prisma/client";

import {
  getFlagLabelFromStudentLevel,
  getStudentLevelFromFlag,
} from "@/lib/utils/permissions/get-student-level";
import { InstanceParams } from "@/lib/validations/params";

export async function updatePreferenceTransaction({
  db,
  params: { group, subGroup, instance },
  student,
  projectId,
  preferenceType,
}: {
  db: PrismaClient;
  params: InstanceParams;
  student: { id: string; studentLevel: number };
  projectId: string;
  preferenceType: PreferenceType | "None";
}) {
  await db.$transaction(async (tx) => {
    const { flagOnProjects } = await tx.project.findFirstOrThrow({
      where: { id: projectId },
      select: { flagOnProjects: { select: { flag: true } } },
    });

    const suitable = flagOnProjects.some(
      ({ flag }) => getStudentLevelFromFlag(flag) === student.studentLevel,
    );

    if (!suitable) {
      throw new Error(
        `This project is not suitable for ${getFlagLabelFromStudentLevel(student.studentLevel)} students`,
      );
    }

    if (preferenceType === "None") {
      await tx.preference.delete({
        where: {
          preferenceId: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            projectId,
            userId: student.id,
          },
        },
      });
      return;
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

    const nextRank = (preferences._max?.rank ?? 0) + 1;

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
  });
}
