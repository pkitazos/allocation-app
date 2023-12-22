import { createTRPCRouter, publicProcedure } from "@/server/trpc";
import { z } from "zod";

export const preferenceRouter = createTRPCRouter({
  add: publicProcedure
    .input(z.object({ projectId: z.string(), studentId: z.string() }))
    .mutation(async ({ ctx, input: { projectId, studentId } }) => {
      const { _max: currentMax } = await ctx.db.preference.aggregate({
        _max: {
          rank: true,
        },
      });

      return await ctx.db.preference.create({
        data: {
          projectId,
          studentId,
          rank: (currentMax.rank ?? 0) + 1,
        },
      });
    }),

  remove: publicProcedure
    .input(z.object({ projectId: z.string(), studentId: z.string() }))
    .mutation(async ({ ctx, input: { projectId, studentId } }) => {
      await ctx.db.preference.delete({
        where: {
          projectId_studentId: {
            projectId,
            studentId,
          },
        },
      });
    }),

  addfromShortlist: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
        studentId: z.string(),
        rank: z.number(),
      }),
    )
    .mutation(async ({ ctx, input: { projectId, studentId, rank } }) => {
      await ctx.db.shortlist.delete({
        where: {
          projectId_studentId: {
            projectId,
            studentId,
          },
        },
      });

      if (rank === -1) {
        const { _max: currentMax } = await ctx.db.preference.aggregate({
          _max: {
            rank: true,
          },
        });
        rank = (currentMax.rank ?? 0) + 1;
      }

      return await ctx.db.preference.create({
        data: {
          projectId,
          studentId,
          rank,
        },
      });
    }),

  rerank: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
        studentId: z.string(),
        rank: z.number(),
      }),
    )
    .mutation(async ({ ctx, input: { projectId, studentId, rank } }) => {
      return await ctx.db.preference.update({
        where: {
          projectId_studentId: {
            projectId,
            studentId,
          },
        },
        data: {
          rank,
        },
      });
    }),
});
