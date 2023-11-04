import { db } from "@/lib/prisma";
import { createTRPCRouter, publicProcedure } from "@/server/trpc";
import { z } from "zod";

export const shortlistRouter = createTRPCRouter({
  add: publicProcedure
    .input(z.object({ projectId: z.string(), studentId: z.string() }))
    .mutation(async ({ input: { projectId, studentId } }) => {
      return await db.shortlist.create({
        data: {
          projectId,
          studentId,
        },
      });
    }),

  remove: publicProcedure
    .input(z.object({ projectId: z.string(), studentId: z.string() }))
    .mutation(async ({ input: { projectId, studentId } }) => {
      await db.shortlist.delete({
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
    .mutation(async ({ input: { projectId, studentId } }) => {
      await db.preference.delete({
        where: {
          projectId_studentId: {
            projectId,
            studentId,
          },
        },
      });

      return await db.shortlist.create({
        data: {
          projectId,
          studentId,
        },
      });
    }),
});
