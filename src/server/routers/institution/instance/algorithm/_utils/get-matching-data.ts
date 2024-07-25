import { InstanceParams } from "@/lib/validations/params";
import { PreferenceType, PrismaClient, Role } from "@prisma/client";

export async function getMatchingData(
  db: PrismaClient,
  params: InstanceParams,
) {
  const { group, subGroup, instance } = params;
  return await db.$transaction(async (tx) => {
    const studentData = await tx.userInInstance.findMany({
      where: {
        allocationGroupId: group,
        allocationSubGroupId: subGroup,
        allocationInstanceId: instance,
        role: Role.STUDENT,
        submittedPreferences: true,
      },
      select: {
        userId: true,
        studentPreferences: {
          where: { type: { equals: PreferenceType.PREFERENCE } },
          select: { projectId: true, rank: true },
          orderBy: { rank: "asc" },
        },
      },
    });

    const supervisorData = await tx.supervisorInstanceDetails.findMany({
      where: {
        allocationGroupId: group,
        allocationSubGroupId: subGroup,
        allocationInstanceId: instance,
      },
      select: {
        userId: true,
        projectAllocationLowerBound: true,
        projectAllocationTarget: true,
        projectAllocationUpperBound: true,
      },
    });

    const projectData = await tx.project.findMany({
      where: {
        allocationGroupId: group,
        allocationSubGroupId: subGroup,
        allocationInstanceId: instance,
      },
      select: {
        id: true,
        supervisorId: true,
        capacityLowerBound: true,
        capacityUpperBound: true,
      },
    });

    const students = studentData
      .map(({ userId, studentPreferences }) => ({
        id: userId,
        preferences: studentPreferences.map(({ projectId }) => projectId),
      }))
      .filter((s) => s.preferences.length > 0);

    const projects = projectData.map(
      ({ id, supervisorId, capacityLowerBound, capacityUpperBound }) => ({
        id,
        lowerBound: capacityLowerBound,
        upperBound: capacityUpperBound,
        supervisorId,
      }),
    );

    const supervisors = supervisorData.map(
      ({
        userId,
        projectAllocationLowerBound,
        projectAllocationTarget,
        projectAllocationUpperBound,
      }) => ({
        id: userId,
        lowerBound: projectAllocationLowerBound,
        target: projectAllocationTarget,
        upperBound: projectAllocationUpperBound,
      }),
    );

    return { students, projects, supervisors };
  });
}
