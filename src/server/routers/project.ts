import { createTRPCRouter, protectedProcedure } from "@/server/trpc";
import { z } from "zod";

export const projectRouter = createTRPCRouter({
  getTableData: protectedProcedure
    .input(z.object({ allocationInstanceId: z.string() }))
    .query(async ({ ctx, input: { allocationInstanceId } }) => {
      const user = ctx.session.user;

      const projects = await ctx.db.project.findMany({
        where: {
          allocationInstanceId,
        },
        select: {
          id: true,
          title: true,
          description: true,
          supervisor: { select: { name: true, id: true } },
        },
      });

      return projects.map((project) => ({ ...project, user }));
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
      return await ctx.db.project.findFirstOrThrow({
        where: {
          id,
        },
        include: {
          supervisor: true,
        },
      });
    }),
});
