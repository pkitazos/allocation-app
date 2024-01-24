import { Role, Stage } from "@prisma/client";
import { z } from "zod";

import {
  ServerResponse,
  algorithmSchema,
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
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const role = ctx.session.user.role;

        if (!role) return false;

        const { stage } = await ctx.db.allocationInstance.findFirstOrThrow({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            id: instance,
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

        if (role === Role.SUPERVISOR) return !supervisorStages.includes(stage);

        const studentStages: Stage[] = [
          Stage.SETUP,
          Stage.PROJECT_SUBMISSION,
          Stage.PROJECT_ALLOCATION,
          Stage.ALLOCATION_ADJUSTMENT,
        ];

        if (role === Role.STUDENT) return !studentStages.includes(stage);

        return true;
      },
    ),

  matchingData: adminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
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

        const selectedAlgName =
          allocationInstance?.selectedAlgName ?? undefined;

        return {
          matchingData: data,
          selectedAlgName,
        };
      },
    ),

  takenAlgorithmNames: adminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const takenNames = await ctx.db.algorithm.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: { algName: true },
        });
        return takenNames.map(({ algName }) => algName);
      },
    ),

  createAlgorithm: adminProcedure
    .input(
      algorithmSchema
        .pick({ algName: true, flag1: true, flag2: true, flag3: true })
        .extend({ params: instanceParamsSchema }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          algName,
          flag1,
          flag2,
          flag3,
        },
      }) => {
        await ctx.db.algorithm.create({
          data: {
            algName,
            displayName: algName,
            description: "description",
            flag1,
            flag2,
            flag3,
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            matchingResultData: JSON.stringify({}),
          },
        });
      },
    ),

  customAlgs: adminProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
      }),
    )
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        return await ctx.db.algorithm.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            NOT: builtInAlgSchema.options.map((algName) => ({ algName })),
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
      },
    ),

  algorithms: adminProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
      }),
    )
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const data = await ctx.db.algorithm.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            NOT: builtInAlgSchema.options.map((algName) => ({ algName })),
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
      },
    ),

  currentStage: adminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const { stage } = await ctx.db.allocationInstance.findFirstOrThrow({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            id: instance,
          },
          select: {
            stage: true,
          },
        });
        return stage;
      },
    ),

  setStage: adminProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        stage: z.nativeEnum(Stage),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          stage,
        },
      }) => {
        await ctx.db.allocationInstance.update({
          where: {
            allocationGroupId_allocationSubGroupId_id: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              id: instance,
            },
          },
          data: { stage },
        });
      },
    ),

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

  algorithmResultsGeneral: adminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const results = await ctx.db.algorithm.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: {
            algName: true,
            displayName: true,
            matchingResultData: true,
          },
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
      },
    ),

  projectAllocations: adminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const byStudent = await ctx.db.projectAllocation.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: {
            student: {
              select: {
                user: { select: { id: true, name: true, email: true } },
              },
            },
            project: {
              select: {
                id: true,
                supervisor: { select: { user: { select: { name: true } } } },
              },
            },
            studentRanking: true,
          },
        });

        const byProject = await ctx.db.projectAllocation.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: {
            project: {
              select: {
                id: true,
                title: true,
                capacityLowerBound: true,
                capacityUpperBound: true,
                supervisor: {
                  select: { user: { select: { id: true, name: true } } },
                },
              },
            },
            userId: true,
            studentRanking: true,
          },
        });

        const bySupervisor = await ctx.db.projectAllocation.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: {
            project: {
              select: {
                id: true,
                title: true,
                supervisor: {
                  select: {
                    user: { select: { id: true, name: true, email: true } },
                    supervisorInstanceDetails: {
                      where: {
                        allocationGroupId: group,
                        allocationSubGroupId: subGroup,
                        allocationInstanceId: instance,
                      },
                      select: {
                        projectAllocationLowerBound: true,
                        projectAllocationTarget: true,
                        projectAllocationUpperBound: true,
                      },
                      take: 1, // ? might not be doing anything
                    },
                  },
                },
              },
            },
            userId: true,
            studentRanking: true,
          },
        });

        return { byStudent, byProject, bySupervisor };
      },
    ),

  supervisors: protectedProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        return await ctx.db.userInInstance.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            role: Role.SUPERVISOR,
          },
          select: {
            user: { select: { id: true, name: true, email: true } },
          },
        });
      },
    ),

  students: protectedProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        return await ctx.db.userInInstance.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            role: Role.STUDENT,
          },
          select: {
            user: { select: { id: true, name: true, email: true } },
          },
        });
      },
    ),
});
