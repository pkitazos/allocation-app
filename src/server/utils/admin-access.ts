import { PrismaClient } from "@prisma/client";

import {
  GroupParams,
  groupParamsSchema,
  InstanceParams,
  SpaceParams,
  SubGroupParams,
  subGroupParamsSchema,
} from "@/lib/validations/params";
import { isSuperAdmin } from "./is-super-admin";

export async function adminAccess(
  db: PrismaClient,
  userId: string,
  params: SpaceParams,
) {
  const result = subGroupParamsSchema.safeParse(params);

  if (!result.success) {
    const { group } = groupParamsSchema.parse(params);

    const access = await db.adminInSpace.findFirst({
      where: {
        allocationGroupId: group,
        allocationSubGroupId: null,
        userId,
      },
    });
    return !!access;
  }

  const { group, subGroup } = result.data;

  const access = await db.adminInSpace.findFirst({
    where: {
      allocationGroupId: group,
      userId,
      OR: [{ allocationSubGroupId: subGroup }, { allocationSubGroupId: null }],
    },
  });
  return !!access;
}

async function isAdminInInstance(
  db: PrismaClient,
  params: InstanceParams,
  userId: string,
) {
  const admin = await db.adminInSpace.findFirst({
    where: {
      allocationGroupId: params.group,
      allocationSubGroupId: params.subGroup,
      userId,
    },
  });
  return !!admin;
}

async function isAdminInSubgroup(
  db: PrismaClient,
  params: SubGroupParams,
  userId: string,
) {
  const admin = await db.adminInSpace.findFirst({
    where: {
      allocationGroupId: params.group,
      allocationSubGroupId: params.subGroup,
      userId,
    },
  });
  return !!admin;
}

async function isAdminInGroup(
  db: PrismaClient,
  params: GroupParams,
  userId: string,
) {
  const admin = await db.adminInSpace.findFirst({
    where: {
      allocationGroupId: params.group,
      allocationSubGroupId: null,
      userId,
    },
  });
  return !!admin;
}

export async function checkAdminPermissions(
  db: PrismaClient,
  params: SpaceParams,
  userId: string,
): Promise<{ membership: boolean; params: SpaceParams }> {
  const superAdmin = await isSuperAdmin(db, userId);
  if (superAdmin) {
    return { membership: true, params };
  }

  if ("instance" in params) {
    const membership = await isAdminInInstance(db, params, userId);
    return { membership, params };
  }

  if ("subGroup" in params) {
    const membership = await isAdminInSubgroup(db, params, userId);
    return { membership, params };
  }

  if ("group" in params) {
    const membership = await isAdminInGroup(db, params, userId);
    return { membership, params };
  }

  throw new Error("Invalid params");
}
