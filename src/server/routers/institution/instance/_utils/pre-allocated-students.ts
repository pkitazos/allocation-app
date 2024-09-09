import { PrismaTransactionClient } from "@/lib/db";
import { InstanceParams } from "@/lib/validations/params";

export async function getPreAllocatedStudents(
  db: PrismaTransactionClient,
  params: InstanceParams,
) {
  const projectData = await db.project.findMany({
    where: {
      allocationGroupId: params.group,
      allocationSubGroupId: params.subGroup,
      allocationInstanceId: params.instance,
      preAllocatedStudentId: { not: null },
    },
    select: { preAllocatedStudentId: true },
  });

  return new Set(
    projectData.map((p) => p.preAllocatedStudentId).filter((p) => p !== null),
  );
}
