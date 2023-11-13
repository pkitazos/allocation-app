import { createTRPCRouter, publicProcedure } from "@/server/trpc";
import { preferenceRouter } from "./preference";
import { shortlistRouter } from "./shortlist";
import { z } from "zod";
import { db } from "@/lib/prisma";

export const studentRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ allocationInstanceId: z.string() }))
    .query(async ({ input: { allocationInstanceId } }) => {
      return await db.allocationInstance.findFirstOrThrow({
        where: {
          id: allocationInstanceId,
        },
        select: {
          students: true,
        },
      });
    }),

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

  shortlist: shortlistRouter,

  preference: preferenceRouter,
});
