import { createTRPCRouter, publicProcedure } from "@/server/trpc";
import { preferenceRouter } from "./preference";
import { shortlistRouter } from "./shortlist";
import { z } from "zod";

export const studentRouter = createTRPCRouter({
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

  shortlist: shortlistRouter,

  preference: preferenceRouter,
});
