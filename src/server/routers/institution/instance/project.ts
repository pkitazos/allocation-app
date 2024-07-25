import { Role } from "@prisma/client";
import { z } from "zod";

import { findByUserId } from "@/lib/utils/general/find-by-user-id";
import { instanceParamsSchema } from "@/lib/validations/params";
import { SupervisorProjectSubmissionDetails } from "@/lib/validations/supervisor-project-submission-details";

import {
  adminProcedure,
  createTRPCRouter,
  forkedInstanceProcedure,
} from "@/server/trpc";
import { computeProjectSubmissionTarget } from "@/server/utils/submission-target";

import { computeSubmissionDetails } from "./_utils/submission-details";

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

        const submissionDetails: SupervisorProjectSubmissionDetails[] = [];

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

          forkedInstanceSubmissionDetails.forEach(
            ({ projectAllocationTarget, userId, ...forked }) => {
              const parent = findByUserId(
                parentInstanceSubmissionDetails,
                userId,
              );

              const newAllocatedCount =
                forked.allocatedCount + parent.allocatedCount;

              const newSubmissionTarget = computeProjectSubmissionTarget(
                projectAllocationTarget,
                newAllocatedCount,
              );

              submissionDetails.push({
                userId,
                projectAllocationTarget,
                allocatedCount: newAllocatedCount,
                submittedProjectsCount: forked.submittedProjectsCount,
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

        return submissionDetails;
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
