import { slugify } from "@/lib/utils";
import { createTRPCRouter, publicProcedure } from "@/server/trpc";
import { z } from "zod";
import { groupRouter } from "./group";
import { instanceRouter } from "./instance";
import { subGroupRouter } from "./sub-group";

export const institutionRouter = createTRPCRouter({
  group: groupRouter,
  subGroup: subGroupRouter,
  instance: instanceRouter,

  getAllGroups: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.allocationGroup.findMany({});
  }),

  getAllGroupNames: publicProcedure.query(async ({ ctx }) => {
    return (
      await ctx.db.allocationGroup.findMany({
        select: {
          displayName: true,
        },
      })
    ).map((item) => item.displayName);
  }),

  getSuperAdmin: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.superAdmin.findFirstOrThrow({});
  }),

  createGroup: publicProcedure
    .input(
      z.object({
        groupName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { groupName } }) => {
      const superAdmin = await ctx.db.superAdmin.findFirstOrThrow({});

      await ctx.db.allocationGroup.create({
        data: {
          slug: slugify(groupName),
          displayName: groupName,
          superAdminId: superAdmin.id,
        },
      });
    }),
});
