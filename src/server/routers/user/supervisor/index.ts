import { Role, Stage } from "@prisma/client";
import { toZonedTime } from "date-fns-tz";
import { z } from "zod";

import { stageGte } from "@/lib/utils/permissions/stage-check";
import { instanceParamsSchema } from "@/lib/validations/params";

import {
  createTRPCRouter,
  protectedProcedure,
  stageAwareProcedure,
} from "@/server/trpc";
import { computeProjectSubmissionTarget } from "@/server/utils/submission-target";

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
        const { displayName, projectSubmissionDeadline } =
          await ctx.db.allocationInstance.findFirstOrThrow({
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

        return {
          displayName,
          projectSubmissionDeadline: toZonedTime(
            projectSubmissionDeadline,
            "Europe/London",
          ),
        };
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

        const allProjects = await ctx.db.project.findMany({
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

        const { projectAllocationTarget } =
          await ctx.db.supervisorInstanceDetails.findFirstOrThrow({
            where: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              userId,
            },
            select: { projectAllocationTarget: true },
          });

        const preAllocatedProjectCount = allProjects.reduce(
          (acc, val) => (val.preAllocatedStudentId ? acc + 1 : acc),
          0,
        );

        const allocatedProjectCount = allProjects.reduce(
          (acc, val) => acc + val.allocations.length,
          0,
        );

        const submissionTarget = computeProjectSubmissionTarget(
          projectAllocationTarget,
          allocatedProjectCount,
        );

        return {
          currentSubmissionCount: allProjects.length,
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
        if (stageGte(ctx.stage, Stage.PROJECT_ALLOCATION)) return;

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

  deleteSelected: stageAwareProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        supervisorIds: z.array(z.string()),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          supervisorIds,
        },
      }) => {
        if (stageGte(ctx.stage, Stage.PROJECT_ALLOCATION)) return;

        await ctx.db.userInInstance.deleteMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            userId: { in: supervisorIds },
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
