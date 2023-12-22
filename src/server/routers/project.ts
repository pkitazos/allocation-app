import { createTRPCRouter, protectedProcedure } from "@/server/trpc";
import { z } from "zod";

export const projectRouter = createTRPCRouter({
  getAll: protectedProcedure
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

  getById: protectedProcedure
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
