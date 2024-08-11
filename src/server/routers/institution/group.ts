import { AdminLevel } from "@prisma/client";
import { z } from "zod";

import { slugify } from "@/lib/utils/general/slugify";
import {
  groupParamsSchema,
  subGroupParamsSchema,
} from "@/lib/validations/params";

import { newAdminSchema } from "@/lib/validations/add-admins/new-admin";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/trpc";
import { isAdminInGroup_v2 } from "@/server/utils/is-group-admin";
import { isSuperAdmin } from "@/server/utils/is-super-admin";
import { TRPCClientError } from "@trpc/client";

export const groupRouter = createTRPCRouter({
  exists: protectedProcedure
    .input(z.object({ params: groupParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group },
        },
      }) => {
        return await ctx.db.allocationGroup.findFirst({
          where: { id: group },
        });
      },
    ),

  access: protectedProcedure
    .input(z.object({ params: groupParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group },
        },
      }) => {
        const user = ctx.session.user;

        const superAdmin = await isSuperAdmin(ctx.db, user.id);
        if (superAdmin) return true;

        const admin = await ctx.db.adminInSpace.findFirst({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: null,
            userId: user.id,
          },
        });
        return !!admin;
      },
    ),

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

        return { groupAdmins, ...data };
      },
    ),

  takenSubGroupNames: adminProcedure
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

  // TODO: refactor after auth is implemented
  addAdmin: adminProcedure
    .input(
      z.object({
        params: groupParamsSchema,
        newAdmin: newAdminSchema,
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group },
          newAdmin: { institutionId, name, email },
        },
      }) => {
        await ctx.db.$transaction(async (tx) => {
          const exists = await isAdminInGroup_v2(tx, institutionId, { group });
          if (exists) throw new TRPCClientError("User is already an admin");

          let user = await tx.user.findFirst({
            where: { id: institutionId, email },
          });

          if (!user) {
            try {
              user = await tx.user.create({
                data: {
                  id: institutionId,
                  name,
                  email,
                },
              });
            } catch (e) {
              throw new TRPCClientError("GUID and email do not match");
            }
          }

          await tx.adminInSpace.create({
            data: {
              userId: user.id,
              allocationGroupId: group,
              allocationSubGroupId: null,
              adminLevel: AdminLevel.GROUP,
            },
          });
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
          where: {
            allocationGroupId: group,
            allocationSubGroupId: null,
            userId,
          },
        });

        await ctx.db.adminInSpace.delete({ where: { systemId } });
      },
    ),
});
