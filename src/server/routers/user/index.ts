import { createTRPCRouter, publicProcedure } from "@/server/trpc";
import { z } from "zod";
import { studentRouter } from "./student";
import { supervisorRouter } from "./supervisor";

export const userRouter = createTRPCRouter({
  student: studentRouter,
  supervisor: supervisorRouter,

  role: publicProcedure
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

  adminPanelRoute: publicProcedure.query(async ({ ctx }) => {
    const session = ctx.session;
    if (!session) return "";

    const user = session.user;

    if (!user.role) return "";

    if (user.role === "SUPER_ADMIN") return "/admin";

    if (user.role === "GROUP_ADMIN") {
      const { allocationGroupId } = await ctx.db.groupAdmin.findFirstOrThrow({
        where: { id: user.id },
        select: { allocationGroupId: true },
      });
      return `/${allocationGroupId}`;
    }

    if (user.role === "SUB_GROUP_ADMIN") {
      const { allocationGroupId, allocationSubGroupId } =
        await ctx.db.subGroupAdmin.findFirstOrThrow({
          where: { id: user.id },
          select: {
            allocationGroupId: true,
            allocationSubGroupId: true,
          },
        });
      return `/${allocationGroupId}/${allocationSubGroupId}`;
    }

    return "";
  }),
});
