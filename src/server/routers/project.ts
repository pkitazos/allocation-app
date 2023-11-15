import { db } from "@/lib/prisma";
import { createTRPCRouter, publicProcedure } from "@/server/trpc";
import { z } from "zod";

export const projectRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ allocationInstanceId: z.string() }))
    .query(async ({ input: { allocationInstanceId } }) => {
      return await db.project.findMany({
        where: {
          allocationInstanceId,
        },
        include: {
          supervisor: true,
        },
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id } }) => {
      return await db.project.findFirstOrThrow({
        where: {
          id,
        },
        include: {
          supervisor: true,
        },
      });
    }),
});
