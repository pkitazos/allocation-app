import { PrismaClient, Role } from "@prisma/client";
import { User } from "next-auth";

import { InstanceParams } from "@/lib/validations/params";

import { checkAdminPermissions } from "../admin/access";

export async function getUserRole(
  db: PrismaClient,
  user: User,
  params: InstanceParams,
) {
  const isAdmin = await checkAdminPermissions(db, params, user.id);
  if (isAdmin) return Role.ADMIN;

  const userInInstance = await db.userInInstance.findFirstOrThrow({
    where: {
      allocationGroupId: params.group,
      allocationSubGroupId: params.subGroup,
      allocationInstanceId: params.instance,
      userId: user.id,
    },
  });

  return userInInstance.role;
}
