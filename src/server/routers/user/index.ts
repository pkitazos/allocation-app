import { createTRPCRouter, publicProcedure } from "@/server/trpc";
import { studentRouter } from "./student";
import { supervisorRouter } from "./supervisor";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  student: studentRouter,
  supervisor: supervisorRouter,

  getRole: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input: { userId } }) => {
      return ctx.db.user.findFirstOrThrow({
        where: {
          id: userId,
        },
        select: {
          role: true,
        },
      });
    }),
});
