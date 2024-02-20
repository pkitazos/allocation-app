import { PreferenceType, Stage } from "@prisma/client";
import { z } from "zod";

import { stageCheck } from "@/lib/utils/permissions/stage-check";
import { BoardColumn, ProjectPreference } from "@/lib/validations/board";
import { instanceParamsSchema } from "@/lib/validations/params";

import {
  createTRPCRouter,
  protectedProcedure,
  stageAwareProcedure,
} from "@/server/trpc";

export const preferenceRouter = createTRPCRouter({
  update: stageAwareProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        projectId: z.string(),
        preferenceType: z.nativeEnum(PreferenceType).or(z.literal("None")),
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
});
