import { Role, Stage } from "@prisma/client";
import { z } from "zod";

import { nullable } from "@/lib/utils/general/nullable";
import { stageGte } from "@/lib/utils/permissions/stage-check";
import { getStudentLevelFromFlag } from "@/lib/utils/permissions/get-student-level";
import { instanceParamsSchema } from "@/lib/validations/params";
import { updatedProjectSchema } from "@/lib/validations/project-form";

import { updateProjectAllocation } from "@/server/routers/project/_utils/project-allocation";
import { createProjectFlags } from "@/server/routers/project/_utils/project-flags";
import {
  createTRPCRouter,
  forkedInstanceProcedure,
  protectedProcedure,
  stageAwareProcedure,
} from "@/server/trpc";

export const projectRouter = createTRPCRouter({
  edit: stageAwareProcedure
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
            tags,
            flagIds,
          },
        },
      }) => {
        if (stageGte(ctx.stage, Stage.PROJECT_ALLOCATION)) return;

        const newPreAllocatedStudentId = preAllocatedStudentId || undefined;

        const prev = await ctx.db.project.findFirstOrThrow({
          where: { id: projectId },
          select: { preAllocatedStudentId: true },
        });

        if (!prev.preAllocatedStudentId) {
          if (newPreAllocatedStudentId) {
            await updateProjectAllocation(ctx.db, {
              group,
              subGroup,
              instance,
              preAllocatedStudentId: newPreAllocatedStudentId,
              projectId: projectId,
            });
          }
        } else {
          if (!newPreAllocatedStudentId) {
            await ctx.db.projectAllocation.delete({
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
          } else if (prev.preAllocatedStudentId !== newPreAllocatedStudentId) {
            await ctx.db.projectAllocation.delete({
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
            await updateProjectAllocation(ctx.db, {
              group,
              subGroup,
              instance,
              preAllocatedStudentId: newPreAllocatedStudentId,
              projectId,
            });
          }
        }

        await ctx.db.project.update({
          where: { id: projectId },
          data: {
            title: title,
            description: description,
            capacityUpperBound: capacityUpperBound,
            preAllocatedStudentId: nullable(newPreAllocatedStudentId),
          },
        });

        await ctx.db.flagOnProject.deleteMany({
          where: {
            projectId,
            AND: { flagId: { notIn: flagIds } },
          },
        });

        await createProjectFlags(ctx.db, projectId, flagIds);

        await ctx.db.tag.createMany({
          data: tags.map((tag) => ({
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            ...tag,
          })),
          skipDuplicates: true,
        });

        await ctx.db.tagOnProject.deleteMany({
          where: {
            projectId,
            AND: { tagId: { notIn: tags.map(({ id }) => id) } },
          },
        });

        await ctx.db.tagOnProject.createMany({
          data: tags.map(({ id }) => ({ tagId: id, projectId })),
          skipDuplicates: true,
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

  // ! deprecated
  getTableData: protectedProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const user = ctx.session.user;

        const projects = await ctx.db.project.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: {
            id: true,
            title: true,
            description: true,
            flagOnProjects: {
              select: { flag: { select: { id: true, title: true } } },
            },
            tagOnProject: {
              select: { tag: { select: { id: true, title: true } } },
            },
            supervisor: {
              select: { user: { select: { name: true, id: true } } },
            },
          },
        });

        return projects.map((project) => ({ ...project, user }));
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
        flags: project.flagOnProjects.map(({ flag }) => flag),
        tags: project.tagOnProject.map(({ tag }) => tag),
      };
    }),

  getIsForked: forkedInstanceProcedure
    .input(z.object({ params: instanceParamsSchema, projectId: z.string() }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup },
          projectId,
        },
      }) => {
        const parentInstanceId = ctx.parentInstanceId;
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

  delete: stageAwareProcedure
    .input(z.object({ params: instanceParamsSchema, projectId: z.string() }))
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          projectId,
        },
      }) => {
        if (stageGte(ctx.stage, Stage.PROJECT_ALLOCATION)) return;

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

  deleteSelected: stageAwareProcedure
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
        if (stageGte(ctx.stage, Stage.PROJECT_ALLOCATION)) return;

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

  create: protectedProcedure
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
            flagIds,
            tags,
            capacityUpperBound,
            preAllocatedStudentId,
          },
        },
      }) => {
        const project = await ctx.db.project.create({
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
          },
        });

        if (preAllocatedStudentId && preAllocatedStudentId !== "") {
          await updateProjectAllocation(ctx.db, {
            group,
            subGroup,
            instance,
            preAllocatedStudentId,
            projectId: project.id,
          });
        }

        await createProjectFlags(ctx.db, project.id, flagIds);

        const currentInstanceTags = await ctx.db.tag.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
        });

        const newInstanceTags = tags.filter((t) => {
          return !currentInstanceTags.map((e) => e.id).includes(t.id);
        });

        await ctx.db.tag.createMany({
          data: newInstanceTags.map((tag) => ({
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            ...tag,
          })),
        });

        await ctx.db.tagOnProject.createMany({
          data: tags.map(({ id: tagId }) => ({ tagId, projectId: project.id })),
        });
      },
    ),

  getFormDetails: protectedProcedure
    .input(z.object({ params: instanceParamsSchema }))
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

        const studentData = await ctx.db.userInInstance.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            role: Role.STUDENT,
            studentAllocation: { is: null },
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
          students: studentData.map(({ userId }) => ({ id: userId })),
        };
      },
    ),
});
