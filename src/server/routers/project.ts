import { createTRPCRouter, publicProcedure } from "@/server/trpc";
import { z } from "zod";

export const projectRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ allocationInstanceId: z.string() }))
    .query(async ({ ctx, input: { allocationInstanceId } }) => {
      return await ctx.db.project.findMany({
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
    .query(async ({ ctx, input: { id } }) => {
      return await ctx.db.project.findFirstOrThrow({
        where: {
          id,
        },
        include: {
          supervisor: true,
        },
      });
    }),
});
