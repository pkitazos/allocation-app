import { z } from "zod";

import { slugify } from "@/lib/utils/general/slugify";
import {
  groupParamsSchema,
  subGroupParamsSchema,
} from "@/lib/validations/params";
import { adminProcedure, createTRPCRouter } from "@/server/trpc";
import { isSuperAdmin } from "@/server/utils/is-super-admin";
import { AdminLevel } from "@prisma/client";

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
          select: {
            displayName: true,
            allocationSubGroups: true,
            groupAdmins: {
              select: { user: { select: { name: true, email: true } } },
            },
          },
        });

        const superAdmin = await isSuperAdmin(ctx.db, userId);
        if (superAdmin) return { adminLevel: AdminLevel.SUPER, ...data };

        const { adminLevel } = await ctx.db.adminInSpace.findFirstOrThrow({
          where: { allocationGroupId: group, userId: userId },
          select: { adminLevel: true },
        });

        return { adminLevel, ...data };
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
