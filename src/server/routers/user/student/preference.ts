import { PreferenceType, Role, Stage } from "@prisma/client";
import { z } from "zod";

import { stageGte } from "@/lib/utils/permissions/stage-check";
import { BoardColumn, ProjectPreference } from "@/lib/validations/board";
import { instanceParamsSchema } from "@/lib/validations/params";
import { studentPreferenceSchema } from "@/lib/validations/student-preference";

import {
  createTRPCRouter,
  instanceAdminProcedure,
  instanceProcedure,
  roleAwareProcedure,
  studentProcedure,
} from "@/server/trpc";

import { updatePreferenceTransaction } from "./_utils/update-preference";
import { updateManyPreferenceTransaction } from "./_utils/update-many-preferences";

export const preferenceRouter = createTRPCRouter({
  getAll: instanceAdminProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        studentId: z.string(),
      }),
    )
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          studentId,
        },
      }) => {
        const studentProjectPreferenceDetails =
          await ctx.db.preference.findMany({
            where: {
              allocationGroupId: group,
              allocationInstanceId: instance,
              allocationSubGroupId: subGroup,
              userId: studentId,
            },
            select: {
              type: true,
              rank: true,
              project: {
                select: {
                  title: true,
                  id: true,
                  supervisor: {
                    select: { user: { select: { name: true, id: true } } },
                  },
                },
              },
            },
          });
        return studentProjectPreferenceDetails.map(
          ({ project, type, rank }) => ({
            project: { id: project.id, title: project.title },
            supervisor: {
              name: project.supervisor.user.name,
              id: project.supervisor.user.id,
            },
            type: type,
            rank: rank,
          }),
        );
      },
    ),

  getByProject: roleAwareProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const role = ctx.session.user.role;

        if (role !== Role.STUDENT) return new Map<string, PreferenceType>();

        const student = await ctx.db.studentDetails.findFirstOrThrow({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            userId: ctx.session.user.id,
          },
          select: {
            userInInstance: {
              select: {
                studentPreferences: { select: { projectId: true, type: true } },
              },
            },
          },
        });

        const preferenceByProject = new Map<string, PreferenceType>();

        student.userInInstance.studentPreferences.forEach(
          ({ projectId, type }) => {
            preferenceByProject.set(projectId, type);
          },
        );

        return preferenceByProject;
      },
    ),

  update: studentProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        projectId: z.string(),
        preferenceType: studentPreferenceSchema,
      }),
    )
    .mutation(async ({ ctx, input: { params, projectId, preferenceType } }) => {
      if (ctx.instance.stage !== Stage.PROJECT_SELECTION) return;

      await updatePreferenceTransaction({
        db: ctx.db,
        student: ctx.session.user,
        params,
        projectId,
        preferenceType,
      });
    }),

  updateSelected: studentProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        projectIds: z.array(z.string()),
        preferenceType: studentPreferenceSchema,
      }),
    )
    .mutation(
      async ({ ctx, input: { params, projectIds, preferenceType } }) => {
        if (ctx.instance.stage !== Stage.PROJECT_SELECTION) return;

        await updateManyPreferenceTransaction({
          db: ctx.db,
          student: ctx.session.user,
          params,
          projectIds,
          preferenceType,
        });
      },
    ),

  reorder: studentProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        projectId: z.string(),
        preferenceType: z.nativeEnum(PreferenceType),
        updatedRank: z.number(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          projectId,
          preferenceType,
          updatedRank,
        },
      }) => {
        if (stageGte(ctx.instance.stage, Stage.PROJECT_ALLOCATION)) return;

        await ctx.db.preference.update({
          where: {
            preferenceId: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              projectId,
              userId: ctx.session.user.id,
            },
          },
          data: {
            type: preferenceType,
            rank: updatedRank,
          },
        });
      },
    ),

  getForProject: instanceProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        projectId: z.string(),
      }),
    )
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          projectId,
        },
      }) => {
        const preference = await ctx.db.preference.findFirst({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            projectId,
            userId: ctx.session.user.id,
          },
          select: { type: true },
        });

        return preference ? preference.type : "None";
      },
    ),

  submit: studentProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        if (stageGte(ctx.instance.stage, Stage.PROJECT_ALLOCATION)) {
          throw new Error("Cannot submit at this stage");
        }

        const newSubmissionDateTime = new Date();

        await ctx.db.studentDetails.update({
          where: {
            detailsId: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              userId: ctx.session.user.id,
            },
          },
          data: {
            submittedPreferences: true,
            latestSubmissionDateTime: newSubmissionDateTime,
          },
        });

        return newSubmissionDateTime;
      },
    ),

  initialBoardState: studentProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const res = await ctx.db.preference.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            userId: ctx.session.user.id,
          },
          select: {
            project: {
              select: {
                id: true,
                title: true,
                supervisor: {
                  select: { user: { select: { id: true, name: true } } },
                },
              },
            },
            rank: true,
            type: true,
          },
          orderBy: { rank: "asc" },
        });

        const initialColumns: BoardColumn[] = [
          { id: PreferenceType.PREFERENCE, displayName: "Preference List" },
          { id: PreferenceType.SHORTLIST, displayName: "Shortlist" },
        ];

        const initialProjects: ProjectPreference[] = res.map((e) => ({
          id: e.project.id,
          title: e.project.title,
          columnId: e.type,
          rank: e.rank,
          supervisorId: e.project.supervisor.user.id,
          supervisorName: e.project.supervisor.user.name!,
          changed: false,
        }));

        return { initialColumns, initialProjects };
      },
    ),

  change: instanceAdminProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        studentId: z.string(),
        projectId: z.string(),
        newPreferenceType: studentPreferenceSchema,
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          studentId,
          projectId,
          newPreferenceType,
        },
      }) => {
        if (newPreferenceType === "None") {
          await ctx.db.preference.delete({
            where: {
              preferenceId: {
                allocationGroupId: group,
                allocationSubGroupId: subGroup,
                allocationInstanceId: instance,
                projectId,
                userId: studentId,
              },
            },
          });
          return;
        }

        await ctx.db.preference.update({
          where: {
            preferenceId: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              projectId,
              userId: studentId,
            },
          },
          data: { type: newPreferenceType },
        });
      },
    ),

  changeSelected: instanceAdminProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        studentId: z.string(),
        newPreferenceType: z.nativeEnum(PreferenceType).or(z.literal("None")),
        projectIds: z.array(z.string()),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          studentId,
          newPreferenceType,
          projectIds,
        },
      }) => {
        if (newPreferenceType === "None") {
          await ctx.db.preference.deleteMany({
            where: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              userId: studentId,
              projectId: { in: projectIds },
            },
          });
          return;
        }

        await ctx.db.preference.updateMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            userId: studentId,
            projectId: { in: projectIds },
          },
          data: { type: newPreferenceType },
        });
      },
    ),
});
