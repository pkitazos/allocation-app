import { AdminLevel } from "@prisma/client";
import { z } from "zod";

import { slugify } from "@/lib/utils/general/slugify";
import {
  instanceParamsSchema,
  subGroupParamsSchema,
} from "@/lib/validations/params";
import { adminProcedure, createTRPCRouter } from "@/server/trpc";
import { isSuperAdmin } from "@/server/utils/is-super-admin";

export const subGroupRouter = createTRPCRouter({
  instanceManagement: adminProcedure
    .input(z.object({ params: subGroupParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup },
        },
      }) => {
        const userId = ctx.session.user.id;
        const data = await ctx.db.allocationSubGroup.findFirstOrThrow({
          where: {
            allocationGroupId: group,
            id: subGroup,
          },
          select: {
            displayName: true,
            allocationInstances: true,
            subGroupAdmins: {
              select: { user: { select: { name: true, email: true } } },
            },
          },
        });

        const superAdmin = await isSuperAdmin(ctx.db, userId);
        if (superAdmin) return { adminLevel: AdminLevel.SUPER, ...data };

        const { adminLevel } = await ctx.db.adminInSpace.findFirstOrThrow({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            userId: userId,
          },
          select: { adminLevel: true },
        });

        return { adminLevel, ...data };
      },
    ),

  takenNames: adminProcedure
    .input(z.object({ params: subGroupParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup },
        },
      }) => {
        const data = await ctx.db.allocationSubGroup.findFirstOrThrow({
          where: { allocationGroupId: group, id: subGroup },
          select: { allocationInstances: { select: { displayName: true } } },
        });
        return data.allocationInstances.map((item) => item.displayName);
      },
    ),

  createInstance: adminProcedure
    .input(
      z.object({
        params: subGroupParamsSchema,
        name: z.string(),
        minPreferences: z.number(),
        maxPreferences: z.number(),
        maxPreferencesPerSupervisor: z.number(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup },
          name,
          minPreferences,
          maxPreferences,
          maxPreferencesPerSupervisor,
        },
      }) => {
        await ctx.db.allocationInstance.create({
          data: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            id: slugify(name),
            displayName: name,
            minPreferences,
            maxPreferences,
            maxPreferencesPerSupervisor,
          },
        });
      },
    ),

  deleteInstance: adminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        await ctx.db.allocationInstance.delete({
          where: {
            instanceId: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              id: instance,
            },
          },
        });
      },
    ),

  removeAdmin: adminProcedure
    .input(z.object({ params: subGroupParamsSchema, userId: z.string() }))
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup },
          userId,
        },
      }) => {
        const { systemId } = await ctx.db.adminInSpace.findFirstOrThrow({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            userId,
          },
        });

        await ctx.db.adminInSpace.delete({
          where: { systemId },
        });
      },
    ),
});
