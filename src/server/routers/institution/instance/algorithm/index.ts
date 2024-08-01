import { z } from "zod";

import { algorithmSchema, builtInAlgSchema } from "@/lib/validations/algorithm";
import {
  blankResult,
  MatchingResult,
  matchingResultSchema,
} from "@/lib/validations/matching";
import { instanceParamsSchema } from "@/lib/validations/params";

import { createTRPCRouter, instanceAdminProcedure } from "@/server/trpc";

import { executeMatchingAlgorithm } from "./_utils/execute-matching-algorithm";
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
        const matchingData = await getMatchingData(ctx.db, {
          group,
          subGroup,
          instance,
        });

        const matchingResults = await executeMatchingAlgorithm({
          algorithm,
          matchingData,
        });

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

  // TODO: refactor as the way to compute firstNonEmpty is not very intuitive
  allResults: instanceAdminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const results = await ctx.db.algorithm.findMany({
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

        type tableData = {
          algName: string;
          displayName: string;
          data: MatchingResult;
        };

        if (results.length === 0) {
          return { results: [] as tableData[], firstNonEmpty: 0 };
        }

        const nonEmpty: number[] = [];
        const data = results.map(
          ({ algName, displayName, matchingResultData }, i) => {
            const res = matchingResultSchema.safeParse(
              JSON.parse(matchingResultData as string),
            );
            const data = res.success ? res.data : blankResult;
            if (data.matching.length !== 0) nonEmpty.push(i);
            return {
              algName,
              displayName,
              data,
            };
          },
        );

        return { results: data, firstNonEmpty: nonEmpty[0] };
      },
    ),
});
