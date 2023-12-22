import { slugify } from "@/lib/utils";
import { createTRPCRouter, publicProcedure } from "@/server/trpc";
import { z } from "zod";

export const subGroupRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
        subGroupId: z.string(),
      }),
    )
    .query(async ({ ctx, input: { groupId, subGroupId } }) => {
      return await ctx.db.allocationSubGroup.findFirstOrThrow({
        where: {
          allocationGroupId: groupId,
          slug: subGroupId,
        },
        include: {
          subGroupAdmins: true,
          allocationInstances: true,
        },
      });
    }),

  getAllSubGroupNames: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
        subGroupId: z.string(),
      }),
    )
    .query(async ({ ctx, input: { groupId, subGroupId } }) => {
      const data = await ctx.db.allocationSubGroup.findFirstOrThrow({
        where: {
          allocationGroupId: groupId,
          slug: subGroupId,
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

  createInstance: publicProcedure
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
