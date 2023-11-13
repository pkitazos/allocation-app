import { db } from "@/lib/prisma";
import { createTRPCRouter, publicProcedure } from "@/server/trpc";

export const groupRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    return await db.allocationGroup.findMany({});
  }),
});
