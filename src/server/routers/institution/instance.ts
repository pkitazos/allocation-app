import { createTRPCRouter, publicProcedure } from "@/server/trpc";
import { AlgorithmFlag } from "@prisma/client";
import { z } from "zod";
import { ServerResponse, serverResponseSchema } from "../algorithm";

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

      const students = studentData.map(({ student: { preferences } }) =>
        preferences.map(({ projectId }) => projectId),
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

  getAlgorithmResult: publicProcedure
    .input(
      z.object({
        algorithmName: z.string(),
        algFlag1: z.nativeEnum(AlgorithmFlag),
        algFlag2: z.nativeEnum(AlgorithmFlag),
        algFlag3: z.nativeEnum(AlgorithmFlag),
      }),
    )
    .query(
      async ({
        ctx,
        input: { algorithmName, algFlag1, algFlag2, algFlag3 },
      }) => {
        const blankResult: ServerResponse = {
          profile: [],
          matching: [],
          weight: NaN,
          size: NaN,
          degree: NaN,
        };

        const res = await ctx.db.algorithmResult.findFirst({
          where: {
            name: algorithmName,
            algFlag1,
            algFlag2,
            algFlag3,
          },
        });

        if (!res) return blankResult;

        const result = serverResponseSchema.safeParse(
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
