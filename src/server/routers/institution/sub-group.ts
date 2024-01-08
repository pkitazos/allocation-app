import { slugify } from "@/lib/utils";
import { adminProcedure, createTRPCRouter } from "@/server/trpc";
import { subGroupParamsSchema } from "@/lib/validations/params";
import { z } from "zod";

export const subGroupRouter = createTRPCRouter({
  instanceManagement: adminProcedure
    .input(subGroupParamsSchema)
    .query(async ({ ctx, input: params }) => {
      const data = await ctx.db.allocationSubGroup.findFirstOrThrow({
        where: {
          allocationGroupId: params.group,
          slug: params.subGroup,
        },
        select: {
          displayName: true,
          allocationInstances: true,
          subGroupAdmins: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });
      const admin = ctx.session.user.role!;
      return { admin, ...data };
    }),

  takenNames: adminProcedure
    .input(subGroupParamsSchema)
    .query(async ({ ctx, input: params }) => {
      const data = await ctx.db.allocationSubGroup.findFirstOrThrow({
        where: {
          allocationGroupId: params.group,
          slug: params.subGroup,
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
    }),

  createInstance: adminProcedure
    .input(
      z.object({
        name: z.string(),
        groupId: z.string(),
        subGroupId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { name, groupId, subGroupId } }) => {
      await ctx.db.allocationInstance.create({
        data: {
          displayName: name,
          slug: slugify(name),
          allocationGroupId: groupId,
          allocationSubGroupId: subGroupId,
        },
      });
    }),
});
