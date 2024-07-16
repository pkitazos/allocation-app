import { PrismaClient } from "@prisma/client";

import { InstanceParams } from "@/lib/validations/params";
import { SupervisorProjectSubmissionDetails } from "@/lib/validations/supervisor-project-submission-details";

import { computeProjectSubmissionTarget } from "./submission-target";

export async function computeSubmissionDetails(
  db: PrismaClient,
  params: InstanceParams,
): Promise<SupervisorProjectSubmissionDetails[]> {
  const data = await db.supervisorInstanceDetails.findMany({
    where: {
      allocationGroupId: params.group,
      allocationSubGroupId: params.subGroup,
      allocationInstanceId: params.instance,
    },
    select: {
      projectAllocationLowerBound: true,
      projectAllocationTarget: true,
      projectAllocationUpperBound: true,
      userId: true,
      userInInstance: {
        select: {
          supervisorProjects: { select: { allocations: true } },
        },
      },
    },
    orderBy: { userId: "asc" },
  });

  return data.map((s) => {
    const projectAllocationTarget = s.projectAllocationTarget;
    const allocatedCount = s.userInInstance.supervisorProjects
      .map((p) => p.allocations.length)
      .reduce((a, b) => a + b, 0);
    const submittedProjectsCount = s.userInInstance.supervisorProjects.length;

    return {
      userId: s.userId,
      projectAllocationTarget,
      allocatedCount,
      submittedProjectsCount,
      submissionTarget: computeProjectSubmissionTarget(
        projectAllocationTarget,
        allocatedCount,
      ),
    };
  });
}
