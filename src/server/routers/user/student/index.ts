import { instanceParamsSchema } from "@/lib/validations/params";
import {
  createTRPCRouter,
  protectedProcedure,
  stageAwareProcedure,
} from "@/server/trpc";
import { z } from "zod";
import { preferenceRouter } from "./preference";

export const studentRouter = createTRPCRouter({
  preference: preferenceRouter,

  overviewData: stageAwareProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(async ({ ctx }) => {
      const stage = ctx.stage;
      return stage;
    }),

  allocatedProject: protectedProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const user = ctx.session.user;
        return await ctx.db.projectAllocation.findFirst({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            userId: user.id,
          },
          select: {
            studentRanking: true,
            project: {
              select: {
                id: true,
                title: true,
                description: true,
                supervisor: {
                  select: { user: { select: { name: true, id: true } } },
                },
              },
            },
          },
        });
      },
    ),
});
