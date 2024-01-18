import { Stage } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { z } from "zod";

import {
  ServerResponse,
  algorithmFlagSchema,
  builtInAlgSchema,
  serverResponseSchema,
} from "@/lib/validations/algorithm";
import { instanceParamsSchema } from "@/lib/validations/params";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/trpc";

const blankResult: ServerResponse = {
  profile: [],
  degree: NaN,
  size: NaN,
  weight: NaN,
  cost: NaN,
  costSq: NaN,
  maxLecAbsDiff: NaN,
  sumLecAbsDiff: NaN,
  matching: [],
  ranks: [],
};

export const instanceRouter = createTRPCRouter({
  access: protectedProcedure
    .input(instanceParamsSchema)
    .query(async ({ ctx, input: { group, subGroup, instance } }) => {
      const role = ctx.session.user.role;

      if (!role) return false;

      if (role === "UNREGISTERED") return false;

      const { stage } = await ctx.db.allocationInstance.findFirstOrThrow({
        where: {
          allocationGroupId: group,
          allocationSubGroupId: subGroup,
          slug: instance,
        },
        select: {
          stage: true,
        },
      });

      const supervisorStages: Stage[] = [
        Stage.SETUP,
        Stage.PROJECT_ALLOCATION,
        Stage.ALLOCATION_ADJUSTMENT,
      ];

      if (role === "SUPERVISOR") return supervisorStages.includes(stage);

      const studentStages: Stage[] = [
        Stage.SETUP,
        Stage.PROJECT_SUBMISSION,
        Stage.PROJECT_ALLOCATION,
        Stage.ALLOCATION_ADJUSTMENT,
      ];

      if (role === "STUDENT") return studentStages.includes(stage);

      return true;
    }),

  matchingData: adminProcedure
    .input(instanceParamsSchema)
    .query(async ({ ctx, input: { group, subGroup, instance } }) => {
      // TODO: update selection to filter out shortlist items
      const studentData = await ctx.db.studentInInstance.findMany({
        where: {
          allocationGroupId: group,
          allocationSubGroupId: subGroup,
          allocationInstanceId: instance,
        },
        select: {
          student: {
            select: {
              id: true,
              preferences: {
                where: {
                  project: {
                    allocationGroupId: group,
                    allocationSubGroupId: subGroup,
                    allocationInstanceId: instance,
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
          allocationGroupId: group,
          allocationSubGroupId: subGroup,
          allocationInstanceId: instance,
        },
        select: {
          supervisorId: true,
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

      const students = studentData.map(({ student }) => ({
        id: student.id,
        preferences: student.preferences.map(({ projectId }) => projectId),
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
          supervisorId,
          projectAllocationLowerBound,
          projectAllocationTarget,
          projectAllocationUpperBound,
        }) => ({
          id: supervisorId,
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
            slug: instance,
          },
          select: { selectedAlgName: true },
        });

      const selectedAlgName = allocationInstance?.selectedAlgName ?? undefined;

      return {
        matchingData: data,
        selectedAlgName,
      };
    }),

  takenAlgorithmNames: adminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(async ({ ctx, input: { params } }) => {
      const takenNames = await ctx.db.algorithm.findMany({
        where: {
          allocationGroupId: params.group,
          allocationSubGroupId: params.subGroup,
          allocationInstanceId: params.instance,
        },
        select: { algName: true },
      });
      return takenNames.map(({ algName }) => algName);
    }),

  createAlgorithm: adminProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        name: z.string(),
        flag1: algorithmFlagSchema,
        flag2: algorithmFlagSchema,
        flag3: algorithmFlagSchema,
      }),
    )
    .mutation(async ({ ctx, input: { params, name, flag1, flag2, flag3 } }) => {
      await ctx.db.algorithm.create({
        data: {
          algName: name,
          displayName: name,
          description: "description",
          flag1,
          flag2,
          flag3,
          allocationGroupId: params.group,
          allocationSubGroupId: params.subGroup,
          allocationInstanceId: params.instance,
          matchingResultData: JSON.stringify({}),
        },
      });
    }),

  // TODO: remove hard-coded built in algs
  customAlgs: adminProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
      }),
    )
    .query(async ({ ctx, input: { params } }) => {
      return await ctx.db.algorithm.findMany({
        where: {
          allocationGroupId: params.group,
          allocationSubGroupId: params.subGroup,
          allocationInstanceId: params.instance,
          NOT: [
            { algName: "generous" },
            { algName: "greedy" },
            { algName: "minimum-cost" },
            { algName: "greedy-generous" },
          ],
        },
        select: {
          algName: true,
          displayName: true,
          description: true,
          flag1: true,
          flag2: true,
          flag3: true,
        },
      });
    }),

  algorithms: adminProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
      }),
    )
    .query(async ({ ctx, input: { params } }) => {
      const data = await ctx.db.algorithm.findMany({
        where: {
          allocationGroupId: params.group,
          allocationSubGroupId: params.subGroup,
          allocationInstanceId: params.instance,
          NOT: [
            { algName: "generous" },
            { algName: "greedy" },
            { algName: "minimum-cost" },
            { algName: "greedy-generous" },
          ],
        },
        select: {
          algName: true,
          displayName: true,
          description: true,
          flag1: true,
          flag2: true,
          flag3: true,
        },
      });
      return data;
    }),

  currentStage: adminProcedure
    .input(instanceParamsSchema)
    .query(async ({ ctx, input: { group, subGroup, instance } }) => {
      const { stage } = await ctx.db.allocationInstance.findFirstOrThrow({
        where: {
          allocationGroupId: group,
          allocationSubGroupId: subGroup,
          slug: instance,
        },
        select: {
          stage: true,
        },
      });
      return stage;
    }),

  setStage: adminProcedure
    .input(instanceParamsSchema.extend({ stage: z.nativeEnum(Stage) }))
    .mutation(async ({ ctx, input: { stage, group, subGroup, instance } }) => {
      await ctx.db.allocationInstance.update({
        where: {
          allocationGroupId_allocationSubGroupId_slug: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            slug: instance,
          },
        },
        data: { stage },
      });
    }),

  selectMatching: adminProcedure
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
              slug: instance,
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
            studentId: student_id,
            projectId: project_id,
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            studentRanking: preference_rank,
          })),
        });

        await ctx.db.allocationInstance.update({
          where: {
            allocationGroupId_allocationSubGroupId_slug: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              slug: instance,
            },
          },
          data: { selectedAlgName: algName },
        });
      },
    ),

  singleAlgorithmResult: adminProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        algName: z.string(),
      }),
    )
    .query(
      async ({
        ctx,
        input: {
          algName,
          params: { group, subGroup, instance },
        },
      }) => {
        const res = await ctx.db.algorithm.findFirst({
          where: {
            algName,
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: { matchingResultData: true },
        });

        console.log("from getAlgorithmResult", res);
        if (!res) return blankResult;

        const result = serverResponseSchema.safeParse(
          JSON.parse(res.matchingResultData as string),
        );
        console.log("RECEIVED -------->>", res.matchingResultData);
        console.log("from getAlgorithmResult", result);

        if (!result.success) return blankResult;

        return result.data;
      },
    ),

  algorithmResults: adminProcedure
    .input(instanceParamsSchema)
    .query(async ({ ctx, input: { group, subGroup, instance } }) => {
      const algs = builtInAlgSchema.options;

      const results: ({
        algName: string;
        matchingResultData: JsonValue;
      } | null)[] = [];

      for (const alg of algs) {
        const res = await ctx.db.algorithm.findFirst({
          where: {
            algName: alg,
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: { algName: true, matchingResultData: true },
        });
        results.push(res);
      }

      return results.map((item, i) => {
        if (!item) return { name: algs[i], data: blankResult };
        const { algName, matchingResultData } = item;
        const res = serverResponseSchema.safeParse(
          JSON.parse(matchingResultData as string),
        );
        return { name: algName, data: res.success ? res.data : blankResult };
      });
    }),

  // ! frontend currently can not support this version
  algorithmResultsGeneral: adminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(async ({ ctx, input: { params } }) => {
      const results = await ctx.db.algorithm.findMany({
        where: {
          allocationGroupId: params.group,
          allocationSubGroupId: params.subGroup,
          allocationInstanceId: params.instance,
        },
        select: { algName: true, displayName: true, matchingResultData: true },
        orderBy: { algName: "asc" },
      });

      type tableData = {
        algName: string;
        displayName: string;
        data: ServerResponse;
      };

      if (results.length === 0) {
        return { results: [] as tableData[], firstNonEmpty: 0 };
      }

      const nonEmpty: number[] = [];
      const data = results.map(
        ({ algName, displayName, matchingResultData }, i) => {
          const res = serverResponseSchema.safeParse(
            JSON.parse(matchingResultData as string),
          );
          const data = res.success ? res.data : blankResult;
          if (data.matching.length !== 0) nonEmpty.push(i);
          return {
            algName,
            displayName,
            data,
          };
        },
      );

      return { results: data, firstNonEmpty: nonEmpty[0] };
    }),

  projectAllocations: adminProcedure
    .input(instanceParamsSchema)
    .query(async ({ ctx, input: params }) => {
      const byStudent = await ctx.db.projectAllocation.findMany({
        where: {
          project: {
            allocationGroupId: params.group,
            allocationSubGroupId: params.subGroup,
            allocationInstanceId: params.instance,
          },
        },
        select: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          project: {
            select: {
              id: true,
              supervisor: { select: { name: true } },
            },
          },
          studentRanking: true,
        },
      });

      const byProject = await ctx.db.projectAllocation.findMany({
        where: {
          project: {
            allocationGroupId: params.group,
            allocationSubGroupId: params.subGroup,
            allocationInstanceId: params.instance,
          },
        },
        select: {
          project: {
            select: {
              id: true,
              title: true,
              capacityLowerBound: true,
              capacityUpperBound: true,
              supervisor: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          student: {
            select: { id: true },
          },
          studentRanking: true,
        },
      });

      const bySupervisor = await ctx.db.projectAllocation.findMany({
        where: {
          project: {
            allocationGroupId: params.group,
            allocationSubGroupId: params.subGroup,
            allocationInstanceId: params.instance,
          },
        },
        select: {
          project: {
            select: {
              id: true,
              title: true,
              supervisor: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  supervisorInInstance: {
                    where: {
                      allocationGroupId: params.group,
                      allocationSubGroupId: params.subGroup,
                      allocationInstanceId: params.instance,
                    },
                    select: {
                      projectAllocationLowerBound: true,
                      projectAllocationTarget: true,
                      projectAllocationUpperBound: true,
                    },
                    // TODO: add "take: 1"
                  },
                },
              },
            },
          },
          student: { select: { id: true } },
          studentRanking: true,
        },
      });

      return { byStudent, byProject, bySupervisor };
    }),
});
