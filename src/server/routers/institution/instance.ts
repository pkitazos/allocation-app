import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/trpc";
import { Stage } from "@prisma/client";
import { z } from "zod";
import { AlgorithmResult, algorithmResultSchema } from "../algorithm";
import { instanceParamsSchema } from "@/types/params";

export const instanceRouter = createTRPCRouter({
  matchingData: publicProcedure
    .input(instanceParamsSchema)
    .query(async ({ ctx, input: { group, subGroup, instance } }) => {
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

  currentStage: publicProcedure
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

  setStage: publicProcedure
    .input(instanceParamsSchema.and(z.object({ stage: z.nativeEnum(Stage) })))
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

  selectMatching: publicProcedure
    .input(
      instanceParamsSchema.and(
        z.object({
          algName: z.string(),
          oldAlgName: z.string().optional(),
        }),
      ),
    )
    .mutation(
      async ({
        ctx,
        input: { algName, oldAlgName, group, subGroup, instance },
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
        const blankResult: AlgorithmResult = {
          profile: [],
          matching: [],
          weight: NaN,
          size: NaN,
          degree: NaN,
          selected: false,
        };

        const res = await ctx.db.algorithmResult.findFirst({
          where: {
            name: algName,
            allocationGroupId: groupId,
            allocationSubGroupId: subGroupId,
            allocationInstanceId: instanceId,
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
  getProjectAllocations: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
        subGroupId: z.string(),
        instanceId: z.string(),
      }),
    )
    .query(async ({ ctx, input: { groupId, subGroupId, instanceId } }) => {
      const byStudentRaw = await ctx.db.projectAllocation.findMany({
        where: {
          project: {
            allocationGroupId: groupId,
            allocationSubGroupId: subGroupId,
            allocationInstanceId: instanceId,
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

      const byStudent = byStudentRaw.map(
        ({
          student: { id: studentId, name: studentName, email: studentEmail },
          project: {
            id: projectId,
            supervisor: { name: supervisorName },
          },
        }) => ({
          studentId,
          studentName,
          studentEmail,
          projectId,
          supervisorName,
        }),
      );

      const byProjectRaw = await ctx.db.projectAllocation.findMany({
        where: {
          project: {
            allocationGroupId: groupId,
            allocationSubGroupId: subGroupId,
            allocationInstanceId: instanceId,
          },
        },
        select: {
          project: {
            select: {
              id: true,
              title: true,
              description: true,
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

      const byProject = byProjectRaw.map(
        ({
          project: {
            id: projectId,
            title: projectTitle,
            supervisor: { id: supervisorId, name: supervisorName },
          },
          student: { id: studentId },
        }) => ({
          projectId,
          projectTitle,
          studentId,
          supervisorId,
          supervisorName,
        }),
      );

      const bySupervisorRaw = await ctx.db.projectAllocation.findMany({
        where: {
          project: {
            allocationGroupId: groupId,
            allocationSubGroupId: subGroupId,
            allocationInstanceId: instanceId,
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

      const bySupervisor = bySupervisorRaw.map(
        ({
          project: {
            supervisor: {
              id: supervisorId,
              name: supervisorName,
              email: supervisorEmail,
            },
            id: projectId,
            title: projectTitle,
          },
          student: { id: studentId },
        }) => ({
          supervisorId,
          supervisorName,
          supervisorEmail,
          projectId,
          projectTitle,
          studentId,
        }),
      );

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
