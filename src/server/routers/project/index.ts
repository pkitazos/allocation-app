import { Role, Stage } from "@prisma/client";
import { z } from "zod";

import { nullable } from "@/lib/utils/general/nullable";
import {
  getFlagFromStudentLevel,
  getStudentLevelFromFlag,
} from "@/lib/utils/permissions/get-student-level";
import { stageGte } from "@/lib/utils/permissions/stage-check";
import { instanceParamsSchema } from "@/lib/validations/params";
import { updatedProjectSchema } from "@/lib/validations/project-form";

import { updateProjectAllocation } from "@/server/routers/project/_utils/project-allocation";
import { createProjectFlags } from "@/server/routers/project/_utils/project-flags";
import {
  createTRPCRouter,
  instanceAdminProcedure,
  instanceProcedure,
  projectProcedure,
  protectedProcedure,
} from "@/server/trpc";

import { requiredFlags } from "@/content/config/flags";

export const projectRouter = createTRPCRouter({
  exists: instanceProcedure
    .input(z.object({ params: instanceParamsSchema, projectId: z.string() }))
    .query(async ({ ctx, input: { params, projectId } }) => {
      return await ctx.db.project.findFirst({
        where: {
          id: projectId,
          allocationGroupId: params.group,
          allocationSubGroupId: params.subGroup,
          allocationInstanceId: params.instance,
        },
      });
    }),

  edit: instanceProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        projectId: z.string(),
        updatedProject: updatedProjectSchema,
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          projectId,
          updatedProject: {
            title,
            description,
            capacityUpperBound,
            preAllocatedStudentId,
            specialTechnicalRequirements,
            tags,
            flagTitles,
          },
        },
      }) => {
        if (stageGte(ctx.instance.stage, Stage.PROJECT_ALLOCATION)) return;

        const newPreAllocatedStudentId = preAllocatedStudentId || undefined;

        await ctx.db.$transaction(async (tx) => {
          const prev = await tx.project.findFirstOrThrow({
            where: { id: projectId },
            select: { preAllocatedStudentId: true },
          });

          if (!prev.preAllocatedStudentId) {
            if (newPreAllocatedStudentId) {
              await updateProjectAllocation(tx, {
                group,
                subGroup,
                instance,
                preAllocatedStudentId: newPreAllocatedStudentId,
                projectId: projectId,
              });
            }
          } else {
            if (!newPreAllocatedStudentId) {
              await tx.projectAllocation.delete({
                where: {
                  allocationId: {
                    allocationGroupId: group,
                    allocationSubGroupId: subGroup,
                    allocationInstanceId: instance,
                    projectId,
                    userId: prev.preAllocatedStudentId,
                  },
                },
              });
            } else if (
              prev.preAllocatedStudentId !== newPreAllocatedStudentId
            ) {
              await tx.projectAllocation.delete({
                where: {
                  allocationId: {
                    allocationGroupId: group,
                    allocationSubGroupId: subGroup,
                    allocationInstanceId: instance,
                    projectId,
                    userId: prev.preAllocatedStudentId,
                  },
                },
              });
              await updateProjectAllocation(tx, {
                group,
                subGroup,
                instance,
                preAllocatedStudentId: newPreAllocatedStudentId,
                projectId,
              });
            }
          }

          await tx.project.update({
            where: { id: projectId },
            data: {
              title: title,
              description: description,
              capacityUpperBound: capacityUpperBound,
              preAllocatedStudentId: nullable(newPreAllocatedStudentId),
              latestEditDateTime: new Date(),
              specialTechnicalRequirements: nullable(
                specialTechnicalRequirements,
              ),
            },
          });

          await tx.flagOnProject.deleteMany({
            where: {
              projectId,
              AND: { flag: { title: { notIn: flagTitles } } },
            },
          });

          await createProjectFlags(
            tx,
            ctx.instance.params,
            projectId,
            flagTitles,
          );

          await tx.tag.createMany({
            data: tags.map((tag) => ({
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              ...tag,
            })),
            skipDuplicates: true,
          });

          await tx.tagOnProject.deleteMany({
            where: {
              projectId,
              AND: { tagId: { notIn: tags.map(({ id }) => id) } },
            },
          });

          await tx.tagOnProject.createMany({
            data: tags.map(({ id }) => ({ tagId: id, projectId })),
            skipDuplicates: true,
          });
        });
      },
    ),

  getAllForUser: protectedProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(async ({ ctx, input: { params } }) => {
      const projectData = await ctx.db.project.findMany({
        where: {
          allocationGroupId: params.group,
          allocationSubGroupId: params.subGroup,
          allocationInstanceId: params.instance,
        },
        select: {
          id: true,
          title: true,
          supervisor: { select: { user: true } },
          tagOnProject: { select: { tag: true } },
          flagOnProjects: { select: { flag: true } },
        },
      });

      const allProjects = projectData.map((p) => ({
        id: p.id,
        title: p.title,
        supervisor: { id: p.supervisor.user.id, name: p.supervisor.user.name! },
        flags: p.flagOnProjects.map(({ flag }) => flag),
        tags: p.tagOnProject.map(({ tag }) => tag),
      }));

      const student = await ctx.db.studentDetails.findFirst({
        where: {
          allocationGroupId: params.group,
          allocationSubGroupId: params.subGroup,
          allocationInstanceId: params.instance,
          userId: ctx.session.user.id,
        },
        select: {
          studentLevel: true,
          userInInstance: { select: { role: true } },
        },
      });

      if (!student) return allProjects;

      return allProjects.filter(({ flags }) =>
        flags.some((f) => getStudentLevelFromFlag(f) === student.studentLevel),
      );
    }),

  getAllLateProposals: instanceAdminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const data = await ctx.db.project.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            latestEditDateTime: { gt: ctx.instance.projectSubmissionDeadline },
          },
          include: { flagOnProjects: { select: { flag: true } } },
        });

        return data.map((p) => ({
          id: p.id,
          title: p.title,
          supervisorId: p.supervisorId,
          capacityUpperBound: p.capacityUpperBound,
          flags: p.flagOnProjects.map(({ flag }) => flag),
        }));
      },
    ),

  getById: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input: { projectId } }) => {
      const project = await ctx.db.project.findFirstOrThrow({
        where: { id: projectId },
        select: {
          title: true,
          description: true,
          capacityUpperBound: true,
          preAllocatedStudentId: true,
          specialTechnicalRequirements: true,
          supervisor: {
            select: { user: { select: { id: true, name: true } } },
          },
          flagOnProjects: {
            select: { flag: { select: { id: true, title: true } } },
          },
          tagOnProject: {
            select: { tag: { select: { id: true, title: true } } },
          },
        },
      });

      return {
        title: project.title,
        description: project.description,
        supervisor: project.supervisor.user,
        capacityUpperBound: project.capacityUpperBound,
        preAllocatedStudentId: project.preAllocatedStudentId,
        specialTechnicalRequirements:
          project.specialTechnicalRequirements ?? "",
        flags: project.flagOnProjects.map(({ flag }) => flag),
        tags: project.tagOnProject.map(({ tag }) => tag),
      };
    }),

  getIsForked: instanceProcedure
    .input(z.object({ params: instanceParamsSchema, projectId: z.string() }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup },
          projectId,
        },
      }) => {
        const parentInstanceId = ctx.instance.parentInstanceId;
        const project = await ctx.db.project.findFirstOrThrow({
          where: { id: projectId },
        });

        if (!parentInstanceId) return false;

        const parentInstanceProject = await ctx.db.project.findFirst({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: parentInstanceId,
            title: project.title,
          },
        });

        return !!parentInstanceProject;
      },
    ),

  getUserAccess: protectedProcedure
    .input(z.object({ params: instanceParamsSchema, projectId: z.string() }))
    .query(async ({ ctx, input: { params, projectId } }) => {
      const student = await ctx.db.studentDetails.findFirst({
        where: {
          allocationGroupId: params.group,
          allocationSubGroupId: params.subGroup,
          allocationInstanceId: params.instance,
          userId: ctx.session.user.id,
        },
      });

      if (!student) return { access: true, studentFlagLabel: "" };

      const { flagOnProjects } = await ctx.db.project.findFirstOrThrow({
        where: {
          id: projectId,
          allocationGroupId: params.group,
          allocationSubGroupId: params.subGroup,
          allocationInstanceId: params.instance,
        },
        select: { flagOnProjects: { select: { flag: true } } },
      });

      const access = flagOnProjects.some(
        ({ flag }) => getStudentLevelFromFlag(flag) === student.studentLevel,
      );

      return {
        access,
        studentFlagLabel: getFlagFromStudentLevel(student.studentLevel),
      };
    }),

  delete: instanceProcedure
    .input(z.object({ params: instanceParamsSchema, projectId: z.string() }))
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          projectId,
        },
      }) => {
        if (stageGte(ctx.instance.stage, Stage.PROJECT_ALLOCATION)) return;

        await ctx.db.project.delete({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            id: projectId,
          },
        });
      },
    ),

  deleteSelected: instanceProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        projectIds: z.array(z.string()),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          projectIds,
        },
      }) => {
        if (stageGte(ctx.instance.stage, Stage.PROJECT_ALLOCATION)) return;

        await ctx.db.project.deleteMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            id: { in: projectIds },
          },
        });
      },
    ),

  details: protectedProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const allFlags = await ctx.db.flag.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: {
            id: true,
            title: true,
            flagOnProjects: true,
          },
        });

        const allTags = await ctx.db.tag.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: {
            id: true,
            title: true,
            tagOnProject: true,
          },
        });

        return {
          flags: allFlags
            .filter((f) => f.flagOnProjects.length !== 0)
            .map((e) => ({ id: e.id, title: e.title })),
          tags: allTags
            .filter((t) => t.tagOnProject.length !== 0)
            .map((e) => ({ id: e.id, title: e.title })),
        };
      },
    ),

  create: instanceProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        newProject: updatedProjectSchema,
        supervisorId: z.string(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          supervisorId,
          newProject: {
            title,
            description,
            flagTitles,
            tags,
            capacityUpperBound,
            preAllocatedStudentId,
            specialTechnicalRequirements,
          },
        },
      }) => {
        if (stageGte(ctx.instance.stage, Stage.PROJECT_ALLOCATION)) return;

        await ctx.db.$transaction(async (tx) => {
          const project = await tx.project.create({
            data: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              supervisorId: supervisorId,
              title,
              description,
              capacityLowerBound: 0,
              capacityUpperBound,
              preAllocatedStudentId,
              specialTechnicalRequirements,
              latestEditDateTime: new Date(),
            },
          });

          if (preAllocatedStudentId && preAllocatedStudentId !== "") {
            await updateProjectAllocation(tx, {
              group,
              subGroup,
              instance,
              preAllocatedStudentId,
              projectId: project.id,
            });
          }

          await createProjectFlags(
            tx,
            ctx.instance.params,
            project.id,
            flagTitles,
          );

          const currentInstanceTags = await tx.tag.findMany({
            where: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
            },
          });

          const newInstanceTags = tags.filter((t) => {
            return !currentInstanceTags.map((e) => e.id).includes(t.id);
          });

          await tx.tag.createMany({
            data: newInstanceTags.map((tag) => ({
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              ...tag,
            })),
          });

          await tx.tagOnProject.createMany({
            data: tags.map(({ id: tagId }) => ({
              tagId,
              projectId: project.id,
            })),
          });
        });
      },
    ),

  getFormDetails: projectProcedure
    .input(z.object({ params: instanceParamsSchema, projectId: z.string() }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const { flags, tags } =
          await ctx.db.allocationInstance.findFirstOrThrow({
            where: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              id: instance,
            },
            select: {
              flags: { select: { id: true, title: true } },
              tags: { select: { id: true, title: true } },
            },
          });

        // make sure only students with the correct data are returned

        const studentData = await ctx.db.userInInstance.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            role: Role.STUDENT,
            studentAllocation: { is: null },
          },
          select: {
            studentDetails: { select: { userId: true, studentLevel: true } },
          },
        });

        const projectTitles = await ctx.db.project.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: { title: true },
        });

        return {
          takenTitles: projectTitles.map(({ title }) => title),
          flags,
          tags,
          students: studentData
            .filter((s) => {
              if (requiredFlags.length === 0) return true;
              return ctx.project.flags.some((f) => {
                return (
                  getStudentLevelFromFlag(f) ===
                  s.studentDetails[0].studentLevel
                );
              });
            })
            .map(({ studentDetails }) => ({
              id: studentDetails[0].userId,
              studentLevel: studentDetails[0].studentLevel,
            })),
        };
      },
    ),
});
