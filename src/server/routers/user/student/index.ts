import { createTRPCRouter, publicProcedure } from "@/server/trpc";
import { z } from "zod";
import { preferenceRouter } from "./preference";

export const studentRouter = createTRPCRouter({
  preference: preferenceRouter,

  getById: publicProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ ctx, input: { studentId } }) => {
      return await ctx.db.student.findFirstOrThrow({
        where: {
          id: studentId,
        },
      });
    }),

  getAllPreferences: publicProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ ctx, input: { studentId } }) => {
      return await ctx.db.student.findFirstOrThrow({
        where: { id: studentId },
        include: {
          preferences: {
            orderBy: {
              rank: "asc",
            },
          },
        },
      });
    }),

  getMyInstances: publicProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ ctx, input: { studentId } }) => {
      const data = await ctx.db.studentInInstance.findMany({
        where: {
          studentId,
        },
        include: {
          allocationInstance: true,
        },
      });
      return data.map((item) => item.allocationInstance);
    }),
});
