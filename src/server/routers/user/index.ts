import { AdminLevel, AllocationInstance, Role } from "@prisma/client";
import { z } from "zod";

import { permissionCheck } from "@/lib/utils/permissions/permission-check";
import { validatedSegmentsSchema } from "@/lib/validations/breadcrumbs";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  roleAwareProcedure,
} from "@/server/trpc";

import { getSelfDefinedProject } from "./_utils/get-self-defined-project";
import { validateSegments } from "./_utils/user-breadcrumbs";
import {
  formatInstanceData,
  getGroupInstances,
  getSubGroupInstances,
  getUserInstances,
} from "./_utils/user-instances";
import { studentRouter } from "./student";
import { supervisorRouter } from "./supervisor";

export const userRouter = createTRPCRouter({
  student: studentRouter,
  supervisor: supervisorRouter,

  get: protectedProcedure.query(async ({ ctx }) => ctx.session.user),

  role: roleAwareProcedure.query(async ({ ctx }) => ctx.session.user.role),

  hasSelfDefinedProject: roleAwareProcedure.query(
    async ({ ctx, input: { params } }) => {
      if (ctx.session.user.role !== Role.STUDENT) return false;
      const studentId = ctx.session.user.id;
      return !!(await getSelfDefinedProject(ctx.db, params, studentId));
    },
  ),

  adminLevel: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;

    const data = await ctx.db.adminInSpace.findMany({
      where: { userId: user.id },
      select: { adminLevel: true },
    });

    const adminLevels = data.map(({ adminLevel }) => adminLevel);
    const highestLevel = getHighestAdminLevel(adminLevels);

    return highestLevel;
  }),

  adminLevelInGroup: protectedProcedure
    .input(z.object({ group: z.string() }))
    .query(async ({ ctx, input: { group } }) => {
      const user = ctx.session.user;

      const data = await ctx.db.adminInSpace.findMany({
        where: { userId: user.id, allocationGroupId: group },
        select: { adminLevel: true },
      });

      const adminLevels = data.map(({ adminLevel }) => adminLevel);
      const highestLevel = getHighestAdminLevel(adminLevels);

      return highestLevel;
    }),

  adminLevelInSubGroup: protectedProcedure
    .input(z.object({ group: z.string(), subGroup: z.string() }))
    .query(async ({ ctx, input: { group, subGroup } }) => {
      const user = ctx.session.user;

      const data = await ctx.db.adminInSpace.findMany({
        where: {
          userId: user.id,
          allocationGroupId: group,
          allocationSubGroupId: subGroup,
        },
        select: { adminLevel: true },
      });

      const adminLevels = data.map(({ adminLevel }) => adminLevel);
      const highestLevel = getHighestAdminLevel(adminLevels);

      return highestLevel;
    }),

  getAdminPanel: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session || !ctx.session.user) return;

    const user = ctx.session.user;

    const adminSpaces = await ctx.db.adminInSpace.findMany({
      where: { userId: user.id },
      select: {
        adminLevel: true,
        allocationGroupId: true,
        allocationSubGroupId: true,
      },
    });

    if (adminSpaces.length === 0) return;

    const highestLevel = adminSpaces
      .sort((a, b) => (permissionCheck(a.adminLevel, b.adminLevel) ? 1 : 0))
      .at(0);

    if (!highestLevel) return;

    const {
      adminLevel,
      allocationGroupId: group,
      allocationSubGroupId: subGroup,
    } = highestLevel;

    // TODO: breaks if user is admin in multiple groups and/or subgroups

    if (adminLevel === "SUPER") return "/admin";
    if (adminLevel === "GROUP") return `/${group}`;
    if (adminLevel === "SUB_GROUP") return `/${group}/${subGroup}`;

    return;
  }),

  // ! deprecated
  adminPanelRoute: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session || !ctx.session.user) return;

    const user = ctx.session.user;

    const adminSpaces = await ctx.db.adminInSpace.findMany({
      where: { userId: user.id },
      select: {
        adminLevel: true,
        allocationGroupId: true,
        allocationSubGroupId: true,
      },
    });

    if (adminSpaces.length === 0) return;

    const {
      adminLevel,
      allocationGroupId: group,
      allocationSubGroupId: subGroup,
    } = adminSpaces.sort(({ adminLevel: a }, { adminLevel: b }) =>
      permissionCheck(a, b) ? 1 : 0,
    )[0];

    if (adminLevel === "SUPER") return "/admin";
    if (adminLevel === "GROUP") return `/${group}`;
    if (adminLevel === "SUB_GROUP") return `/${group}/${subGroup}`;

    return;
  }),

  instances: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session || !ctx.session.user) return [];

    const user = ctx.session.user;

    const allGroups = await ctx.db.allocationGroup.findMany({
      include: { allocationSubGroups: true },
    });

    const adminSpaces = await ctx.db.adminInSpace.findMany({
      where: { userId: user.id },
      include: {
        allocationSubGroup: { include: { allocationInstances: true } },
        allocationGroup: {
          include: {
            allocationSubGroups: { include: { allocationInstances: true } },
          },
        },
      },
    });

    if (adminSpaces.length === 0) {
      // you are not an admin anywhere
      // you are a supervisor or student
      const userInstances = await getUserInstances(ctx.db, user.id);
      return userInstances.map((instance) =>
        formatInstanceData(allGroups, instance),
      );
    }

    if (
      adminSpaces.length === 1 &&
      adminSpaces[0].adminLevel === AdminLevel.SUPER
    ) {
      // you are a super-admin
      const allInstances = await ctx.db.allocationInstance.findMany({});
      return allInstances.map((instance) =>
        formatInstanceData(allGroups, instance),
      );
    }

    // otherwise your adminSpaces array is made up of some combination of groupIds and subGroupIds
    // regardless, for each of those, I must get all its instances

    const adminInstances: AllocationInstance[] = [];

    for (const s of adminSpaces) {
      if (s.allocationGroup) {
        const instances = getGroupInstances(s.allocationGroup);
        adminInstances.push(...instances);
        continue;
      }
      if (s.allocationSubGroup) {
        const instances = getSubGroupInstances(s.allocationSubGroup);
        adminInstances.push(...instances);
        continue;
      }
    }

    return adminInstances.map((instance) =>
      formatInstanceData(allGroups, instance),
    );
  }),

  breadcrumbs: publicProcedure
    .input(z.object({ segments: z.array(z.string()) }))
    .output(z.array(validatedSegmentsSchema))
    .query(async ({ ctx, input }) => {
      if (!ctx.session || !ctx.session.user) return [];
      const user = ctx.session.user;
      return await validateSegments(ctx.db, input.segments, user.id);
    }),
});

function getHighestAdminLevel(adminLevels: AdminLevel[]) {
  return adminLevels.reduce(
    (acc, val) => (permissionCheck(acc, val) ? acc : val),
    AdminLevel.NONE,
  );
}
