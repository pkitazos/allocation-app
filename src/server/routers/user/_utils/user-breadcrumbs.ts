import { PrismaClient, Role } from "@prisma/client";

import { unSlugify } from "@/lib/utils/general/slugify";
import { ValidatedSegments } from "@/lib/validations/breadcrumbs";
import { InstanceParams } from "@/lib/validations/params";
import { adminTabs } from "@/lib/validations/tabs/admin-panel";
import {
  instanceTabs,
  studentTabs,
  supervisorTabs,
} from "@/lib/validations/tabs/instance";

import { isGroupAdmin } from "@/server/utils/admin/is-group-admin";
import { isSubGroupAdmin } from "@/server/utils/admin/is-sub-group-admin";
import { isSuperAdmin } from "@/server/utils/admin/is-super-admin";

export async function validateSegments(
  db: PrismaClient,
  segments: string[],
  userId: string,
) {
  if (segments.length === 0) return [];

  const access = await isSuperAdmin(db, userId);
  if (access) {
    return segments.map((segment) => ({
      segment: unSlugify(segment),
      access: true,
    }));
  }

  if (segments.length === 1) {
    const access = await handle_length_1(db, segments[0], userId);
    return access;
  }

  if (segments.length === 2) {
    const access = await handle_length_2(db, segments, userId);
    return access;
  }

  return await handle_length_over_2(db, segments, userId);
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
    return [{ segment: unSlugify(segment), access }];
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
      return [
        { segment: unSlugify(group), access },
        { segment: segments[1], access },
      ];
    } else {
      const subGroup = segments[1];
      // user is in a sub-group
      // user must be a group admin in this sub-group
      // or must be a sub-group admin in this sub-group
      let access = await isGroupAdmin(db, { group }, userId);
      if (access)
        return segments.map((segment) => ({
          segment: unSlugify(segment),
          access,
        }));

      access = await isSubGroupAdmin(db, { group, subGroup }, userId);
      return [
        { segment: unSlugify(group), access: false },
        { segment: unSlugify(subGroup), access },
      ];
    }
  }
}

async function handle_length_over_2(
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
    if (access) {
      return [
        { segment: unSlugify(group), access },
        { segment: unSlugify(subGroup), access },
        { segment: segments[2], access },
      ];
    }

    access = await isSubGroupAdmin(db, { group, subGroup }, userId);
    return [
      { segment: unSlugify(group), access: false },
      { segment: unSlugify(subGroup), access },
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

  const groupAdmin = await isGroupAdmin(db, { group }, userId);
  const subGroupAdmin = await isSubGroupAdmin(db, { group, subGroup }, userId);

  const baseSegments = [
    { segment: unSlugify(group), access: groupAdmin },
    { segment: unSlugify(subGroup), access: subGroupAdmin || groupAdmin },
    { segment: unSlugify(instance), access: true },
  ];

  if (remainingSegments.length === 0) return baseSegments;

  // ! currently errors when a user does not also have a userInInstance account (i.e. is just an admin)
  // TODO: update to handle multiple roles

  const { role } = await db.userInInstance.findFirstOrThrow({
    where: {
      allocationGroupId: group,
      allocationSubGroupId: subGroup,
      allocationInstanceId: instance,
      userId,
    },
    select: { role: true },
  });

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
        remainingSegments.map((segment) => ({
          segment,
          access: true,
        })),
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
      // you are a supervisor
      const { supervisorId } = await db.project.findFirstOrThrow({
        where: { id: remainingSegments[1] },
        select: { supervisorId: true },
      });

      // only the project supervisor can see this page
      return allSegments(
        remainingSegments.map((segment) => ({
          segment,
          access: userId === supervisorId,
        })),
      );
    } else {
      // otherwise only admins can see this page
      return allSegments(
        remainingSegments.map((segment) => ({
          segment,
          access: role === Role.ADMIN,
        })),
      );
    }
  }

  throw new Error("Invalid path");

  // const possible_routes = [
  // // ---------------------- admin only
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
  //   "students",
  //   "students/[id]",
  //   "supervisors",
  //   "projects/[id]/edit", // admin + supervisor (if this is their project)
  //   "supervisors/[id]",
  // // ---------------------- student pages
  //   "my-preferences",
  //   "my-allocation",
  // // ---------------------- supervisor pages
  //   "my-projects",
  //   "my-allocations",
  //   "new-project",
  // // ---------------------- all users
  //   "projects",
  //   "projects/[id]",
  // ];
}

export const supervisorRoutes: string[] = supervisorTabs.map((tab) => tab.href);

export const studentRoutes: string[] = studentTabs.map((tab) => tab.href);

export const adminRoutes: string[] = [
  ...Object.values(adminTabs)
    .filter((tab) => tab.title === "Stage Control")
    .map((tab) => tab.href),
  instanceTabs.allProjects.href,
  instanceTabs.allSupervisors.href,
  instanceTabs.allStudents.href,
];
