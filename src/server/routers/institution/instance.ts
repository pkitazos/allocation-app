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
            select: { preferences: { orderBy: { rank: "asc" } } },
          },
        },
      });

      // TODO: ensure the preferences returned are only for the given instance

      // {
      //   select: {
      //     preferences: {
      //       where: {
      //         project: {
      //           allocationGroupId: groupId,
      //           allocationSubGroupId: subGroupId,
      //           allocationInstanceId: instanceId,
      //         },
      //       },
      //       orderBy: {
      //         rank: "asc",
      //       },
      //     },
      //   },
      // },

      const students = studentData.map(({ student: { preferences } }) =>
        preferences.map(({ projectId }) => projectId),
      );

      const projectData = await ctx.db.project.findMany({
        where: {
          allocationGroupId: groupId,
          allocationSubGroupId: subGroupId,
          allocationInstanceId: instanceId,
        },
      });

      const projects = projectData.map(
        ({ id }) => [0, 1, id] as [0, 1, string],
      );

      const supervisorData = await ctx.db.supervisorInInstance.findMany({
        where: {
          allocationGroupId: groupId,
          allocationSubGroupId: subGroupId,
          allocationInstanceId: instanceId,
        },
        select: {
          projectAllocationTarget: true,
          projectAllocationUpperBound: true,
        },
      });

      const lecturers = supervisorData.map(
        ({ projectAllocationTarget: t, projectAllocationUpperBound: u }) =>
          [0, t, u] as [0, number, number],
      );

      return { students, projects, lecturers };
    }),
});
