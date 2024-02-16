import { AdminLevel } from "@prisma/client";
import { z } from "zod";

import { slugify } from "@/lib/utils/general/slugify";
import {
  instanceParamsSchema,
  subGroupParamsSchema,
} from "@/lib/validations/params";
import { adminProcedure, createTRPCRouter } from "@/server/trpc";
import { isSuperAdmin } from "@/server/utils/is-super-admin";
import { isAdminInSpace } from "@/server/utils/is-admin-in-space";

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
              select: {
                user: { select: { id: true, name: true, email: true } },
              },
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

  addAdmin: adminProcedure
    .input(
      z.object({
        params: subGroupParamsSchema,
        schoolId: z.string(),
        name: z.string(),
        email: z.string(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup },
          schoolId,
          name,
          email,
        },
      }) => {
        /**
         * check if user is already an admin in this group
         *  -> do nothing
         *
         * if user exists but is not an admin in this group
         *  -> make them an admin in this group
         *
         * if the user does not exist
         *  -> invite them
         *  -> make them an admin in this group
         *
         * */

        const alreadyAdmin = await isAdminInSpace(ctx.db, schoolId, { group });
        if (alreadyAdmin) return;

        let user = await ctx.db.user.findFirst({
          where: { id: schoolId },
        });

        if (!user) {
          // TODO: if user does not exist
          user = await ctx.db.user.create({
            data: { id: schoolId, name, email },
          });
          // -> add them to invitation list
          // -> send them an email
          // -> make them an admin in this group
        }

        await ctx.db.adminInSpace.create({
          data: {
            userId: user.id,
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            adminLevel: AdminLevel.GROUP,
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
