import { env } from "@/env";
import { adminProcedure, createTRPCRouter } from "@/server/trpc";
import { instanceParamsSchema } from "@/lib/validations/params";
import {
  builtInAlgSchema,
  matchingDataSchema,
  algorithmFlag,
  mathcingDataWithArgsSchema,
  AlgorithmServerData,
  serverResponseDataSchema,
} from "@/lib/validations/algorithm";
import { z } from "zod";

export const algorithmRouter = createTRPCRouter({
  run: adminProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        algorithm: builtInAlgSchema,
        matchingData: matchingDataSchema,
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          algorithm,
          matchingData,
        },
      }) => {
        const serverResult = await getMatching({
          algorithm,
          matchingData,
        });

        if (!serverResult) return undefined;

        const result = { ...serverResult, selected: false };

        await ctx.db.algorithmResult.upsert({
          where: {
            name_allocationGroupId_allocationSubGroupId_allocationInstanceId: {
              name: algorithm,
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
            },
          },
          update: {
            data: JSON.stringify(result),
          },
          create: {
            name: algorithm,
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            algFlag1: "MAXSIZE",
            algFlag2: algorithmFlag[algorithm],
            algFlag3: "LSB",
            data: JSON.stringify(result),
          },
        });

        return result;
      },
    ),

  // TODO: decide how to name custom Algorithm configurations
  custom: adminProcedure
    .input(mathcingDataWithArgsSchema)
    .mutation(async ({ input: matchingData }) => {
      const result = await getMatching({ algorithm: "custom", matchingData });
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

  console.log("from getMatching", res);
  if (res.ok) console.log(res);

  const result = serverResponseDataSchema.safeParse(res.data);
  console.log("from getMatching", result);

  if (!result.success) return;

  return result.data;
};
