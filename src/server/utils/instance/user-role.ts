import { PrismaClient, Role } from "@prisma/client";

import { PrismaTransactionClient } from "@/lib/db";
import { User } from "@/lib/validations/auth";
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

export async function getAllUserRoles(
  db: PrismaTransactionClient,
  user: User,
  params: InstanceParams,
) {
  const roles: Role[] = [];

  const admin = await checkAdminPermissions(db, params, user.id);
  if (admin) roles.push(Role.ADMIN);

  const userInInstance = await db.userInInstance.findFirst({
    where: { userId: user.id },
    select: { role: true },
  });
  if (userInInstance) roles.push(userInInstance.role);

  return new Set(roles);
}
