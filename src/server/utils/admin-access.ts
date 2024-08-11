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
 * Verifies if a user has the necessary admin permissions within a specific space.
 *
 * @description
 * This function determines if the user possesses the required admin level
 * based on the type of space (group, sub-group, or instance) they are currently in.
 *
 * 1. Checks if the user is a super admin. If so, grants access immediately.
 *
 * 2. If the space is an instance:
 *    - Validates `params` against `instanceParamsSchema`.
 *    - Checks if the user is an admin within the instance.
 *
 * 3. If the space is a sub-group:
 *    - Validates `params` against `subGroupParamsSchema`.
 *    - Checks if the user is an admin within the group. If so, grants access.
 *    - If not a group admin, checks if the user is an admin within the sub-group.
 *
 * 4. Otherwise (if the space is a group):
 *    - Checks if the user is an admin within the group.
 *
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
