import { db } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { createTRPCRouter, publicProcedure } from "@/server/trpc";
import { z } from "zod";

export const groupRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input: { slug } }) => {
      return await db.allocationGroup.findFirstOrThrow({
        where: {
          slug,
        },
        include: {
          groupAdmins: true,
          allocationSubGroups: true,
        },
      });
    }),

  getAllSubGroupNames: publicProcedure
    .input(z.object({ groupSlug: z.string() }))
    .query(async ({ input: { groupSlug } }) => {
      const data = await db.allocationGroup.findFirstOrThrow({
        where: {
          slug: groupSlug,
        },
        select: {
          allocationSubGroups: {
            select: {
              displayName: true,
            },
          },
        },
      });
      return data.allocationSubGroups.map((item) => item.displayName);
    }),

  createSubGroup: publicProcedure
    .input(z.object({ groupSlug: z.string(), name: z.string() }))
    .mutation(async ({ input: { groupSlug, name } }) => {
      await db.allocationSubGroup.create({
        data: {
          displayName: name,
          slug: slugify(name),
          allocationGroupSlug: groupSlug,
        },
      });
    }),
});
