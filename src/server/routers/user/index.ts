import { AdminLevel } from "@prisma/client";
import { z } from "zod";

import { permissionCheck } from "@/lib/utils/permissions/permission-check";
import { validatedSegmentsSchema } from "@/lib/validations/breadcrumbs";
import { instanceParamsSchema } from "@/lib/validations/params";
import { instanceDisplayDataSchema } from "@/lib/validations/spaces";

import {
  createTRPCRouter,
  instanceProcedure,
  protectedProcedure,
  publicProcedure,
  roleAwareProcedure,
} from "@/server/trpc";
import { isSuperAdmin } from "@/server/utils/admin/is-super-admin";
import { getAllUserRoles } from "@/server/utils/instance/user-role";
import { partitionSpaces } from "@/server/utils/space/partition";

import { hasSelfDefinedProject } from "./_utils/get-self-defined-project";
import {
  getDisplayNameMap,
  getInstancesForGroups,
  getInstancesForSubGroups,
} from "./_utils/instance";
import { validateSegments } from "./_utils/user-breadcrumbs";
import { studentRouter } from "./student";
import { supervisorRouter } from "./supervisor";

export const userRouter = createTRPCRouter({
  student: studentRouter,
  supervisor: supervisorRouter,

  get: protectedProcedure.query(async ({ ctx }) => ctx.session.user),

  role: roleAwareProcedure.query(async ({ ctx }) => ctx.session.user.role),

  roles: instanceProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(async ({ ctx, input: { params } }) => {
      const user = ctx.session.user;
      const roles = await getAllUserRoles(ctx.db, user, params);
      return roles;
    }),

  hasSelfDefinedProject: roleAwareProcedure.query(
    async ({ ctx, input: { params } }) => {
      const user = ctx.session.user;
      const roles = await getAllUserRoles(ctx.db, user, params);
      return await hasSelfDefinedProject(ctx.db, params, user, roles);
    },
  ),

  /**
   * @deprecated
   */
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

  /**
   * @deprecated
   */
  adminLevelInGroup: protectedProcedure
    .input(z.object({ group: z.string() }))
    .query(async ({ ctx, input: { group } }) => {
      const user = ctx.session.user;

      const data = await ctx.db.adminInSpace.findMany({
        where: {
          userId: user.id,
          allocationGroupId: group,
          allocationSubGroupId: null,
        },
        select: { adminLevel: true },
      });

      const adminLevels = data.map(({ adminLevel }) => adminLevel);
      const highestLevel = getHighestAdminLevel(adminLevels);

      return highestLevel;
    }),

  /**
   * @deprecated
   */
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

  // TODO: replace with new implementation that returns list of admin panels
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

  /**
   * @deprecated
   */
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

  instances: publicProcedure
    .output(z.array(instanceDisplayDataSchema))
    .query(async ({ ctx }) => {
      if (!ctx.session || !ctx.session.user) return [];

      const user = ctx.session.user;

      const getDisplayData = await getDisplayNameMap(ctx.db);

      // if the user is a super-admin return all instances
      const superAdmin = await isSuperAdmin(ctx.db, user.id);
      if (superAdmin) {
        const allInstances = await ctx.db.allocationInstance.findMany({});
        return allInstances.map((e) =>
          getDisplayData({
            group: e.allocationGroupId,
            subGroup: e.allocationSubGroupId,
            instance: e.id,
          }),
        );
      }

      // can safely assert that the user is not a super-admin

      // user has some role in these instances (student or supervisor)
      const allocationInstances = await ctx.db.userInInstance.findMany({
        where: { userId: user.id },
        select: {
          allocationGroupId: true,
          allocationSubGroupId: true,
          allocationInstanceId: true,
        },
      });

      // user is an admin in these spaces
      const nonInstanceSpaces = await ctx.db.adminInSpace.findMany({
        where: { userId: user.id },
        select: {
          allocationGroupId: true,
          allocationSubGroupId: true,
        },
      });

      // user might be a group admin and a sub-group admin
      // in that case we don't need to check the sub-group instances, since we will get them from the group instances
      const { groups, subGroups } = partitionSpaces(nonInstanceSpaces);

      // now I just need to collect and format all the instances that:
      // - the user is a group admin in
      // - the user is a sub-group admin in
      // - the user is not an admin in (student or supervisor)

      const g_instances = await getInstancesForGroups(ctx.db, groups);

      const s_instances = await getInstancesForSubGroups(ctx.db, subGroups);

      // these are all the instances that the user is not also an admin in
      const u_instances = allocationInstances
        .filter((e) => {
          const coveredByGroups = groups
            .map((g) => g.group)
            .includes(e.allocationGroupId);
          if (coveredByGroups) return false;

          const coveredBySubGroups = subGroups
            .map((s) => s.subGroup)
            .includes(e.allocationSubGroupId);
          return !coveredBySubGroups;
        })
        .map((e) => ({
          group: e.allocationGroupId,
          subGroup: e.allocationSubGroupId,
          instance: e.allocationInstanceId,
        }));

      const allInstances = [...g_instances, ...s_instances, ...u_instances];
      return allInstances.map(getDisplayData);
    }),

  breadcrumbs: publicProcedure
    .input(z.object({ segments: z.array(z.string()) }))
    .output(z.array(validatedSegmentsSchema))
    .query(async ({ ctx, input }) => {
      if (!ctx.session || !ctx.session.user) return [];
      const user = ctx.session.user;
      return await validateSegments(ctx.db, input.segments, user.id);
    }),

  joinInstance: instanceProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        await ctx.db.userInInstance.update({
          where: {
            instanceMembership: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              userId: ctx.session.user.id,
            },
          },
          data: { joined: true },
        });
      },
    ),
});

// TODO: remove once all references are removed
function getHighestAdminLevel(adminLevels: AdminLevel[]) {
  return adminLevels.reduce(
    (acc, val) => (permissionCheck(acc, val) ? acc : val),
    AdminLevel.NONE,
  );
}
