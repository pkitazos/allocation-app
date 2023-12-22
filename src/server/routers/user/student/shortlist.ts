import { createTRPCRouter, publicProcedure } from "@/server/trpc";
import { z } from "zod";

export const shortlistRouter = createTRPCRouter({
  add: publicProcedure
    .input(z.object({ projectId: z.string(), studentId: z.string() }))
    .mutation(async ({ ctx, input: { projectId, studentId } }) => {
      return await ctx.db.shortlist.create({
        data: {
          projectId,
          studentId,
        },
      });
    }),

  remove: publicProcedure
    .input(z.object({ projectId: z.string(), studentId: z.string() }))
    .mutation(async ({ ctx, input: { projectId, studentId } }) => {
      await ctx.db.shortlist.delete({
        where: {
          projectId_studentId: {
            projectId,
            studentId,
          },
        },
      });
    }),

  fromPreference: publicProcedure
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

      return await ctx.db.shortlist.create({
        data: {
          projectId,
          studentId,
        },
      });
    }),
});
