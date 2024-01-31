import { slugify } from "@/lib/utils";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/trpc";
import { subGroupParamsSchema } from "@/lib/validations/params";
import { z } from "zod";

export const subGroupRouter = createTRPCRouter({
  access: protectedProcedure
    .input(z.object({ params: subGroupParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup },
        },
      }) => {
        const access = await ctx.db.adminInSpace.findFirst({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            userId: ctx.session.user.id,
          },
          select: { adminLevel: true },
        });
        return access;
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

        const { adminLevel } = await ctx.db.adminInSpace.findFirstOrThrow({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            userId: ctx.session.user.id,
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
          where: {
            allocationGroupId: group,
            id: subGroup,
          },
          select: {
            allocationInstances: {
              select: {
                displayName: true,
              },
            },
          },
        });
        return data.allocationInstances.map((item) => item.displayName);
      },
    ),

  createInstance: adminProcedure
    .input(
      z.object({
        name: z.string(),
        params: subGroupParamsSchema,
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          name,
          params: { group, subGroup },
        },
      }) => {
        await ctx.db.allocationInstance.create({
          data: {
            displayName: name,
            id: slugify(name),
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
          },
        });
      },
    ),
});
