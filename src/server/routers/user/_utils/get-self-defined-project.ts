import { PrismaClient } from "@prisma/client";

import { InstanceParams } from "@/lib/validations/params";

export async function getSelfDefinedProject(
  db: PrismaClient,
  params: InstanceParams,
  studentId: string,
) {
  return await db.project.findFirst({
    where: {
      allocationGroupId: params.group,
      allocationSubGroupId: params.subGroup,
      allocationInstanceId: params.instance,
      preAllocatedStudentId: studentId,
    },
  });
}
