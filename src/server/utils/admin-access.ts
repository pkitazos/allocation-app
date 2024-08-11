import { PrismaClient } from "@prisma/client";

import {
  GroupParams,
  groupParamsSchema,
  InstanceParams,
  instanceParamsSchema,
  RefinedSpaceParams,
  SpaceParams,
  SubGroupParams,
  subGroupParamsSchema,
} from "@/lib/validations/params";
import { isSuperAdmin } from "./is-super-admin";

// TODO: eventually deprecate
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
  { group, subGroup }: InstanceParams,
  userId: string,
) {
  const admin = await db.adminInSpace.findFirst({
    where: {
      userId,
      OR: [
        { allocationGroupId: group, allocationSubGroupId: subGroup },
        { allocationGroupId: group, allocationSubGroupId: null },
      ],
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

/**
 * 
admin procedure should check that the user is an admin in the particular space they find themselves in

that means:

- if they are in a group admin-panel, they should be at least a 
  group-admin in that group

- if they are in a sub-group admin-panel, they should be at 
  least a sub-group-admin in that sub-group

- if they are in an instance admin-panel, they must be at least 
  a sub-group-admin in the sub-group containing that instance
 */
export async function checkAdminPermissions(
  db: PrismaClient,
  params: RefinedSpaceParams,
  userId: string,
) {
  const superAdmin = await isSuperAdmin(db, userId);
  if (superAdmin) return true;

  const instanceResult = instanceParamsSchema.safeParse(params);

  if (instanceResult.success) {
    return isAdminInInstance(db, instanceResult.data, userId);
  }

  const subGroupResult = subGroupParamsSchema.safeParse(params);

  if (subGroupResult.success) {
    const inGroup = await isAdminInGroup(db, subGroupResult.data, userId);
    if (inGroup) return true;

    const inSubGroup = await isAdminInSubgroup(db, subGroupResult.data, userId);
    return inSubGroup;
  }

  return isAdminInGroup(db, params, userId);
}
