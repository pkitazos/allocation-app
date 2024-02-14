import { instanceParamsSchema } from "@/lib/validations/params";
import { adminProcedure, createTRPCRouter } from "@/server/trpc";
import { z } from "zod";

export const projectRouter = createTRPCRouter({
  submissionInfo: adminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const capacities = await ctx.db.supervisorInstanceDetails.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: {
            userId: true,
            projectAllocationLowerBound: true,
            projectAllocationTarget: true,
            projectAllocationUpperBound: true,
          },
          orderBy: { userId: "asc" },
        });

        const projects = await ctx.db.project.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: { supervisorId: true, preAllocatedStudentId: true },
        });

        return capacities.map((e) => {
          const preAllocatedCount = projects.filter((p) => {
            return p.supervisorId === e.userId && p.preAllocatedStudentId;
          }).length;

          const alreadySubmitted = projects.filter((p) => {
            return p.supervisorId === e.userId && !p.preAllocatedStudentId;
          }).length;

          // submissionTarget = 2*(t-p)
          const submissionTarget =
            2 * (e.projectAllocationTarget - preAllocatedCount);

          return {
            submissionTarget,
            alreadySubmitted,
            ...e,
          };
        });
      },
    ),
});
