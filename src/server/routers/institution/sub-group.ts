import { AdminLevel, Role } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import { z } from "zod";

import { slugify } from "@/lib/utils/general/slugify";
import { newAdminSchema } from "@/lib/validations/add-admins/new-admin";
import { createdInstanceSchema } from "@/lib/validations/instance-form";
import {
  instanceParamsSchema,
  subGroupParamsSchema,
} from "@/lib/validations/params";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/trpc";
import { isAdminInSubGroup_v2 } from "@/server/utils/is-sub-group-admin";
import { isSuperAdmin } from "@/server/utils/is-super-admin";

export const subGroupRouter = createTRPCRouter({
  exists: protectedProcedure
    .input(z.object({ params: subGroupParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup },
        },
      }) => {
        return await ctx.db.allocationSubGroup.findFirst({
          where: { id: subGroup, allocationGroupId: group },
        });
      },
    ),
  access: protectedProcedure
    .input(z.object({ params: subGroupParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup },
        },
      }) => {
        const user = ctx.session.user;

        const superAdmin = await isSuperAdmin(ctx.db, user.id);
        if (superAdmin) return true;

        const groupAdmin = await ctx.db.adminInSpace.findFirst({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: null,
            userId: user.id,
          },
        });
        if (groupAdmin) return true;

        const subGroupAdmin = await ctx.db.adminInSpace.findFirst({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            userId: user.id,
          },
        });
        return !!subGroupAdmin;
      },
    ),

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

        // TODO: decouple data from db before sending to client
        return data;
      },
    ),

  takenInstanceNames: adminProcedure
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
        newInstance: createdInstanceSchema,
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup },
          newInstance: {
            instanceName,
            minPreferences,
            maxPreferences,
            maxPreferencesPerSupervisor,
            preferenceSubmissionDeadline,
            projectSubmissionDeadline,
            flags,
            tags,
          },
        },
      }) => {
        const instance = slugify(instanceName);

        await ctx.db.$transaction(async (tx) => {
          await tx.allocationInstance.create({
            data: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              id: instance,
              displayName: instanceName,
              minPreferences,
              maxPreferences,
              maxPreferencesPerSupervisor,
              preferenceSubmissionDeadline,
              projectSubmissionDeadline,
            },
          });

          await tx.flag.createMany({
            data: flags.map(({ title }) => ({
              title,
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
            })),
          });

          await tx.tag.createMany({
            data: tags.map(({ title }) => ({
              title,
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
            })),
          });

          const admins = await tx.adminInSpace.findMany({
            where: {
              OR: [
                { allocationGroupId: group, allocationSubGroupId: null },
                { allocationGroupId: group, allocationSubGroupId: subGroup },
              ],
            },
            select: { userId: true },
          });

          await tx.userInInstance.createMany({
            data: admins.map(({ userId }) => ({
              userId,
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              role: Role.ADMIN,
            })),
            skipDuplicates: true,
          });
        });
      },
    ),

  deleteInstance: adminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .mutation(
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

  // TODO: refactor after auth is implemented
  addAdmin: adminProcedure
    .input(
      z.object({
        params: subGroupParamsSchema,
        newAdmin: newAdminSchema,
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup },
          newAdmin: { institutionId, name, email },
        },
      }) => {
        await ctx.db.$transaction(async (tx) => {
          const exists = await isAdminInSubGroup_v2(tx, institutionId, {
            group,
            subGroup,
          });
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
              allocationSubGroupId: subGroup,
              adminLevel: AdminLevel.SUB_GROUP,
            },
          });
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
