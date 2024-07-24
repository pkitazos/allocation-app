import { PreferenceType, Role } from "@prisma/client";
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
import { serverResponseSchema } from "@/lib/validations/matching";
import { instanceParamsSchema } from "@/lib/validations/params";

import { adminProcedure, createTRPCRouter } from "@/server/trpc";
import { delay } from "@/lib/utils/general/delay";

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
          submittedPreferences: true,
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
          where: {
            algName,
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
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

  updateAllocation: adminProcedure
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

  exportDataToExternalSystem: adminProcedure
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

        // TODO: update what is needed from project
        const projectData = allocationData.map((p) => p.project);

        return { studentData, supervisorData, projectData };
      },
    ),

  checkStudents: adminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .mutation(
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
          select: { userId: true },
        });

        const studentData = allocationData.map((s) => ({
          matriculation: s.userId,
        }));

        // const result = await axios
        //   .post("/sp_checkStudents", studentData)
        //   .then((res) => studentCheckResponseSchema.safeParse(res.data));

        // if (!result.success) {
        //   throw new TRPCClientError("Result does not match expected type");
        // }

        // const checkedStudents = result.data;
        const checkedStudents = [
          { matriculation: "123", exists: 1 as const },
          { matriculation: "456", exists: 1 as const },
          { matriculation: "789", exists: 0 as const },
        ];

        await delay(2000);

        return {
          checkedStudents,
          total: checkedStudents.length,
          exist: checkedStudents.reduce((acc, val) => acc + val.exists, 0),
        };
      },
    ),

  checkSupervisors: adminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .mutation(
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
          select: { project: { select: { supervisorId: true } } },
        });

        const supervisorData = [
          ...new Set(allocationData.map((s) => s.project.supervisorId)),
        ].map((id) => ({ guid: id }));

        // const result = await axios
        //   .post("/sp_checkSupervisors", supervisorData)
        //   .then((res) => supervisorCheckResponseSchema.safeParse(res.data));

        // if (!result.success) {
        //   throw new TRPCClientError("Result does not match expected type");
        // }

        // const checkedSupervisors = result.data;
        const checkedSupervisors = [
          { guid: "123", exists: 1 as const },
          { guid: "456", exists: 1 as const },
          { guid: "789", exists: 0 as const },
        ];

        await delay(2000);

        return {
          checkedSupervisors,
          total: checkedSupervisors.length,
          exist: checkedSupervisors.reduce((acc, val) => acc + val.exists, 0),
        };
      },
    ),

  createProjectsOnAssessmentSystem: adminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .mutation(async () => {
      await delay(2000);

      const createdProjects = [
        { id: "123", created: 1 as const },
        { id: "456", created: 1 as const },
      ];

      return {
        createdProjects,
        total: createdProjects.length,
        created: createdProjects.reduce((acc, val) => acc + val.created, 0),
      };
    }),

  exportCsvData: adminProcedure
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
            student: true,
            studentRanking: true,
          },
        });

        return allocationData.map(({ project, student, ...e }) => ({
          projectInternalId: project.id,
          projectExternalId: project.externalId ?? "",
          studentId: student.userId,
          projectTitle: project.title,
          projectDescription: project.description,
          projectSpecialTechnicalRequirements:
            project.specialTechnicalRequirements ?? "",
          studentRanking: e.studentRanking,
        }));
      },
    ),
});
