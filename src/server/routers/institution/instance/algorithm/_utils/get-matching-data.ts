import {
  AllocationInstance,
  PreferenceType,
  PrismaClient,
} from "@prisma/client";

export async function getMatchingData(
  db: PrismaClient,
  allocationInstance: AllocationInstance,
) {
  const {
    allocationGroupId: group,
    allocationSubGroupId: subGroup,
    id: instance,
    minPreferences,
    maxPreferences,
  } = allocationInstance;

  return await db.$transaction(async (tx) => {
    const studentData = await tx.studentDetails.findMany({
      where: {
        allocationGroupId: group,
        allocationSubGroupId: subGroup,
        allocationInstanceId: instance,
        submittedPreferences: true,
      },
      select: {
        userId: true,
        userInInstance: {
          select: {
            studentPreferences: {
              where: { type: { equals: PreferenceType.PREFERENCE } },
              select: {
                project: { select: { id: true, supervisorId: true } },
                rank: true,
              },
              orderBy: { rank: "asc" },
            },
          },
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
      .filter(
        ({ userInInstance: { studentPreferences } }) =>
          studentPreferences.length >= minPreferences &&
          studentPreferences.length <= maxPreferences,
      )
      .map(({ userId, userInInstance: { studentPreferences } }) => ({
        id: userId,
        preferences: studentPreferences.map(({ project }) => project.id),
      }));

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
