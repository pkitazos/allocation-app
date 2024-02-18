import { AdminLevel, AllocationInstance, Role } from "@prisma/client";
import { z } from "zod";

import { permissionCheck } from "@/lib/utils/permissions/permission-check";
import { instanceParamsSchema } from "@/lib/validations/params";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/trpc";
import {
  formatInstanceData,
  getGroupInstances,
  getSubGroupInstances,
  getUserInstances,
} from "@/server/utils/user-instances";

import { studentRouter } from "./student";
import { supervisorRouter } from "./supervisor";

export const userRouter = createTRPCRouter({
  student: studentRouter,
  supervisor: supervisorRouter,

  role: protectedProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const user = ctx.session.user;
        const userInInstance = await ctx.db.userInInstance.findFirst({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            userId: user.id,
          },
        });

        if (!userInInstance) return Role.ADMIN;
        return userInInstance.role;
      },
    ),

  userRole: protectedProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const user = ctx.session.user;
        const userInInstance = await ctx.db.userInInstance.findFirst({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            userId: user.id,
          },
        });

        if (!userInInstance) return { user, role: Role.ADMIN };
        return { user, role: userInInstance.role };
      },
    ),

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
    // regardless, for eac of those, I must get all its instances

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
