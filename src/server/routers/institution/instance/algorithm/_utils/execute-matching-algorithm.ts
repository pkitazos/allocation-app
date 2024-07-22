import axios from "axios";

import { Algorithm, builtInAlgSchema } from "@/lib/validations/algorithm";
import {
  MatchingData,
  MatchingDataWithArgs,
  serverResponseSchema,
} from "@/lib/validations/matching";

import { env } from "@/env";

import { generateArgs } from "./generate-args";

export async function executeMatchingAlgorithm({
  algorithm: { algName, flag1, flag2, flag3 },
  matchingData,
}: {
  algorithm: Algorithm;
  matchingData: MatchingData | MatchingDataWithArgs;
}) {
  const endpoint = builtInAlgSchema.safeParse(algName).success ? algName : "";

  if (endpoint === "") {
    matchingData = {
      ...matchingData,
      args: generateArgs({ flag1, flag2, flag3 }),
    };
  }

  const result = await axios
    .post(`${env.SERVER_URL}/${endpoint}`, matchingData)
    .then((res) => serverResponseSchema.safeParse(res.data));

  if (!result.success) return;

  const serverResponse = result.data;
  console.log("---->>", serverResponse);
  if (serverResponse.status === 400) {
    // throw new TRPCClientError("Infeasible");
    return;
  } // if infeasible will exit here, perhaps we should bubble up the error
  console.log("====>>", serverResponse.data);

  return serverResponse.data;
}
