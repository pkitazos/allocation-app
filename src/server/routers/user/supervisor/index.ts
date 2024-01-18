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
        return await ctx.db.supervisorInInstance.findFirstOrThrow({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            supervisorId,
          },
          select: {
            supervisor: {
              select: {
                name: true,
                email: true,
                projects: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
        });
      },
    ),
});
