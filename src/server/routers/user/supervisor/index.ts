import { instanceParamsSchema } from "@/lib/validations/params";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";
import { z } from "zod";

export const supervisorRouter = createTRPCRouter({
  instanceData: protectedProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        supervisorId: z.string(),
      }),
    )
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          supervisorId,
        },
      }) => {
        return await ctx.db.userInInstance.findFirstOrThrow({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            userId: supervisorId,
          },
          select: {
            user: { select: { name: true, email: true } },
            supervisorProjects: { select: { id: true, title: true } },
          },
        });
      },
    ),
});
