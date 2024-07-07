import { Role, Stage } from "@prisma/client";
import { z } from "zod";

import { stageCheck } from "@/lib/utils/permissions/stage-check";
import { instanceParamsSchema } from "@/lib/validations/params";

import {
  createTRPCRouter,
  protectedProcedure,
  stageAwareProcedure,
} from "@/server/trpc";

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
            allocations: { select: { userId: true } },
          },
        });

        const allProjects = projects;

        const rowProjects = allProjects.flatMap((project) => {
          const { allocations, preAllocatedStudentId, ...rest } = project;

          if (preAllocatedStudentId) {
            return { ...rest, allocatedStudentId: preAllocatedStudentId };
          }

          if (allocations.length === 0) {
            return { ...rest, allocatedStudentId: undefined };
          }

          return allocations.map((allocation) => ({
            ...rest,
            allocatedStudentId: allocation.userId,
          }));
        });

        const { projectAllocationTarget: targetProjectCount } =
          await ctx.db.supervisorInstanceDetails.findFirstOrThrow({
            where: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              userId,
            },
            select: { projectAllocationTarget: true },
          });

        const preAllocatedProjectCount = projects.reduce(
          (acc, val) => (val.preAllocatedStudentId ? acc + 1 : acc),
          0,
        );
        const submissionTarget =
          2 * (targetProjectCount - preAllocatedProjectCount);

        return {
          currentSubmissionCount: projects.length,
          submissionTarget,
          rowProjects,
        };
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
        const data = await ctx.db.projectAllocation.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            project: { supervisorId: user.id },
          },
          select: {
            project: { select: { id: true, title: true } },
            student: {
              select: {
                user: { select: { id: true, name: true, email: true } },
              },
            },
          },
        });
        return data.map(({ project, student }) => ({
          project,
          student: {
            id: student.user.id,
            name: student.user.name!,
            email: student.user.email!,
          },
        }));
      },
    ),
});
