import { Role } from "@prisma/client";
import { z } from "zod";

import {
  getAllocPairs,
  getStudentRank,
} from "@/lib/utils/allocation-adjustment/rank";
import { toSupervisorDetails } from "@/lib/utils/allocation-adjustment/supervisor";
import {
  ProjectDetails,
  projectInfoSchema,
  studentRowSchema,
} from "@/lib/validations/allocation-adjustment";
import { matchingResultSchema } from "@/lib/validations/matching";
import { instanceParamsSchema } from "@/lib/validations/params";

import { createTRPCRouter, instanceAdminProcedure } from "@/server/trpc";

// TODO: uncomment once endpoint interfaces are confirmed
// import {
//   projectCreationResponseSchema,
//   studentCheckResponseSchema,
//   supervisorCheckResponseSchema,
// } from "@/lib/validations/allocation-export-data";
// import { TRPCClientError } from "@trpc/client";
// import axios from "axios";

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

        const projects = projectData.map((p) => {
          const supervisor = p.supervisor.supervisorInstanceDetails[0];
          return {
            id: p.id,
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

  // TODO: refactor to use transactions
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

        await ctx.db.projectAllocation.deleteMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
        });

        await ctx.db.projectAllocation.createMany({
          data: updatedAllocations.map((e) => ({
            ...e,
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          })),
        });
      },
    ),

  exportDataToExternalSystem: instanceAdminProcedure
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
          select: { student: { select: { userId: true } }, project: true },
        });

        const studentData = allocationData.map((s) => ({
          matriculation: s.student.userId,
        }));

        const supervisorData = allocationData.map((s) => ({
          guid: s.project.supervisorId,
        }));

        // // TODO: update what is needed from project
        const projectData = allocationData.map((p) => p.project);

        return { studentData, supervisorData, projectData };
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
            project: true,
            student: { select: { userId: true, studentDetails: true } },
            studentRanking: true,
          },
        });

        return allocationData.map(({ project, student, ...e }) => ({
          projectInternalId: project.id,
          studentId: student.userId,
          studentLevel: student.studentDetails[0].studentLevel, // TODO: invert query direction (findMany from studentDetails)
          projectTitle: project.title,
          projectDescription: project.description,
          projectSpecialTechnicalRequirements:
            project.specialTechnicalRequirements ?? "",
          studentRanking: e.studentRanking,
        }));
      },
    ),
});
