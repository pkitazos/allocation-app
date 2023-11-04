import { db } from "@/lib/prisma";
import { createTRPCRouter, publicProcedure } from "@/server/trpc";
import { FlagModel } from "@/types/zod";
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

  getWithFlag: publicProcedure
    .input(z.object({ allocationInstanceId: z.string(), flag: FlagModel }))
    .query(async ({ input: { allocationInstanceId, flag } }) => {
      return await db.project.findMany({
        where: {
          allocationInstanceId,
          flags: {
            some: {
              id: flag.id,
            },
          },
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
