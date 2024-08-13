import { Role } from "@prisma/client";
import { z } from "zod";

import {
  GenerousAlgorithm,
  GreedyAlgorithm,
  GreedyGenAlgorithm,
  MinCostAlgorithm,
} from "@/lib/algorithms";
import { relativeComplement } from "@/lib/utils/general/set-difference";
import { algorithmSchema, builtInAlgSchema } from "@/lib/validations/algorithm";
import {
  blankResult,
  MatchingDetailsDto,
  matchingResultSchema,
} from "@/lib/validations/matching";
import { instanceParamsSchema } from "@/lib/validations/params";

import { createTRPCRouter, instanceAdminProcedure } from "@/server/trpc";

import { executeMatchingAlgorithm } from "./_utils/execute-matching-algorithm";
import {
  extractMatchingDetails,
  parseMatchingResult,
} from "./_utils/extract-matching-details";
import { getMatchingData } from "./_utils/get-matching-data";

export const algorithmRouter = createTRPCRouter({
  run: instanceAdminProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        algorithm: algorithmSchema,
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          algorithm,
        },
      }) => {
        const matchingData = await getMatchingData(ctx.db, ctx.instance);

        const matchingResults = await executeMatchingAlgorithm({
          algorithm,
          matchingData,
        });

        // TODO: validate results before saving

        await ctx.db.algorithm.update({
          where: {
            algorithmId: {
              algName: algorithm.algName,
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
            },
          },
          data: {
            matchingResultData: JSON.stringify(matchingResults),
          },
        });

        return {
          totalStudents: matchingData.students.length,
          matchedStudents: matchingResults.size,
        };
      },
    ),

  takenNames: instanceAdminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const takenNames = await ctx.db.algorithm.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: { algName: true },
        });
        return takenNames.map(({ algName }) => algName);
      },
    ),

  create: instanceAdminProcedure
    .input(
      algorithmSchema
        .pick({ algName: true, flag1: true, flag2: true, flag3: true })
        .extend({ params: instanceParamsSchema }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          algName,
          flag1,
          flag2,
          flag3,
        },
      }) => {
        await ctx.db.algorithm.create({
          data: {
            algName,
            displayName: algName,
            description: "description",
            flag1,
            flag2,
            flag3,
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            matchingResultData: JSON.stringify({}),
          },
        });
      },
    ),

  customAlgs: instanceAdminProcedure
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
        return await ctx.db.algorithm.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            NOT: builtInAlgSchema.options.map((algName) => ({ algName })),
          },
          select: {
            algName: true,
            displayName: true,
            description: true,
            flag1: true,
            flag2: true,
            flag3: true,
          },
        });
      },
    ),

  singleResult: instanceAdminProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        algName: z.string(),
      }),
    )
    .query(
      async ({
        ctx,
        input: {
          algName,
          params: { group, subGroup, instance },
        },
      }) => {
        const res = await ctx.db.algorithm.findFirst({
          where: {
            algName,
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: { matchingResultData: true },
        });

        if (!res) return blankResult;

        const result = matchingResultSchema.safeParse(
          JSON.parse(res.matchingResultData as string),
        );

        if (!result.success) return blankResult;

        return result.data;
      },
    ),

  allResults: instanceAdminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const algorithmData = await ctx.db.algorithm.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: {
            algName: true,
            displayName: true,
            matchingResultData: true,
          },
          orderBy: { algName: "asc" },
        });

        const { projects, users } =
          await ctx.db.allocationInstance.findFirstOrThrow({
            where: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              id: instance,
            },
            select: {
              projects: true,
              users: {
                where: { role: Role.STUDENT },
                select: { user: { select: { id: true, name: true } } },
              },
            },
          });

        const students = users.map((u) => ({
          name: u.user.name!,
          id: u.user.id,
        }));

        const resultsByAlgName = new Map<string, MatchingDetailsDto[]>();

        for (const { algName, matchingResultData: data } of algorithmData) {
          const matching = parseMatchingResult(data).matching;

          const details = matching.map((m) =>
            extractMatchingDetails(
              students,
              projects,
              m.student_id,
              m.project_id,
              m.preference_rank,
            ),
          );

          resultsByAlgName.set(algName, details);
        }

        const builtInAlgs = [
          GenerousAlgorithm,
          GreedyAlgorithm,
          GreedyGenAlgorithm,
          MinCostAlgorithm,
        ];

        const customAlgs = relativeComplement(
          algorithmData,
          builtInAlgs,
          (a, b) => a.algName === b.algName,
        );

        const allAlgorithms = [...builtInAlgs, ...customAlgs];

        const results = allAlgorithms.map(({ algName, displayName }) => ({
          algName,
          displayName,
          data: resultsByAlgName.get(algName) ?? [],
        }));

        const firstNonEmptyIdx = results.findIndex((r) => r.data.length > 0);

        return {
          results,
          firstNonEmpty: results.at(firstNonEmptyIdx)?.algName,
        };
      },
    ),
});
