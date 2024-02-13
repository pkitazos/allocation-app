import { PreferenceType, Role } from "@prisma/client";
import { z } from "zod";

import {
  ServerResponse,
  serverResponseSchema,
} from "@/lib/validations/matching";
import { instanceParamsSchema } from "@/lib/validations/params";
import { adminProcedure, createTRPCRouter } from "@/server/trpc";
import { blankResult } from "./algorithm";
import {
  MatchingInfo,
  ProjectDetails,
} from "@/lib/validations/allocation-adjustment";

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
          role: Role.STUDENT,
        },
        select: {
          userId: true,
          studentPreferences: {
            where: { type: { equals: PreferenceType.PREFERENCE } },
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
            instanceId: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              id: instance,
            },
          },
          data: { selectedAlgName: algName },
        });
      },
    ),

  preferences: adminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const data = await ctx.db.userInInstance.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            role: Role.STUDENT,
          },
          select: {
            user: { select: { id: true, name: true } },
            studentPreferences: {
              select: {
                project: {
                  select: {
                    id: true,
                    allocations: { select: { userId: true } },
                  },
                },
                rank: true,
              },
              orderBy: { rank: "asc" },
            },
          },
        });

        return data.map((e) => ({
          student: { id: e.user.id, name: e.user.name! },
          projectPreferences: e.studentPreferences.map(
            ({ project: { id, allocations } }) => ({
              id,
              selected:
                allocations.filter((u) => u.userId === e.user.id).length === 1,
            }),
          ),
        }));
      },
    ),

  // TODO: fetch all other necessary data

  /* 
      Stuff I need to know to display useful information

      for each project in a student's preference list
      
      - whether it's been allocated to another student
      - who that student is
      - what the project's capacities are
      - how a particular change affects the overall matching details (size, weight, etc.)
    
    */

  allDetails: adminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const projectData = await ctx.db.project.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: {
            id: true,
            capacityLowerBound: true,
            capacityUpperBound: true,
            supervisor: {
              select: {
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
                },
              },
            },
          },
        });

        const allocationData = await ctx.db.projectAllocation.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: { projectId: true, userId: true },
        });

        const allocations: Record<string, string[]> = {};
        allocationData.forEach(({ projectId, userId }) => {
          if (!allocations[projectId]) allocations[projectId] = [];
          allocations[projectId].push(userId);
        });

        const projectDetails: Record<string, ProjectDetails> = {};
        projectData.forEach(({ id, ...rest }) => {
          projectDetails[id] = { ...rest, allocatedTo: allocations[id] || [] };
        });

        return projectDetails;
      },
    ),

  rowData: adminProcedure
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
            role: Role.STUDENT,
          },
          select: {
            user: { select: { id: true, name: true } },
            studentPreferences: {
              select: {
                project: {
                  select: {
                    id: true,
                    allocations: { select: { userId: true } },
                  },
                },
                rank: true,
              },
              orderBy: { rank: "asc" },
            },
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
            capacityLowerBound: true,
            capacityUpperBound: true,
            supervisor: {
              select: {
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
                },
              },
            },
          },
        });

        const allocationData = await ctx.db.projectAllocation.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: { projectId: true, userId: true },
        });

        const allocationRecord: Record<string, string[]> = {};
        allocationData.forEach(({ projectId, userId }) => {
          if (!allocationRecord[projectId]) allocationRecord[projectId] = [];
          allocationRecord[projectId].push(userId);
        });

        const projectDetails: Record<string, ProjectDetails> = {};
        projectData.forEach(({ id, ...rest }) => {
          projectDetails[id] = {
            ...rest,
            allocatedTo: allocationRecord[id] || [],
          };
        });

        const students = studentData.map((e) => ({
          student: { id: e.user.id, name: e.user.name! },
          projects: e.studentPreferences.map(
            ({ project: { id, allocations } }) => ({
              id,
              selected:
                allocations.filter((u) => u.userId === e.user.id).length === 1,
            }),
          ),
        }));

        const projects = projectData.map((p) => ({
          id: p.id,
          capacityLowerBound: p.capacityLowerBound,
          capacityUpperBound: p.capacityUpperBound,
          allocatedTo: allocationRecord[p.id] ?? [],
        }));

        return { students, projects };
      },
    ),

  info: adminProcedure.input(z.object({ params: instanceParamsSchema })).query(
    async ({
      ctx,
      input: {
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

      if (!selectedAlgName) return getMatchingInfo(blankResult);

      const { matchingResultData } = await ctx.db.algorithm.findFirstOrThrow({
        where: {
          allocationGroupId: group,
          allocationSubGroupId: subGroup,
          allocationInstanceId: instance,
          algName: selectedAlgName,
        },
        select: { matchingResultData: true },
      });

      const result = serverResponseSchema.safeParse(
        JSON.parse(matchingResultData as string),
      );

      if (!result.success) return getMatchingInfo(blankResult);

      return getMatchingInfo(result.data);
    },
  ),
});

function getMatchingInfo(res: ServerResponse): MatchingInfo {
  return {
    profile: res.profile,
    weight: res.weight,
    isValid: true,
    rowValidities: res.matching.map(() => true),
  };
}
