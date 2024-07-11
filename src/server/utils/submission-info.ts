import { InstanceParams } from "@/lib/validations/params";
import { PrismaClient } from "@prisma/client";
import { computeProjectSubmissionTarget } from "./submission-target";
import { SupervisorProjectSubmissionDetails } from "@/lib/validations/supervisor-project-submission-details";

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

export function findByUserId<T extends { userId: string }>(
  items: T[],
  userId: string,
) {
  const idx = items.findIndex((e) => e.userId === userId);
  if (idx === -1) throw new Error("User not found");
  return items[idx];
}
