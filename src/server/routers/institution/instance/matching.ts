import { Role } from "@prisma/client";
import { z } from "zod";

import {
  getAllocPairs,
  getStudentRank,
} from "@/lib/utils/allocation-adjustment/rank";
import { toSupervisorDetails } from "@/lib/utils/allocation-adjustment/supervisor";
import { guidToMatric } from "@/lib/utils/external/matriculation";
import { expand } from "@/lib/utils/general/instance-params";
import {
  ProjectDetails,
  projectInfoSchema,
  studentRowSchema,
} from "@/lib/validations/allocation-adjustment";
import { matchingResultSchema } from "@/lib/validations/matching";
import { instanceParamsSchema } from "@/lib/validations/params";

import { createTRPCRouter, instanceAdminProcedure } from "@/server/trpc";

import { getPreAllocatedStudents } from "./_utils/pre-allocated-students";

export const matchingRouter = createTRPCRouter({
  select: instanceAdminProcedure
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
        await ctx.db.$transaction(async (tx) => {
          const { matchingResultData } = await tx.algorithm.findFirstOrThrow({
            where: {
              algName,
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
            },
            select: { matchingResultData: true },
          });

          const { matching } = matchingResultSchema.parse(
            JSON.parse(matchingResultData as string),
          );

          if (ctx.instance.selectedAlgName) {
            const preAllocatedStudents = await getPreAllocatedStudents(tx, {
              group,
              subGroup,
              instance,
            }).then((data) => Array.from(data));

            await tx.projectAllocation.deleteMany({
              where: {
                allocationGroupId: group,
                allocationSubGroupId: subGroup,
                allocationInstanceId: instance,
                userId: { notIn: preAllocatedStudents },
              },
            });
          }

          await tx.projectAllocation.createMany({
            data: matching
              .filter((e) => e.project_id !== "0")
              .map(({ student_id, project_id, preference_rank }) => ({
                userId: student_id,
                projectId: project_id,
                allocationGroupId: group,
                allocationSubGroupId: subGroup,
                allocationInstanceId: instance,
                studentRanking: preference_rank,
              })),
          });

          await tx.allocationInstance.update({
            where: {
              instanceId: {
                allocationGroupId: group,
                allocationSubGroupId: subGroup,
                id: instance,
              },
            },
            data: { selectedAlgName: algName },
          });
        });
      },
    ),

  clearSelection: instanceAdminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .mutation(async ({ ctx, input: { params } }) => {
      await ctx.db.$transaction(async (tx) => {
        const preAllocatedStudents = await getPreAllocatedStudents(
          tx,
          params,
        ).then((data) => Array.from(data));

        await tx.projectAllocation.deleteMany({
          where: { ...expand(params), userId: { notIn: preAllocatedStudents } },
        });

        tx.allocationInstance.update({
          where: {
            instanceId: {
              allocationGroupId: params.group,
              allocationSubGroupId: params.subGroup,
              id: params.instance,
            },
          },
          data: { selectedAlgName: null },
        });
      });
    }),

  clearAll: instanceAdminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .mutation(async ({ ctx, input: { params } }) => {
      await ctx.db.$transaction(async (tx) => {
        await tx.algorithm.updateMany({
          where: { ...expand(params) },
          data: { matchingResultData: JSON.stringify({}) },
        });

        await tx.allocationInstance.update({
          where: {
            instanceId: {
              allocationGroupId: params.group,
              allocationSubGroupId: params.subGroup,
              id: params.instance,
            },
          },
          data: { selectedAlgName: null },
        });

        const preAllocatedStudents = await getPreAllocatedStudents(
          tx,
          params,
        ).then((data) => Array.from(data));

        await tx.projectAllocation.deleteMany({
          where: { ...expand(params), userId: { notIn: preAllocatedStudents } },
        });
      });
    }),

  /**
   * @deprecated
   */
  preferences: instanceAdminProcedure
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

  // TODO: refactor to use transaction and extract util functions
  rowData: instanceAdminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const studentData = await ctx.db.studentDetails.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: {
            userInInstance: {
              select: { user: { select: { id: true, name: true } } },
            },
            preferences: {
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
            title: true,
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

        const supervisorData = await ctx.db.supervisorInstanceDetails.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: {
            projectAllocationLowerBound: true,
            projectAllocationTarget: true,
            projectAllocationUpperBound: true,
            userId: true,
            userInInstance: {
              select: {
                supervisorProjects: {
                  select: {
                    id: true,
                    allocations: { select: { userId: true } },
                  },
                },
              },
            },
          },
        });

        const supervisors = supervisorData.map((s) => toSupervisorDetails(s));

        const allocationData = await ctx.db.projectAllocation.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: { projectId: true, userId: true },
        });

        // TODO: use reduce
        const allocationRecord: Record<string, string[]> = {};
        allocationData.forEach(({ projectId, userId }) => {
          if (!allocationRecord[projectId]) allocationRecord[projectId] = [];
          allocationRecord[projectId].push(userId);
        });

        // TODO: use reduce
        const projectDetails: Record<string, ProjectDetails> = {};
        projectData.forEach(({ id, ...rest }) => {
          projectDetails[id] = {
            ...rest,
            allocatedTo: allocationRecord[id] ?? [],
          };
        });

        const students = studentData.map(
          ({ userInInstance: { user }, preferences }) => ({
            student: { id: user.id, name: user.name! },
            projects: preferences.map(({ project: { id, allocations } }) => ({
              id,
              selected:
                allocations.filter((u) => u.userId === user.id).length === 1,
            })),
          }),
        );

        const projects = projectData.map((p) => {
          const supervisor = p.supervisor.supervisorInstanceDetails[0];
          return {
            id: p.id,
            title: p.title,
            capacityLowerBound: p.capacityLowerBound,
            capacityUpperBound: p.capacityUpperBound,
            allocatedTo: allocationRecord[p.id] ?? [],
            projectAllocationLowerBound: supervisor.projectAllocationLowerBound,
            projectAllocationTarget: supervisor.projectAllocationTarget,
            projectAllocationUpperBound: supervisor.projectAllocationUpperBound,
          };
        });

        return { students, projects, supervisors };
      },
    ),

  updateAllocation: instanceAdminProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        allProjects: z.array(projectInfoSchema),
        allStudents: z.array(studentRowSchema),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          allProjects,
          allStudents,
        },
      }) => {
        /**
         * ? How do I calculate the updated allocations?
         *
         * obviously that information is encoded in the updated projects supplied to the procedure
         * but the projects themselves have no notion of what position in each student's preference list
         * they were
         *
         * that information exists on the student rows which is why they too are supplied to the procedure
         * so what I need to do is generate the new flat array from the projects and for each student in the projects
         * find what position they ranked the project they've been assigned to
         */
        const allocPairs = getAllocPairs(allProjects);

        const updatedAllocations = allocPairs.map(({ projectId, userId }) => {
          return {
            projectId,
            userId,
            studentRanking: getStudentRank(allStudents, userId, projectId),
          };
        });

        await ctx.db.$transaction(async (tx) => {
          const preAllocatedStudents = await getPreAllocatedStudents(tx, {
            group,
            subGroup,
            instance,
          }).then((data) => Array.from(data));

          await tx.projectAllocation.deleteMany({
            where: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              userId: { notIn: preAllocatedStudents },
            },
          });

          await tx.projectAllocation.createMany({
            data: updatedAllocations.map((e) => ({
              ...e,
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
            })),
          });
        });
      },
    ),

  exportCsvData: instanceAdminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const allocationData = await ctx.db.projectAllocation.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: {
            project: { include: { supervisor: { select: { user: true } } } },
            student: { select: { userId: true, studentDetails: true } },
            studentRanking: true,
          },
        });

        return allocationData.map(({ project, student, ...e }) => ({
          project: {
            ...project,
            specialTechnicalRequirements:
              project.specialTechnicalRequirements ?? "",
          },
          student: {
            id: student.userId,
            matric: guidToMatric(student.userId),
            level: student.studentDetails[0].studentLevel, // TODO: move project allocation information to studentDetails table
            ranking: e.studentRanking,
          },
          supervisor: project.supervisor.user,
        }));
      },
    ),
});
