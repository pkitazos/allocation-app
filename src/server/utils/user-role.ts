import { PrismaClient, Role } from "@prisma/client";
import { User } from "next-auth";

import { InstanceParams } from "@/lib/validations/params";

// TODO: check where this is used, figure out how we currently store and handle admins
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
