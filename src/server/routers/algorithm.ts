import { z } from "zod";

import { getMatching } from "@/server/utils/get-matching";
import {
  algorithmSchema,
  matchingDataSchema,
} from "@/lib/validations/algorithm";
import { instanceParamsSchema } from "@/lib/validations/params";
import { adminProcedure, createTRPCRouter } from "@/server/trpc";

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
        const serverResult = await getMatching({ algorithm, matchingData });
        console.log("from RUN ----------------------", serverResult);
        if (!serverResult) return undefined;

        console.log("from RUN ----------------------", serverResult);

        await ctx.db.algorithm.update({
          where: {
            algName_allocationGroupId_allocationSubGroupId_allocationInstanceId:
              {
                algName: algorithm.algName,
                allocationGroupId: group,
                allocationSubGroupId: subGroup,
                allocationInstanceId: instance,
              },
          },
          data: {
            matchingResultData: JSON.stringify(serverResult),
          },
        });

        return serverResult;
      },
    ),
});
