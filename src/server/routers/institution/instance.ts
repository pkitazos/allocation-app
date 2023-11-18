import { createTRPCRouter, publicProcedure } from "@/server/trpc";
import { z } from "zod";

export const instanceRouter = createTRPCRouter({
  getMatchingData: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
        subGroupId: z.string(),
        instanceId: z.string(),
      }),
    )
    .query(async ({ ctx, input: { groupId, subGroupId, instanceId } }) => {
      const studentData = await ctx.db.studentInInstance.findMany({
        where: {
          allocationGroupId: groupId,
          allocationSubGroupId: subGroupId,
          allocationInstanceId: instanceId,
        },
        select: {
          student: {
            select: {
              preferences: {
                where: {
                  project: {
                    allocationGroupId: groupId,
                    allocationSubGroupId: subGroupId,
                    allocationInstanceId: instanceId,
                  },
                },
                orderBy: {
                  rank: "asc",
                },
              },
            },
          },
        },
      });

      const projectData = await ctx.db.project.findMany({
        where: {
          allocationGroupId: groupId,
          allocationSubGroupId: subGroupId,
          allocationInstanceId: instanceId,
        },
      });

      const projectHashMap = new Map<string, number>();
      projectData.map(({ id }, idx) => {
        supervisorHashMap.set(id, idx + 1);
      });

      const supervisorData = await ctx.db.supervisorInInstance.findMany({
        where: {
          allocationGroupId: groupId,
          allocationSubGroupId: subGroupId,
          allocationInstanceId: instanceId,
        },
        select: {
          supervisorId: true,
          projectAllocationTarget: true,
          projectAllocationUpperBound: true,
        },
      });

      const supervisorHashMap = new Map<string, number>();
      supervisorData.map(({ supervisorId }, idx) => {
        supervisorHashMap.set(supervisorId, idx + 1);
      });

      const students = studentData.map(({ student: { preferences } }) =>
        preferences.map(({ projectId }) => projectHashMap.get(projectId)),
      );

      const projects = projectData.map(({ supervisorId }) => [
        0,
        1,
        supervisorHashMap.get(supervisorId),
      ]);

      const lecturers = supervisorData.map(
        ({ projectAllocationTarget, projectAllocationUpperBound }) => {
          return [0, projectAllocationTarget, projectAllocationUpperBound];
        },
      );

      return { students, projects, lecturers };
    }),
});
