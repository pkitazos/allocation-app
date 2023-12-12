import { createTRPCRouter, publicProcedure } from "@/server/trpc";
import { Stage } from "@prisma/client";
import { z } from "zod";
import { ServerResponseData, serverResponseDataSchema } from "../algorithm";

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
              id: true,
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

      // const supervisorHashMap = new Map<string, number>();
      // supervisorData.map(({ supervisorId }, idx) => {
      //   supervisorHashMap.set(supervisorId, idx + 1);
      // });

      const projectData = await ctx.db.project.findMany({
        where: {
          allocationGroupId: groupId,
          allocationSubGroupId: subGroupId,
          allocationInstanceId: instanceId,
        },
      });

      // const projectHashMap = new Map<string, number>();
      // projectData.map(({ id }, idx) => {
      //   projectHashMap.set(id, idx + 1);
      // });

      const students = studentData.map(({ student: { id, preferences } }) =>
        [id].concat(preferences.map(({ projectId }) => projectId)),
      );

      const projects = projectData.map(({ id, supervisorId }) => [
        id,
        0,
        1,
        supervisorId,
      ]) as [string, number, number, string][];

      const lecturers = supervisorData.map(
        ({
          supervisorId,
          projectAllocationTarget,
          projectAllocationUpperBound,
        }) => {
          return [
            supervisorId,
            0,
            projectAllocationTarget,
            projectAllocationUpperBound,
          ] as [string, number, number, number];
        },
      );

      return { students, projects, lecturers };
    }),

  getStage: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
        subGroupId: z.string(),
        instanceId: z.string(),
      }),
    )
    .query(async ({ ctx, input: { groupId, subGroupId, instanceId } }) => {
      const { stage } = await ctx.db.allocationInstance.findFirstOrThrow({
        where: {
          allocationGroupId: groupId,
          allocationSubGroupId: subGroupId,
          slug: instanceId,
        },
        select: {
          stage: true,
        },
      });
      return stage;
    }),

  setStage: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
        subGroupId: z.string(),
        instanceId: z.string(),
        stage: z.nativeEnum(Stage),
      }),
    )
    .mutation(
      async ({ ctx, input: { groupId, subGroupId, instanceId, stage } }) => {
        await ctx.db.allocationInstance.update({
          where: {
            allocationGroupId_allocationSubGroupId_slug: {
              allocationGroupId: groupId,
              allocationSubGroupId: subGroupId,
              slug: instanceId,
            },
          },
          data: { stage },
        });
      },
    ),
  selectMatching: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
        subGroupId: z.string(),
        instanceId: z.string(),
        algName: z.string(),
      }),
    )
    .mutation(
      async ({ ctx, input: { algName, groupId, subGroupId, instanceId } }) => {
        const matching = await ctx.db.algorithmResult.findFirstOrThrow({
          where: {
            name: algName,
            allocationGroupId: groupId,
            allocationSubGroupId: subGroupId,
            allocationInstanceId: instanceId,
          },
        });

        const result = serverResponseDataSchema.parse(
          JSON.parse(matching.data as string),
        );

        // TODO this
        // @ts-expect-error not finished
        return result.data;
      },
    ),
  getAlgorithmResult: publicProcedure
    .input(
      z.object({
        algName: z.string(),
        groupId: z.string(),
        subGroupId: z.string(),
        instanceId: z.string(),
      }),
    )
    .query(
      async ({ ctx, input: { algName, groupId, subGroupId, instanceId } }) => {
        const blankResult: ServerResponseData = {
          profile: [],
          matching: [],
          weight: NaN,
          size: NaN,
          degree: NaN,
        };

        const res = await ctx.db.algorithmResult.findFirst({
          where: {
            name: algName,
            allocationGroupId: groupId,
            allocationSubGroupId: subGroupId,
            allocationInstanceId: instanceId,
          },
        });

        if (!res) return blankResult;

        const result = serverResponseDataSchema.safeParse(
          JSON.parse(res.data as string),
        );

        if (!result.success) return blankResult;

        return result.data;
      },
    ),
});

export const testAllocationData = {
  // args: [["-na", "3", "-maxsize", "1", "-gre", "2", "-lsb", "3"]],
  students: [
    [1],
    [1, 2, 3, 4, 5, 6],
    [2, 1, 4],
    [2],
    [1, 2, 3, 4],
    [2, 3, 4, 5, 6],
    [5, 3, 8],
  ],
  projects: [
    [0, 1, 1],
    [0, 1, 1],
    [0, 1, 1],
    [0, 1, 2],
    [0, 1, 2],
    [0, 1, 2],
    [0, 1, 3],
    [0, 1, 3],
  ],
  lecturers: [
    [0, 2, 3],
    [0, 2, 2],
    [0, 2, 2],
  ],
};
