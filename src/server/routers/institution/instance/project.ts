import { Role } from "@prisma/client";
import { z } from "zod";

import { instanceParamsSchema } from "@/lib/validations/params";

import {
  adminProcedure,
  createTRPCRouter,
  forkedInstanceProcedure,
} from "@/server/trpc";
import {
  computeSubmissionDetails,
  findByUserId,
  SubmissionDetails,
} from "@/server/utils/submission-info";
import { computeProjectSubmissionTarget } from "@/server/utils/submission-target";

export const projectRouter = createTRPCRouter({
  submissionInfo: forkedInstanceProcedure // ! this should also be an admin procedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const parentInstanceId = ctx.parentInstanceId;

        const submissionDetails: SubmissionDetails[] = [];

        if (parentInstanceId) {
          const parentInstanceSubmissionDetails =
            await computeSubmissionDetails(ctx.db, {
              group,
              subGroup,
              instance: parentInstanceId,
            });

          const forkedInstanceSubmissionDetails =
            await computeSubmissionDetails(ctx.db, {
              group,
              subGroup,
              instance,
            });

          parentInstanceSubmissionDetails.forEach(
            ({ projectAllocationTarget, userId, ...parent }) => {
              const forked = findByUserId(
                forkedInstanceSubmissionDetails,
                userId,
              );

              const newAllocatedCount =
                parent.allocatedCount + forked.allocatedCount;

              const newSubmissionTarget = computeProjectSubmissionTarget(
                projectAllocationTarget,
                newAllocatedCount,
              );

              submissionDetails.push({
                userId,
                projectAllocationTarget,
                allocatedCount: newAllocatedCount,
                submissionTarget: newSubmissionTarget,
              });
            },
          );
        } else {
          const currentInstanceSubmissionDetails =
            await computeSubmissionDetails(ctx.db, {
              group,
              subGroup,
              instance,
            });

          submissionDetails.push(...currentInstanceSubmissionDetails);
        }

        // ------------

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

        const data = capacities.map((e) => {
          const preAllocatedCount = projects.filter((p) => {
            return p.supervisorId === e.userId && p.preAllocatedStudentId;
          }).length;

          const alreadySubmitted = projects.filter((p) => {
            return p.supervisorId === e.userId && !p.preAllocatedStudentId;
          }).length;

          const submissionTarget = computeProjectSubmissionTarget(
            e.projectAllocationTarget,
            preAllocatedCount,
          );

          return {
            submissionTarget,
            alreadySubmitted,
            ...e,
          };
        });

        return data;
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
            submittedPreferences: true,
          },
        });

        const studentData = data.map(
          ({ userId, studentPreferences, submittedPreferences }) => {
            return {
              userId,
              submissionCount: studentPreferences.length,
              submittedPreferences,
            };
          },
        );
        return { studentData, preferenceCapacities };
      },
    ),
});
