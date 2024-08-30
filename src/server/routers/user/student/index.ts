import { Stage } from "@prisma/client";
import { toZonedTime } from "date-fns-tz";
import { z } from "zod";

import { getGMTOffset } from "@/lib/utils/date/timezone";
import { stageGte } from "@/lib/utils/permissions/stage-check";
import { instanceParamsSchema } from "@/lib/validations/params";

import {
  createTRPCRouter,
  instanceAdminProcedure,
  instanceProcedure,
  studentProcedure,
} from "@/server/trpc";

import { getSelfDefinedProject } from "../_utils/get-self-defined-project";

import { preferenceRouter } from "./preference";

export const studentRouter = createTRPCRouter({
  preference: preferenceRouter,

  exists: instanceProcedure
    .input(z.object({ params: instanceParamsSchema, studentId: z.string() }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, instance, subGroup },
          studentId,
        },
      }) => {
        const exists = await ctx.db.studentDetails.findFirst({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            userId: studentId,
          },
        });
        return !!exists;
      },
    ),

  getById: instanceProcedure
    .input(z.object({ params: instanceParamsSchema, studentId: z.string() }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, instance, subGroup },
          studentId,
        },
      }) => {
        const data = await ctx.db.studentDetails.findFirstOrThrow({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            userId: studentId,
          },
          select: {
            studentLevel: true,
            userInInstance: {
              select: { user: { select: { email: true, name: true } } },
            },
          },
        });

        const selfDefinedProject = await getSelfDefinedProject(
          ctx.db,
          { group, subGroup, instance },
          studentId,
        );

        return {
          id: studentId,
          name: data.userInInstance.user.name,
          email: data.userInInstance.user.email,
          level: data.studentLevel,
          selfDefinedProjectId: selfDefinedProject?.id,
        };
      },
    ),

  overviewData: studentProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const { displayName, preferenceSubmissionDeadline } =
          await ctx.db.allocationInstance.findFirstOrThrow({
            where: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              id: instance,
            },
            select: {
              displayName: true,
              preferenceSubmissionDeadline: true,
            },
          });

        return {
          displayName,
          preferenceSubmissionDeadline: toZonedTime(
            preferenceSubmissionDeadline,
            "Europe/London",
          ),
          deadlineTimeZoneOffset: getGMTOffset(preferenceSubmissionDeadline),
        };
      },
    ),

  updateLevel: instanceAdminProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        studentId: z.string(),
        level: z.number(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          studentId,
          level,
        },
      }) => {
        await ctx.db.studentDetails.update({
          where: {
            detailsId: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              userId: studentId,
            },
          },
          data: { studentLevel: level },
        });

        return level;
      },
    ),

  isPreAllocated: studentProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        return await getSelfDefinedProject(
          ctx.db,
          { group, subGroup, instance },
          ctx.session.user.id,
        );
      },
    ),

  preferenceRestrictions: instanceProcedure
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
            minPreferences: true,
            maxPreferences: true,
            maxPreferencesPerSupervisor: true,
          },
        });
      },
    ),

  latestSubmission: instanceProcedure
    .input(z.object({ params: instanceParamsSchema, studentId: z.string() }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          studentId,
        },
      }) => {
        const { latestSubmissionDateTime } =
          await ctx.db.studentDetails.findFirstOrThrow({
            where: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              userId: studentId,
            },
            select: { latestSubmissionDateTime: true },
          });

        // TODO: check if toZonedTime is necessary

        return latestSubmissionDateTime
          ? toZonedTime(latestSubmissionDateTime, "Europe/London")
          : undefined;
      },
    ),

  /**
   * @deprecated
   */
  allocatedProject: studentProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const user = ctx.session.user;
        const projectAllocation = await ctx.db.projectAllocation.findFirst({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            userId: user.id,
          },
          select: {
            studentRanking: true,
            project: {
              select: {
                id: true,
                title: true,
                description: true,
                supervisor: {
                  select: { user: { select: { name: true, id: true } } },
                },
              },
            },
          },
        });

        if (!projectAllocation) return undefined;

        return {
          id: projectAllocation.project.id,
          title: projectAllocation.project.title,
          description: projectAllocation.project.description,
          studentRanking: projectAllocation.studentRanking,
          supervisor: {
            name: projectAllocation.project.supervisor.user.name!,
          },
        };
      },
    ),

  getAllocatedProject: instanceProcedure
    .input(z.object({ params: instanceParamsSchema, studentId: z.string() }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          studentId,
        },
      }) => {
        const projectAllocation = await ctx.db.projectAllocation.findFirst({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            userId: studentId,
          },
          select: {
            studentRanking: true,
            project: {
              select: {
                id: true,
                title: true,
                description: true,
                supervisor: {
                  select: { user: { select: { name: true, id: true } } },
                },
              },
            },
          },
        });

        if (!projectAllocation) return undefined;

        return {
          id: projectAllocation.project.id,
          title: projectAllocation.project.title,
          description: projectAllocation.project.description,
          studentRanking: projectAllocation.studentRanking,
          supervisor: {
            name: projectAllocation.project.supervisor.user.name!,
          },
        };
      },
    ),

  delete: instanceAdminProcedure
    .input(z.object({ params: instanceParamsSchema, studentId: z.string() }))
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          studentId,
        },
      }) => {
        if (stageGte(ctx.instance.stage, Stage.PROJECT_ALLOCATION)) return;

        await ctx.db.userInInstance.delete({
          where: {
            instanceMembership: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              userId: studentId,
            },
          },
        });
      },
    ),

  deleteSelected: instanceAdminProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        studentIds: z.array(z.string()),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          studentIds,
        },
      }) => {
        if (stageGte(ctx.instance.stage, Stage.PROJECT_ALLOCATION)) return;

        await ctx.db.userInInstance.deleteMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            userId: { in: studentIds },
          },
        });
      },
    ),
});
