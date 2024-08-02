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

    const allPreferences = await tx.preference.findMany({
      where: {
        allocationGroupId: group,
        allocationSubGroupId: subGroup,
        allocationInstanceId: instance,
        userId: student.id,
        type: preferenceType,
      },
      select: { rank: true },
      orderBy: { rank: "desc" },
      take: 1,
    });

    const maxRank = allPreferences.at(0)?.rank ?? 0;

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
        rank: maxRank + 1,
      },
      update: {
        type: preferenceType,
        rank: maxRank + 1,
      },
    });
  });
}
