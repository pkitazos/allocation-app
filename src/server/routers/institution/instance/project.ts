import { Role } from "@prisma/client";
import { z } from "zod";

import { instanceParamsSchema } from "@/lib/validations/params";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/trpc";

export const projectRouter = createTRPCRouter({
  submissionInfo: adminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const capacities = await ctx.db.supervisorInstanceDetails.findMany({
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
          orderBy: { userId: "asc" },
        });

        const projects = await ctx.db.project.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: { supervisorId: true, preAllocatedStudentId: true },
        });

        return capacities.map((e) => {
          const preAllocatedCount = projects.filter((p) => {
            return p.supervisorId === e.userId && p.preAllocatedStudentId;
          }).length;

          const alreadySubmitted = projects.filter((p) => {
            return p.supervisorId === e.userId && !p.preAllocatedStudentId;
          }).length;

          // submissionTarget = 2*(t-p)
          const submissionTarget =
            2 * (e.projectAllocationTarget - preAllocatedCount);

          return {
            submissionTarget,
            alreadySubmitted,
            ...e,
          };
        });
      },
    ),

  preferenceInfo: adminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const preferenceCapacities =
          await ctx.db.allocationInstance.findFirstOrThrow({
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

        const data = await ctx.db.userInInstance.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            role: Role.STUDENT,
          },
          select: {
            userId: true,
            studentPreferences: true,
          },
        });

        const studentData = data.map(({ userId, studentPreferences }) => {
          return {
            userId,
            submissionCount: studentPreferences.length,
            alreadySubmitted: studentPreferences.length !== 0,
          };
        });
        return { studentData, preferenceCapacities };
      },
    ),

  creationDetails: protectedProcedure
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
