import { env } from "@/env";
import { algorithmSchema } from "@/lib/algorithms";
import {
  AlgorithmServerData,
  matchingDataSchema,
  mathcingDataWithArgsSchema,
  serverResponseDataSchema,
} from "@/lib/validations/algorithm";
import { instanceParamsSchema } from "@/lib/validations/params";
import { adminProcedure, createTRPCRouter } from "@/server/trpc";
import { z } from "zod";

export const algorithmRouter = createTRPCRouter({
  run: adminProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        algorithm: algorithmSchema,
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
          algName: algorithm.algName,
          matchingData,
        });

        if (!serverResult) return undefined;

        const result = { ...serverResult, selected: false };

        await ctx.db.algorithmResult.upsert({
          where: {
            name_allocationGroupId_allocationSubGroupId_allocationInstanceId: {
              name: algorithm.algName,
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
            },
          },
          update: {
            data: JSON.stringify(result),
          },
          create: {
            name: algorithm.algName,
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            algFlag1: "MAXSIZE",
            algFlag2: algorithm.flag,
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
      const result = await getMatching({ algName: "custom", matchingData });
      return result;
    }),
});

const getMatching = async ({ algName, matchingData }: AlgorithmServerData) => {
  const res = await fetch(`${env.SERVER_URL}/${algName}`, {
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
