import { z } from "zod";

import { slugify } from "@/lib/utils/general/slugify";
import {
  groupParamsSchema,
  subGroupParamsSchema,
} from "@/lib/validations/params";
import { adminProcedure, createTRPCRouter } from "@/server/trpc";
import { isSuperAdmin } from "@/server/utils/is-super-admin";
import { AdminLevel } from "@prisma/client";
import { isAdminInSpace } from "@/server/utils/is-admin-in-space";

export const groupRouter = createTRPCRouter({
  subGroupManagement: adminProcedure
    .input(z.object({ params: groupParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group },
        },
      }) => {
        const userId = ctx.session.user.id;

        const data = await ctx.db.allocationGroup.findFirstOrThrow({
          where: { id: group },
          select: { displayName: true, allocationSubGroups: true },
        });

        const groupAdmins = await ctx.db.adminInSpace.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: null,
            adminLevel: AdminLevel.GROUP,
          },
          select: { user: { select: { id: true, name: true, email: true } } },
        });

        const superAdmin = await isSuperAdmin(ctx.db, userId);
        if (superAdmin) {
          const adminLevel = AdminLevel.SUPER;
          return { adminLevel, groupAdmins, ...data };
        }

        const { adminLevel } = await ctx.db.adminInSpace.findFirstOrThrow({
          where: { allocationGroupId: group, userId: userId },
          select: { adminLevel: true },
        });

        return { adminLevel, groupAdmins, ...data };
      },
    ),

  takenNames: adminProcedure
    .input(z.object({ params: groupParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group },
        },
      }) => {
        const data = await ctx.db.allocationGroup.findFirstOrThrow({
          where: { id: group },
          select: { allocationSubGroups: { select: { displayName: true } } },
        });
        return data.allocationSubGroups.map((item) => item.displayName);
      },
    ),

  createSubGroup: adminProcedure
    .input(z.object({ params: groupParamsSchema, name: z.string() }))
    .mutation(
      async ({
        ctx,
        input: {
          params: { group },
          name,
        },
      }) => {
        await ctx.db.allocationSubGroup.create({
          data: {
            displayName: name,
            id: slugify(name),
            allocationGroupId: group,
          },
        });
      },
    ),

  deleteSubGroup: adminProcedure
    .input(z.object({ params: subGroupParamsSchema }))
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup },
        },
      }) => {
        await ctx.db.allocationSubGroup.delete({
          where: {
            subGroupId: {
              allocationGroupId: group,
              id: subGroup,
            },
          },
        });
      },
    ),

  addAdmin: adminProcedure
    .input(
      z.object({
        params: groupParamsSchema,
        schoolId: z.string(),
        name: z.string(),
        email: z.string(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group },
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
            adminLevel: AdminLevel.GROUP,
          },
        });
      },
    ),

  removeAdmin: adminProcedure
    .input(z.object({ params: groupParamsSchema, userId: z.string() }))
    .mutation(
      async ({
        ctx,
        input: {
          params: { group },
          userId,
        },
      }) => {
        const { systemId } = await ctx.db.adminInSpace.findFirstOrThrow({
          where: { allocationGroupId: group, userId },
        });

        await ctx.db.adminInSpace.delete({
          where: { systemId },
        });
      },
    ),
});
