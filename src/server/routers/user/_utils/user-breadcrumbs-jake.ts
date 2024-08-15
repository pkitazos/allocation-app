import { type PrismaClient } from "@prisma/client";
import {
  authoriseLastSegment,
  exampleRoutingConfiguration,
  makePermission,
  PERMISSIONS,
} from "./breadcrumbs-v2";
import { isSuperAdmin } from "@/server/utils/is-super-admin";

export async function validateSegments(
  db: PrismaClient,
  segments: string[],
  userId: string,
) {
  if (segments.length === 0) return [];

  const userPermsSet = getUserPerms(db, userId);

  return segments.map((segment, i) => ({
    segment,
    access: authoriseLastSegment(
      exampleRoutingConfiguration,
      segments.slice(0, i + 1),
      userPermsSet,
    ),
  }));
}

// TODO implement this.
async function getUserPerms(db: PrismaClient, userId: string): Set<string> {
  if (await isSuperAdmin(db, userId)) return PERMISSIONS.superAdmin;

  // @ts-expect-error TODO
  const groupAdminGroups: { "[group]": string }[] = getGroupAdminGroups();

  const subgroupAdminGroups: [];

  const segmentMapping = {
    "[group]": "groupwow",
    "[subgroup]": "subgroup-wower",
    "[instance]": "instance-socks",
    "[pid]": "project-SPA",
  };

  const projectOwnerPerm = makePermission(
    PERMISSIONS.projectOwner,
    segmentMapping,
  );

  const supervisorPerm = makePermission(PERMISSIONS.supervisor, segmentMapping);

  return new Set([projectOwnerPerm, supervisorPerm]);
}

function main() {
  validateSegments(
    // @ts-expect-error dont worry
    undefined,
    [
      "groupwow",
      "subgroup-wower",
      "instance-socks",
      "projects",
      "project-SPA",
      "edit",
    ],
    "userMe",
  ).then((e) => console.log(e));
}

main();
