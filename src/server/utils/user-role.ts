import { InstanceParams } from "@/lib/validations/params";
import { PrismaClient, Role } from "@prisma/client";
import { User } from "next-auth";

export async function getUserRole(
  db: PrismaClient,
  user: User,
  params: InstanceParams,
) {
  const userInInstance = await db.userInInstance.findFirst({
    where: {
      allocationGroupId: params.group,
      allocationSubGroupId: params.subGroup,
      allocationInstanceId: params.instance,
      userId: user.id,
    },
  });

  if (!userInInstance) return Role.ADMIN;
  return userInInstance.role;
}
