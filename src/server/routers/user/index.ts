import { AdminLevel, AllocationInstance, Role } from "@prisma/client";
import { z } from "zod";

import { permissionCheck } from "@/lib/utils/permissions/permission-check";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  roleAwareProcedure,
} from "@/server/trpc";
import { getUserRole } from "@/server/utils/user-role";

import { isInstancePath } from "./_utils/is-instance-path";
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

  adminLevel: adminProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;

    const data = await ctx.db.adminInSpace.findMany({
      where: { userId: user.id },
      select: { adminLevel: true },
    });

    const adminLevels = data.map(({ adminLevel }) => adminLevel);
    const highestLevel = getHighestAdminLevel(adminLevels);

    return highestLevel;
  }),

  adminLevelInGroup: adminProcedure
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

  adminLevelInSubGroup: adminProcedure
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

  adminPanelRoute: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session) return;

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

  canAccessAllSegments: publicProcedure
    .input(z.object({ segments: z.array(z.string()) }))
    .query(async ({ ctx, input: { segments } }) => {
      const inInstance = isInstancePath(segments);

      if (!inInstance) return false;
      if (!ctx.session || !ctx.session.user) return false;

      const instanceParams = {
        group: segments[0],
        subGroup: segments[1],
        instance: segments[2],
      };

      const role = await getUserRole(ctx.db, ctx.session.user, instanceParams);

      return role === Role.ADMIN;
    }),

  instances: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session) return [];

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
});

function getHighestAdminLevel(adminLevels: AdminLevel[]) {
  return adminLevels.reduce(
    (acc, val) => (permissionCheck(acc, val) ? acc : val),
    AdminLevel.SUB_GROUP,
  );
}
