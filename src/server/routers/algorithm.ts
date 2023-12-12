import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "@/env";

const matchingDataSchema = z.object({
  students: z.array(z.array(z.string())),
  projects: z.array(z.tuple([z.string(), z.number(), z.number(), z.string()])),
  lecturers: z.array(z.tuple([z.string(), z.number(), z.number(), z.number()])),
});

const mathcingDataWithArgsSchema = z.object({
  students: z.array(z.array(z.string())),
  projects: z.array(z.tuple([z.string(), z.number(), z.number(), z.string()])),
  lecturers: z.array(z.tuple([z.string(), z.number(), z.number(), z.number()])),
  args: z.array(z.string()),
});

export type MatchingData = z.infer<typeof matchingDataSchema>;

type MatchingDataWithArgs = z.infer<typeof mathcingDataWithArgsSchema>;

type AlgorithmServerData =
  | { algorithm: ""; matchingData: MatchingDataWithArgs }
  | { algorithm: string; matchingData: MatchingData };

export const algorithmRouter = createTRPCRouter({
  generous: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
        subGroupId: z.string(),
        instanceId: z.string(),
        matchingData: matchingDataSchema,
      }),
    )
    .mutation(
      async ({
        ctx,
        input: { groupId, subGroupId, instanceId, matchingData },
      }) => {
        const result = await getMatching({
          algorithm: "generous",
          matchingData,
        });

        if (result) {
          const hello = await ctx.db.algorithmResult.upsert({
            where: {
              name_allocationGroupId_allocationSubGroupId_allocationInstanceId:
                {
                  name: "generous",
                  allocationGroupId: groupId,
                  allocationSubGroupId: subGroupId,
                  allocationInstanceId: instanceId,
                },
            },
            update: {
              data: JSON.stringify(result),
            },
            create: {
              name: "generous",
              allocationGroupId: groupId,
              allocationSubGroupId: subGroupId,
              allocationInstanceId: instanceId,
              algFlag1: "MAXSIZE",
              algFlag2: "GEN",
              algFlag3: "LSB",
              data: JSON.stringify(result),
            },
          });
          console.log(hello);
        }

        return result;
      },
    ),

  greedy: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
        subGroupId: z.string(),
        instanceId: z.string(),
        matchingData: matchingDataSchema,
      }),
    )
    .mutation(
      async ({
        ctx,
        input: { groupId, subGroupId, instanceId, matchingData },
      }) => {
        const result = await getMatching({ algorithm: "greedy", matchingData });

        if (result) {
          await ctx.db.algorithmResult.upsert({
            where: {
              name_allocationGroupId_allocationSubGroupId_allocationInstanceId:
                {
                  name: "greedy",
                  allocationGroupId: groupId,
                  allocationSubGroupId: subGroupId,
                  allocationInstanceId: instanceId,
                },
            },
            update: {
              data: JSON.stringify(result),
            },
            create: {
              name: "greedy",
              allocationGroupId: groupId,
              allocationSubGroupId: subGroupId,
              allocationInstanceId: instanceId,
              algFlag1: "MAXSIZE",
              algFlag2: "GRE",
              algFlag3: "LSB",
              data: JSON.stringify(result),
            },
          });
        }
        return result;
      },
    ),

  minCost: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
        subGroupId: z.string(),
        instanceId: z.string(),
        matchingData: matchingDataSchema,
      }),
    )
    .mutation(
      async ({
        ctx,
        input: { groupId, subGroupId, instanceId, matchingData },
      }) => {
        const result = await getMatching({
          algorithm: "minimum-cost",
          matchingData,
        });

        if (result) {
          await ctx.db.algorithmResult.upsert({
            where: {
              name_allocationGroupId_allocationSubGroupId_allocationInstanceId:
                {
                  name: "minimum-cost",
                  allocationGroupId: groupId,
                  allocationSubGroupId: subGroupId,
                  allocationInstanceId: instanceId,
                },
            },
            update: {
              data: JSON.stringify(result),
            },
            create: {
              name: "minimum-cost",
              allocationGroupId: groupId,
              allocationSubGroupId: subGroupId,
              allocationInstanceId: instanceId,
              algFlag1: "MAXSIZE",
              algFlag2: "MINCOST",
              algFlag3: "LSB",
              data: JSON.stringify(result),
            },
          });
        }
        return result;
      },
    ),

  greedyGen: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
        subGroupId: z.string(),
        instanceId: z.string(),
        matchingData: matchingDataSchema,
      }),
    )
    .mutation(
      async ({
        ctx,
        input: { groupId, subGroupId, instanceId, matchingData },
      }) => {
        const result = await getMatching({
          algorithm: "greedy-generous",
          matchingData,
        });

        if (result) {
          await ctx.db.algorithmResult.upsert({
            where: {
              name_allocationGroupId_allocationSubGroupId_allocationInstanceId:
                {
                  name: "greedy-generous",
                  allocationGroupId: groupId,
                  allocationSubGroupId: subGroupId,
                  allocationInstanceId: instanceId,
                },
            },
            update: {
              data: JSON.stringify(result),
            },
            create: {
              name: "greedy-generous",
              allocationGroupId: groupId,
              allocationSubGroupId: subGroupId,
              allocationInstanceId: instanceId,
              algFlag1: "MAXSIZE",
              algFlag2: "GRE",
              algFlag3: "LSB",
              data: JSON.stringify(result),
            },
          });
        }
        return result;
      },
    ),

  // TODO: decide how to name custom Algorithm configurations
  custom: publicProcedure
    .input(mathcingDataWithArgsSchema)
    .mutation(async ({ input: matchingData }) => {
      const result = await getMatching({ algorithm: "", matchingData });
      return result;
    }),
});

const getMatching = async ({
  algorithm,
  matchingData,
}: AlgorithmServerData) => {
  const res = await fetch(`${env.SERVER_URL}/${algorithm}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(matchingData),
  }).then((res) => res.json());

  if (res.ok) console.log(res);
  const result = serverResponseDataSchema.safeParse(res.data);

  if (!result.success) return;

  return result.data;
};

export const serverResponseDataSchema = z.object({
  matching: z.array(z.tuple([z.string(), z.string(), z.number()])),
  profile: z.array(z.number()),
  weight: z.number(),
  size: z.number(),
  degree: z.number(),
});

export type ServerResponseData = z.infer<typeof serverResponseDataSchema>;
