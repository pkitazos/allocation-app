import { z } from "zod";

import { findByUserId } from "@/lib/utils/general/find-by-user-id";
import { instanceParamsSchema } from "@/lib/validations/params";
import { SupervisorProjectSubmissionDetails } from "@/lib/validations/supervisor-project-submission-details";

import {
  createTRPCRouter,
  instanceAdminProcedure,
  instanceMiddleware,
} from "@/server/trpc";
import { computeProjectSubmissionTarget } from "@/server/utils/instance/submission-target";

import { getPreAllocatedStudents } from "./_utils/pre-allocated-students";
import { computeSubmissionDetails } from "./_utils/submission-details";

export const projectRouter = createTRPCRouter({
  submissionInfo: instanceAdminProcedure
    .use(instanceMiddleware)
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const parentInstanceId = ctx.instance.parentInstanceId;

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
              let parentAllocationCount = 0;
              try {
                parentAllocationCount = findByUserId(
                  parentInstanceSubmissionDetails,
                  userId,
                ).allocatedCount;
              } catch (e) {
                // this means the supervisor is new
                // so they don't have an equivalent in the parent instance
                parentAllocationCount = 0;
              }

              const newAllocatedCount =
                forked.allocatedCount + parentAllocationCount;

              const newSubmissionTarget = computeProjectSubmissionTarget(
                projectAllocationTarget,
                newAllocatedCount,
              );

              submissionDetails.push({
                userId,
                name: forked.name,
                email: forked.email,
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

        return submissionDetails.map((c) => ({
          ...c,
          targetMet: c.submittedProjectsCount >= c.submissionTarget,
        }));
      },
    ),

  preferenceInfo: instanceAdminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const studentData = await ctx.db.studentDetails.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: {
            submittedPreferences: true,
            userInInstance: {
              select: {
                user: { select: { id: true, name: true, email: true } },
                studentPreferences: true,
              },
            },
          },
        });

        const preAllocatedStudents = await getPreAllocatedStudents(ctx.db, {
          group,
          subGroup,
          instance,
        });

        const all = studentData.map(
          ({ userInInstance, submittedPreferences }) => ({
            ...userInInstance.user,
            submissionCount: userInInstance.studentPreferences.length,
            submitted: submittedPreferences,
            preAllocated: preAllocatedStudents.has(userInInstance.user.id),
          }),
        );

        return {
          all,
          incomplete: all.filter((s) => !s.submitted && !s.preAllocated),
          preAllocated: all.filter((s) => s.preAllocated),
        };
      },
    ),
});
