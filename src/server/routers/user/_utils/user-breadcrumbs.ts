import { ValidatedSegments } from "@/lib/validations/breadcrumbs";
import {
  adminRoutes,
  instanceTabs,
  studentRoutes,
  supervisorRoutes,
} from "@/lib/validations/instance-tabs";
import { InstanceParams } from "@/lib/validations/params";
import { isGroupAdmin } from "@/server/utils/is-group-admin";
import { isSubGroupAdmin } from "@/server/utils/is-sub-group-admin";
import { isSuperAdmin } from "@/server/utils/is-super-admin";
import { PrismaClient, Role } from "@prisma/client";

export async function validateSegments(
  db: PrismaClient,
  segments: string[],
  userId: string,
) {
  if (segments.length === 0) return [];

  let access = await isSuperAdmin(db, userId);
  if (access) return segments.map((segment) => ({ segment, access: true }));

  if (segments.length === 1) {
    const access = await handle_length_1(db, segments[0], userId);
    return access;
  }

  if (segments.length === 2) {
    const hello = await handle_length_2(db, segments, userId);
    return hello;
  }

  return await handle_length_3(db, segments, userId);
}

async function handle_length_1(
  db: PrismaClient,
  segment: string,
  userId: string,
) {
  // const possible_routes = [
  //   "admin",
  //   "[group]",
  // ];

  if (segment === "admin") {
    // user must be a super-admin
    return [{ segment, access: false }];
  } else {
    // user is in a group admin-panel
    // user must be a group admin
    const access = await isGroupAdmin(db, { group: segment }, userId);
    return [{ segment, access }];
  }
}

async function handle_length_2(
  db: PrismaClient,
  segments: string[],
  userId: string,
) {
  // const possible_routes = [
  //   "admin/create-group",
  //   "[group]/create-sub-group",
  //   "[group]/[subGroup]",
  // ];

  const group = segments[0];
  if (segments[0] === "admin") {
    return segments.map((segment) => ({ segment, access: false }));
  } else {
    // user is in a group
    // const access = await isGroupAdmin(db, { group: segments[0] }, userId);
    // if (access) return true
    if (segments[1] === "create-sub-group") {
      // user must be a group admin
      const access = await isGroupAdmin(db, { group }, userId);
      return segments.map((segment) => ({ segment, access }));
    } else {
      const subGroup = segments[1];
      // user is in a sub-group
      // user must be a group admin in this sub-group
      // or must be a sub-group admin in this sub-group
      let access = await isGroupAdmin(db, { group }, userId);
      if (access) return segments.map((segment) => ({ segment, access }));

      access = await isSubGroupAdmin(db, { group, subGroup }, userId);
      return [
        { segment: group, access: false },
        { segment: subGroup, access },
      ];
    }
  }
}

async function handle_length_3(
  db: PrismaClient,
  segments: string[],
  userId: string,
) {
  // const possible_routes = [
  //   "[group]/[subGroup]/create-instance",
  //   "[group]/[subGroup]/[instance]",
  // ];

  const group = segments[0];
  const subGroup = segments[1];
  // user is in an instance or they are trying to create an instance
  if (segments[2] === "create-instance") {
    // user is trying to create an instance
    // user should be a sub-group admin in this sub-group
    // or a group admin in the parent group
    let access = await isGroupAdmin(db, { group }, userId);
    if (access) return segments.map((segment) => ({ segment, access }));

    access = await isSubGroupAdmin(db, { group, subGroup }, userId);
    return [
      { segment: group, access: false },
      { segment: subGroup, access },
      { segment: segments[2], access },
    ];
  } else {
    // user is in an instance
    // so the third segment is the instance ID
    const instance = segments[2];
    const params = { group, subGroup, instance };
    return await handle_in_instance(db, params, segments, userId);
  }
}

async function handle_in_instance(
  db: PrismaClient,
  { group, subGroup, instance }: InstanceParams,
  segments: string[],
  userId: string,
) {
  const remainingSegments = segments.slice(3);
  // user is in an instance
  // if this instance does not exist, i.e. if we're at the not-found page
  // then no route segment should be clickable
  // if this instance does exist
  // then users should be able to click stuff based on their role
  const { role } = await db.userInInstance.findFirstOrThrow({
    where: {
      allocationGroupId: group,
      allocationSubGroupId: subGroup,
      allocationInstanceId: instance,
      userId,
    },
    select: { role: true },
  });

  // if the user is an admin
  // check their level
  // if they are a group admin they can see everything
  // if they are a sub-group admin they can see everything except the group settings

  let baseSegments: ValidatedSegments[] = [];
  if (role !== Role.ADMIN) {
    baseSegments = segments.map((segment) => ({ segment, access: false }));
  }

  let access = await isGroupAdmin(db, { group }, userId);
  if (access) {
    baseSegments = segments.map((segment) => ({ segment, access }));
  }

  access = await isSubGroupAdmin(db, { group, subGroup }, userId);
  baseSegments = [
    { segment: group, access: false },
    { segment: subGroup, access },
    { segment: instance, access: true },
  ];

  if (remainingSegments.length === 0) return baseSegments;

  const allSegments = (rest: ValidatedSegments[]) => [...baseSegments, ...rest];

  if (remainingSegments.length === 1) {
    const segment = remainingSegments[0];
    if (adminRoutes.includes(segment)) {
      // user is in the admin panel
      // user must be a group admin
      return allSegments([{ segment, access: role === Role.ADMIN }]);
    } else if (supervisorRoutes.includes(segment)) {
      // user is in the supervisor panel
      // user must be a supervisor
      return allSegments([{ segment, access: role === Role.SUPERVISOR }]);
    } else if (studentRoutes.includes(segment)) {
      // user is in the student panel
      // user must be a student
      return allSegments([{ segment, access: role === Role.STUDENT }]);
    }
  }

  if (remainingSegments.length === 2) {
    if (remainingSegments[0] === instanceTabs.allProjects.href) {
      // all users can see the projects pages
      return allSegments(
        remainingSegments.map((segment) => ({ segment, access: true })),
      );
    } else {
      // only admins can see the student and supervisor pages
      return allSegments(
        remainingSegments.map((segment) => ({
          segment,
          access: role === Role.ADMIN,
        })),
      );
    }
  }

  if (remainingSegments.length === 3) {
    // you are in the edit project page
    if (role === Role.SUPERVISOR) {
      const { supervisorId } = await db.project.findFirstOrThrow({
        where: { id: remainingSegments[1] },
        select: { supervisorId: true },
      });

      return allSegments(
        remainingSegments.map((segment) => ({
          segment,
          access: userId === supervisorId,
        })),
      );
    }

    return allSegments(
      remainingSegments.map((segment) => ({
        segment,
        access: role === Role.ADMIN,
      })),
    );
  }

  throw new Error("Invalid path");

  // // the remaining segments can be
  // const possible_routes = [
  //   // admin-panel pages
  //   "edit",
  //   "settings",
  //   "add-students",
  //   "add-supervisors",
  //   "project-submissions",
  //   "supervisor-invites",
  //   "preference-submissions",
  //   "student-invites",
  //   "algorithm-details",
  //   "algorithms-overview",
  //   "manual-changes",
  //   "export-to-csv",
  //   "export-to-external-system",
  //   "fork-instance",
  //   "merge-instance",
  //   // admin only
  //   "students",
  //   "students/[id]",
  //   "supervisors",
  //   "supervisors/[id]",
  //   "projects/[id]/edit", // admin + supervisor (if this is their project)
  //   // student pages
  //   "my-preferences",
  //   "my-allocation",
  //   // supervisor pages
  //   "my-projects",
  //   "my-allocations",
  //   "new-project",
  //   // all users
  //   "projects",
  //   "projects/[id]",
  // ];
}
