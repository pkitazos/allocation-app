import { Stage } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { z } from "zod";

import {
  AlgorithmResult,
  algorithmResultSchema,
} from "@/lib/validations/algorithm";
import { instanceParamsSchema } from "@/lib/validations/params";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/trpc";

const blankResult: AlgorithmResult = {
  profile: [],
  matching: [],
  weight: NaN,
  size: NaN,
  degree: NaN,
  selected: false,
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
      });

      const students = studentData.map(({ student }) => ({
        id: student.id,
        preferences: student.preferences.map(({ projectId }) => projectId),
      }));

      const projects = projectData.map(({ id, supervisorId }) => ({
        id,
        lowerBound: 0,
        upperBound: 1,
        supervisorId,
      }));

      const supervisors = supervisorData.map(
        ({
          supervisorId,
          projectAllocationTarget,
          projectAllocationUpperBound,
        }) => ({
          id: supervisorId,
          lowerBound: 0,
          target: projectAllocationTarget,
          upperBound: projectAllocationUpperBound,
        }),
      );

      const data = { students, projects, supervisors };
      console.log("MATCHING DATA", data);

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
        oldAlgName: z.string().optional(),
        // TODO consider removing the requirement for old alg name by storing selected alg on instance instead of result
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          algName,
          oldAlgName,
          params: { group, subGroup, instance },
        },
      }) => {
        if (oldAlgName) {
          await ctx.db.projectAllocation.deleteMany({
            where: {
              project: {
                allocationGroupId: group,
                allocationSubGroupId: subGroup,
                allocationInstanceId: instance,
              },
            },
          });

          const { data: oldAlgData } =
            await ctx.db.algorithmResult.findFirstOrThrow({
              where: {
                name: oldAlgName,
                allocationGroupId: group,
                allocationSubGroupId: subGroup,
                allocationInstanceId: instance,
              },
            });

          const oldAlgPrevData = algorithmResultSchema.parse(
            JSON.parse(oldAlgData as string),
          );

          const oldAlgUpdatedData = { ...oldAlgPrevData, selected: false };
          console.log("oldAlgUpdatedData", oldAlgUpdatedData);
          await ctx.db.algorithmResult.update({
            where: {
              name_allocationGroupId_allocationSubGroupId_allocationInstanceId:
                {
                  name: oldAlgName,
                  allocationGroupId: group,
                  allocationSubGroupId: subGroup,
                  allocationInstanceId: instance,
                },
            },
            data: {
              data: JSON.stringify(oldAlgUpdatedData),
            },
          });
        }

        const { data: newAlgData } =
          await ctx.db.algorithmResult.findFirstOrThrow({
            where: {
              name: algName,
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
            },
          });

        const newAlgPrevData = algorithmResultSchema.parse(
          JSON.parse(newAlgData as string),
        );

        const newAlgUpdatedData = { ...newAlgPrevData, selected: true };
        console.log("newAlgUpdatedData", newAlgUpdatedData);
        await ctx.db.algorithmResult.update({
          where: {
            name_allocationGroupId_allocationSubGroupId_allocationInstanceId: {
              name: algName,
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
            },
          },
          data: {
            data: JSON.stringify(newAlgUpdatedData),
          },
        });

        await ctx.db.projectAllocation.createMany({
          data: newAlgUpdatedData.matching.map((pair) => ({
            studentId: pair[0],
            projectId: pair[1],
          })),
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
        const res = await ctx.db.algorithmResult.findFirst({
          where: {
            name: algName,
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
        });

        console.log("from getAlgorithmResult", res);
        if (!res) return blankResult;

        const result = algorithmResultSchema.safeParse(
          JSON.parse(res.data as string),
        );

        console.log("from getAlgorithmResult", result);

        if (!result.success) return blankResult;

        return result.data;
      },
    ),

  algorithmResults: adminProcedure
    .input(instanceParamsSchema)
    .query(async ({ ctx, input: { group, subGroup, instance } }) => {
      const algs = ["generous", "greedy", "minimum-cost", "greedy-generous"];

      const results: ({
        data: JsonValue;
        name: string;
      } | null)[] = [];

      for (const alg of algs) {
        const res = await ctx.db.algorithmResult.findFirst({
          where: {
            name: alg,
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: { name: true, data: true },
        });
        results.push(res);
      }

      return results.map((item, i) => {
        if (!item) return { name: algs[i], data: blankResult };
        const { name, data } = item;
        const res = algorithmResultSchema.safeParse(JSON.parse(data as string));
        return { name, data: res.success ? res.data : blankResult };
      });
    }),

  // ! frontend currently can not support this version
  algorithmResultsGeneral: adminProcedure
    .input(instanceParamsSchema)
    .query(async ({ ctx, input: { group, subGroup, instance } }) => {
      const results = await ctx.db.algorithmResult.findMany({
        where: {
          allocationGroupId: group,
          allocationSubGroupId: subGroup,
          allocationInstanceId: instance,
        },
        select: { name: true, data: true },
      });

      if (results.length === 0) return [];

      return results.map(({ name, data }) => {
        const res = algorithmResultSchema.safeParse(JSON.parse(data as string));
        return { name, data: res.success ? res.data : blankResult };
      });
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
              // flags: true,
            },
          },
          project: {
            select: {
              id: true,
              supervisor: { select: { name: true } },
            },
          },
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
                },
              },
            },
          },
          student: { select: { id: true } },
        },
      });

      return { byStudent, byProject, bySupervisor };
    }),
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
