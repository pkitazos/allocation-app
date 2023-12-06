import { db } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { createTRPCRouter, publicProcedure } from "@/server/trpc";
import { z } from "zod";

export const groupRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ input: { groupId } }) => {
      console.log(groupId);

      return await db.allocationGroup.findFirstOrThrow({
        where: {
          slug: groupId,
        },
        include: {
          groupAdmins: true,
          allocationSubGroups: true,
        },
      });
    }),

  getAllSubGroupNames: publicProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ input: { groupId } }) => {
      const data = await db.allocationGroup.findFirstOrThrow({
        where: {
          slug: groupId,
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
    .input(z.object({ groupId: z.string(), name: z.string() }))
    .mutation(async ({ input: { groupId, name } }) => {
      await db.allocationSubGroup.create({
        data: {
          displayName: name,
          slug: slugify(name),
          allocationGroupId: groupId,
        },
      });
    }),
});
