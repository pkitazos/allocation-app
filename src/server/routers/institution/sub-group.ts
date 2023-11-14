import { db } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { createTRPCRouter, publicProcedure } from "@/server/trpc";
import { z } from "zod";

export const subGroupRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        groupSlug: z.string(),
        subGroupSlug: z.string(),
      }),
    )
    .query(async ({ input: { groupSlug, subGroupSlug } }) => {
      return await db.allocationSubGroup.findFirstOrThrow({
        where: {
          allocationGroupSlug: groupSlug,
          slug: subGroupSlug,
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
        groupSlug: z.string(),
        subGroupSlug: z.string(),
      }),
    )
    .query(async ({ input: { groupSlug, subGroupSlug } }) => {
      const data = await db.allocationSubGroup.findFirstOrThrow({
        where: {
          allocationGroupSlug: groupSlug,
          slug: subGroupSlug,
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
        groupSlug: z.string(),
        subGroupSlug: z.string(),
      }),
    )
    .mutation(async ({ input: { name, groupSlug, subGroupSlug } }) => {
      await db.allocationInstance.create({
        data: {
          displayName: name,
          slug: slugify(name),
          allocationGroupSlug: groupSlug,
          allocationSubGroupSlug: subGroupSlug,
        },
      });
    }),
});
