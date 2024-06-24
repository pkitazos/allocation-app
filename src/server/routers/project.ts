import { Role, Stage } from "@prisma/client";
import { z } from "zod";

import { stageCheck } from "@/lib/utils/permissions/stage-check";
import { instanceParamsSchema } from "@/lib/validations/params";
import { updatedProjectFormDetailsSchema } from "@/lib/validations/project-form";

import {
  createTRPCRouter,
  protectedProcedure,
  stageAwareProcedure,
} from "@/server/trpc";
import { createManyFlags } from "@/server/utils/flag";
import { updateProjectAllocation } from "@/server/utils/project-allocation";

export const projectRouter = createTRPCRouter({
  getEditFormDetails: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input: { projectId } }) => {
      const project = await ctx.db.project.findFirstOrThrow({
        where: { id: projectId },
        select: { capacityUpperBound: true, preAllocatedStudentId: true },
      });

      return {
        capacityUpperBound: project.capacityUpperBound,
        preAllocatedStudentId: project.preAllocatedStudentId ?? "",
      };
    }),

  edit: stageAwareProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        projectId: z.string(),
        updatedProject: updatedProjectFormDetailsSchema,
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
        if (stageCheck(ctx.stage, Stage.PROJECT_ALLOCATION)) return;

        // we have 4 scenarios to handle
        // 0. project was previously not pre-allocated to a student and now we are not pre-allocating to any student (no change)
        // 1. project was previously not pre-allocated to a student and now we are selecting a student to pre-allocate to
        // 2. project was previously pre-allocated to a student and now we are selecting a different student to pre-allocate to
        // 3. project was previously pre-allocated to a student and now we are removing the pre-allocation

        // for 1-3 we need to make sure that the `project`, the `userInInstance` and the `projectAllocation` are updated correctly

        // for scenario 1 we need to:
        // - create a new `projectAllocation`
        // - connect it to the `userInInstance`
        // - assign to the `project` the new `preAllocatedStudentId`

        // for scenario 2 we need to:
        // - delete the old `projectAllocation`
        // - create a new `projectAllocation`
        // - connect it to the `userInInstance`
        // - assign to the `project` the new `preAllocatedStudentId`

        // for scenario 3 we need to:
        // - delete the old `projectAllocation`
        // - remove the `preAllocatedStudentId` from the `project`

        // ? how can we identify which scenario we are in?

        // we can check if the `preAllocatedStudentId` has changed

        // we are in scenario 0 if the `preAllocatedStudentId` was empty and now it is  empty
        // we are in scenario 1 if the `preAllocatedStudentId` was empty and now it is not
        // we are in scenario 2 if the `preAllocatedStudentId` was not empty and now it is different
        // we are in scenario 3 if the `preAllocatedStudentId` was not empty and now it is empty

        const prev = await ctx.db.project.findFirstOrThrow({
          where: { id: projectId },
          select: { preAllocatedStudentId: true },
        });

        if (!prev.preAllocatedStudentId) {
          if (!preAllocatedStudentId || preAllocatedStudentId === "") {
            // either preAllocatedStudentId is undefined or it is an empty string
            // scenario 0 (no change)
          } else {
            // scenario 1
          }
        } else if (prev.preAllocatedStudentId !== "") {
          if (preAllocatedStudentId && preAllocatedStudentId !== "") {
            // scenario 2
          } else {
            // either preAllocatedStudentId is undefined or it is an empty string
            // scenario 3
          }
        }

        await ctx.db.project.update({
          where: { id: projectId },
          data: {
            title: title,
            description: description,
            capacityUpperBound: capacityUpperBound,
            preAllocatedStudentId: preAllocatedStudentId,
          },
        });

        if (preAllocatedStudentId && preAllocatedStudentId !== "") {
          await updateProjectAllocation(ctx.db, {
            group,
            subGroup,
            instance,
            preAllocatedStudentId,
            projectId: projectId,
          });
        }

        if (!preAllocatedStudentId || preAllocatedStudentId === "") {
          const projectAllocation = await ctx.db.projectAllocation.findFirst({
            where: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              projectId,
            },
          });

          if (projectAllocation) {
            await ctx.db.projectAllocation.delete({
              where: {
                allocationId: {
                  allocationGroupId: group,
                  allocationSubGroupId: subGroup,
                  allocationInstanceId: instance,
                  projectId,
                  userId: projectAllocation.userId,
                },
              },
            });
          }
        }

        await ctx.db.flagOnProject.deleteMany({
          where: {
            projectId,
            AND: { flagId: { notIn: flagIds } },
          },
        });

        await createManyFlags(ctx.db, projectId, flagIds);

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
        flags: project.flagOnProjects.map(({ flag }) => flag),
        tags: project.tagOnProject.map(({ tag }) => tag),
      };
    }),

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
        if (stageCheck(ctx.stage, Stage.PROJECT_ALLOCATION)) return;

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
        if (stageCheck(ctx.stage, Stage.PROJECT_ALLOCATION)) return;

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
        newProject: updatedProjectFormDetailsSchema,
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

        await createManyFlags(ctx.db, project.id, flagIds);

        const existingTags = await ctx.db.tag.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
        });

        const newTags = tags.filter((t) => {
          return !existingTags.map((e) => e.id).includes(t.id);
        });

        await ctx.db.tag.createMany({
          data: newTags.map((tag) => ({
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

        return {
          flags,
          tags,
          students: studentData.map(({ userId }) => ({ id: userId })),
        };
      },
    ),
});
