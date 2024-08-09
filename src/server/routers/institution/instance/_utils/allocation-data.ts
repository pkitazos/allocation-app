import { PrismaClient } from "@prisma/client";

import { InstanceParams } from "@/lib/validations/params";

export async function getAllocationData(
  db: PrismaClient,
  params: InstanceParams,
) {
  const { group, subGroup, instance } = params;
  return await db.projectAllocation.findMany({
    where: {
      allocationGroupId: group,
      allocationSubGroupId: subGroup,
      allocationInstanceId: instance,
    },
    select: {
      project: {
        select: {
          id: true,
          title: true,
          capacityLowerBound: true,
          capacityUpperBound: true,
          supervisor: {
            select: {
              user: { select: { id: true, name: true, email: true } },
              supervisorInstanceDetails: {
                where: {
                  allocationGroupId: group,
                  allocationSubGroupId: subGroup,
                  allocationInstanceId: instance,
                },
                select: {
                  projectAllocationLowerBound: true,
                  projectAllocationTarget: true,
                  projectAllocationUpperBound: true,
                },
              },
            },
          },
        },
      },
      student: {
        select: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
      studentRanking: true,
    },
  });
}
