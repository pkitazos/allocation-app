import { serverResponseSchema } from "@/lib/validations/algorithm";
import { instanceParamsSchema } from "@/lib/validations/params";
import { adminProcedure, createTRPCRouter } from "@/server/trpc";
import { z } from "zod";

export const matchingRouter = createTRPCRouter({
  data: adminProcedure.input(z.object({ params: instanceParamsSchema })).query(
    async ({
      ctx,
      input: {
        params: { group, subGroup, instance },
      },
    }) => {
      const studentData = await ctx.db.userInInstance.findMany({
        where: {
          allocationGroupId: group,
          allocationSubGroupId: subGroup,
          allocationInstanceId: instance,
        },
        select: {
          userId: true,
          studentPreferences: {
            where: { type: { equals: "PREFERENCE" } },
            select: { projectId: true, rank: true },
            orderBy: { rank: "asc" },
          },
        },
      });

      const supervisorData = await ctx.db.supervisorInstanceDetails.findMany({
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
      });

      const projectData = await ctx.db.project.findMany({
        where: {
          allocationGroupId: group,
          allocationSubGroupId: subGroup,
          allocationInstanceId: instance,
        },
        select: {
          id: true,
          supervisorId: true,
          capacityLowerBound: true,
          capacityUpperBound: true,
        },
      });

      const students = studentData.map(({ userId, studentPreferences }) => ({
        id: userId,
        preferences: studentPreferences.map(({ projectId }) => projectId),
      }));

      const projects = projectData.map(
        ({ id, supervisorId, capacityLowerBound, capacityUpperBound }) => ({
          id,
          lowerBound: capacityLowerBound,
          upperBound: capacityUpperBound,
          supervisorId,
        }),
      );

      const supervisors = supervisorData.map(
        ({
          userId,
          projectAllocationLowerBound,
          projectAllocationTarget,
          projectAllocationUpperBound,
        }) => ({
          id: userId,
          lowerBound: projectAllocationLowerBound,
          target: projectAllocationTarget,
          upperBound: projectAllocationUpperBound,
        }),
      );

      const data = { students, projects, supervisors };

      const allocationInstance =
        await ctx.db.allocationInstance.findFirstOrThrow({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            id: instance,
          },
          select: { selectedAlgName: true },
        });

      const selectedAlgName = allocationInstance?.selectedAlgName ?? undefined;

      return {
        matchingData: data,
        selectedAlgName,
      };
    },
  ),

  select: adminProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        algName: z.string(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          algName,
          params: { group, subGroup, instance },
        },
      }) => {
        const { selectedAlgName } =
          await ctx.db.allocationInstance.findFirstOrThrow({
            where: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              id: instance,
            },
            select: { selectedAlgName: true },
          });

        const { matchingResultData } = await ctx.db.algorithm.findFirstOrThrow({
          where: { algName },
          select: { matchingResultData: true },
        });

        const { matching } = serverResponseSchema.parse(
          JSON.parse(matchingResultData as string),
        );

        if (selectedAlgName) {
          await ctx.db.projectAllocation.deleteMany({
            where: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
            },
          });
        }

        await ctx.db.projectAllocation.createMany({
          data: matching.map(({ student_id, project_id, preference_rank }) => ({
            userId: student_id,
            projectId: project_id,
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            studentRanking: preference_rank,
          })),
        });

        await ctx.db.allocationInstance.update({
          where: {
            allocationGroupId_allocationSubGroupId_id: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              id: instance,
            },
          },
          data: { selectedAlgName: algName },
        });
      },
    ),
});
