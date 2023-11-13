import { createTRPCRouter, publicProcedure } from "@/server/trpc";
import { groupRouter } from "./group";
import { subGroupRouter } from "./sub-group";
import { instanceRouter } from "./instance";
import { db } from "@/lib/prisma";
import { z } from "zod";
import { slugify } from "@/lib/utils";

export const institution = createTRPCRouter({
  group: groupRouter,
  subGroup: subGroupRouter,
  instance: instanceRouter,

  getAllGroups: publicProcedure.query(async () => {
    return await db.allocationGroup.findMany({});
  }),

  getGroupNames: publicProcedure.query(async () => {
    return (
      await db.allocationGroup.findMany({
        select: {
          displayName: true,
        },
      })
    ).map((item) => item.displayName);
  }),

  getSuperAdmin: publicProcedure.query(async () => {
    return await db.superAdmin.findFirstOrThrow({});
  }),

  createGroup: publicProcedure
    .input(
      z.object({
        groupName: z.string(),
      }),
    )
    .mutation(async ({ input: { groupName } }) => {
      const superAdmin = await db.superAdmin.findFirstOrThrow({});

      await db.allocationGroup.create({
        data: {
          slug: slugify(groupName),
          displayName: groupName,
          superAdminId: superAdmin.id,
        },
      });
    }),
});
