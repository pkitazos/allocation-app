import { Role } from "@prisma/client";
import { z } from "zod";

import { serverResponseSchema } from "@/lib/validations/matching";
import { instanceParamsSchema } from "@/lib/validations/params";
import { adminProcedure, createTRPCRouter } from "@/server/trpc";

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

        type details = {
          capacityLowerBound: number;
          capacityUpperBound: number;
          supervisor: {
            supervisorInstanceDetails: {
              projectAllocationLowerBound: number;
              projectAllocationTarget: number;
              projectAllocationUpperBound: number;
            }[];
          };
        };

        const projectDetails: Record<string, details> = {};
        projectData.forEach(({ id, ...rest }) => {
          projectDetails[id] = rest;
        });

        return { allocationData, projectDetails };
      },
    ),
});
