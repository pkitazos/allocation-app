import { PreferenceType, Stage } from "@prisma/client";
import { z } from "zod";

import { stageCheck } from "@/lib/utils/permissions/stage-check";
import { BoardColumn, ProjectPreference } from "@/lib/validations/board";
import { instanceParamsSchema } from "@/lib/validations/params";
import { studentPreferenceSchema } from "@/lib/validations/student-preference";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  stageAwareProcedure,
} from "@/server/trpc";

export const preferenceRouter = createTRPCRouter({
  getAll: stageAwareProcedure
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
        const data = await ctx.db.preference.findMany({
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
        return data.map(({ project, type, rank }) => ({
          project: { id: project.id, title: project.title },
          supervisor: {
            name: project.supervisor.user.name,
            id: project.supervisor.user.id,
          },
          type: type,
          rank: rank,
        }));
      },
    ),

  update: stageAwareProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        projectId: z.string(),
        preferenceType: studentPreferenceSchema,
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          projectId,
          preferenceType,
        },
      }) => {
        if (ctx.stage !== Stage.PROJECT_SELECTION) return;

        const userId = ctx.session.user.id;

        if (preferenceType === "None") {
          await ctx.db.preference.delete({
            where: {
              preferenceId: {
                allocationGroupId: group,
                allocationSubGroupId: subGroup,
                allocationInstanceId: instance,
                projectId,
                userId,
              },
            },
          });
          return;
        }

        const allPreferences = await ctx.db.preference.groupBy({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            userId,
          },
          by: "type",
          _max: { rank: true },
        });

        const maxRankPerType = {
          [PreferenceType.PREFERENCE]:
            allPreferences.find(
              ({ type }) => type === PreferenceType.PREFERENCE,
            )?._max.rank ?? 1,

          [PreferenceType.SHORTLIST]:
            allPreferences.find(({ type }) => type === PreferenceType.SHORTLIST)
              ?._max.rank ?? 1,
        };

        const currentPreference = await ctx.db.preference.findFirst({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            projectId,
            userId,
          },
        });

        if (!currentPreference) {
          await ctx.db.preference.create({
            data: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              projectId,
              userId,
              type: preferenceType,
              rank: maxRankPerType[preferenceType] + 1,
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
              userId,
            },
          },
          data: {
            type: preferenceType,
            rank: maxRankPerType[preferenceType] + 1,
          },
        });
        return;
      },
    ),

  reorder: stageAwareProcedure
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
        if (stageCheck(ctx.stage, Stage.PROJECT_ALLOCATION)) return;

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

  getForProject: protectedProcedure
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

  submit: stageAwareProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        if (stageCheck(ctx.stage, Stage.PROJECT_ALLOCATION)) return;

        await ctx.db.userInInstance.update({
          where: {
            instanceMembership: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              userId: ctx.session.user.id,
            },
          },
          data: { submittedPreferences: true },
        });
      },
    ),

  initialBoardState: protectedProcedure
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

  change: adminProcedure
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

  changeAll: adminProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        studentId: z.string(),
        newPreferenceType: z.nativeEnum(PreferenceType).or(z.literal("None")),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          studentId,
          newPreferenceType,
        },
      }) => {
        if (newPreferenceType === "None") {
          await ctx.db.preference.deleteMany({
            where: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              userId: studentId,
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
          },
          data: { type: newPreferenceType },
        });
      },
    ),
});
