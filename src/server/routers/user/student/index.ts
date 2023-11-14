import { createTRPCRouter, publicProcedure } from "@/server/trpc";
import { preferenceRouter } from "./preference";
import { shortlistRouter } from "./shortlist";
import { z } from "zod";
import { db } from "@/lib/prisma";

export const studentRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ input: { studentId } }) => {
      return await db.student.findFirstOrThrow({
        where: {
          id: studentId,
        },
      });
    }),

  getAllPreferences: publicProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ input: { studentId } }) => {
      return await db.student.findFirstOrThrow({
        where: { id: studentId },
        include: {
          shortlist: true,
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
    .query(async ({ input: { studentId } }) => {
      const data = await db.studentInInstance.findMany({
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
