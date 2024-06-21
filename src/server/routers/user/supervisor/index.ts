import { Role, Stage } from "@prisma/client";
import { z } from "zod";

import { stageCheck } from "@/lib/utils/permissions/stage-check";
import { instanceParamsSchema } from "@/lib/validations/params";

import {
  createTRPCRouter,
  protectedProcedure,
  stageAwareProcedure,
} from "@/server/trpc";
import { createManyFlags } from "@/server/utils/flag";
import { updatedProjectFormDetailsSchema } from "@/lib/validations/project-form";

export const supervisorRouter = createTRPCRouter({
  instancePage: protectedProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        return await ctx.db.allocationInstance.findFirstOrThrow({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            id: instance,
          },
          select: {
            displayName: true,
            projectSubmissionDeadline: true,
          },
        });
      },
    ),

  instanceData: protectedProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        supervisorId: z.string(),
      }),
    )
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          supervisorId,
        },
      }) => {
        return await ctx.db.userInInstance.findFirstOrThrow({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            userId: supervisorId,
          },
          select: {
            user: { select: { id: true, name: true, email: true } },
            supervisorProjects: {
              select: {
                id: true,
                title: true,
                supervisor: { select: { userId: true } },
                flagOnProjects: {
                  select: { flag: { select: { id: true, title: true } } },
                },
                tagOnProject: {
                  select: { tag: { select: { id: true, title: true } } },
                },
              },
            },
          },
        });
      },
    ),

  createProject: protectedProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        newProject: updatedProjectFormDetailsSchema,
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
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
        const user = ctx.session.user;
        const project = await ctx.db.project.create({
          data: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            supervisorId: user.id,
            title,
            description,
            capacityLowerBound: 0,
            capacityUpperBound,
            preAllocatedStudentId,
          },
        });

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

  projects: protectedProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
      }),
    )
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const userId = ctx.session.user.id;
        const projects = await ctx.db.project.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            supervisorId: userId,
          },
          select: {
            id: true,
            title: true,
            description: true,
            capacityLowerBound: true,
            capacityUpperBound: true,
            preAllocatedStudentId: true,
          },
        });

        const { projectAllocationTarget: target } =
          await ctx.db.supervisorInstanceDetails.findFirstOrThrow({
            where: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              userId,
            },
            select: { projectAllocationTarget: true },
          });

        const preAllocated = projects.reduce(
          (acc, val) => (val.preAllocatedStudentId ? acc + 1 : acc),
          0,
        );
        const submissionTarget = 2 * (target - preAllocated);

        return { projects, submissionTarget };
      },
    ),

  delete: stageAwareProcedure
    .input(z.object({ params: instanceParamsSchema, supervisorId: z.string() }))
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          supervisorId,
        },
      }) => {
        if (stageCheck(ctx.stage, Stage.PROJECT_ALLOCATION)) return;

        await ctx.db.userInInstance.delete({
          where: {
            instanceMembership: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              userId: supervisorId,
            },
          },
        });
      },
    ),

  deleteAll: stageAwareProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        if (stageCheck(ctx.stage, Stage.PROJECT_ALLOCATION)) return;

        await ctx.db.userInInstance.deleteMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            role: Role.SUPERVISOR,
          },
        });
      },
    ),

  allocations: protectedProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const user = ctx.session.user;
        return await ctx.db.projectAllocation.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            project: { supervisorId: user.id },
          },
          select: {
            project: { select: { id: true, title: true } },
            student: { select: { userId: true } },
          },
        });
      },
    ),
});
