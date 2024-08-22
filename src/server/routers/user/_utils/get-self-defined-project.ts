import { PrismaClient, Role } from "@prisma/client";

import { User } from "@/lib/validations/auth";
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

export async function hasSelfDefinedProject(
  db: PrismaClient,
  params: InstanceParams,
  user: User,
  roles: Set<Role>,
) {
  if (!roles.has(Role.STUDENT)) return false;
  const studentId = user.id;
  return !!(await getSelfDefinedProject(db, params, studentId));
}
