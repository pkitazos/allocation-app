import { TRPCClientError } from "@trpc/client";
import axios from "axios";

import { Algorithm, builtInAlgSchema } from "@/lib/validations/algorithm";
import {
  MatchingDataDto,
  MatchingDataWithArgs,
  serverResponseSchema,
} from "@/lib/validations/matching";

import { generateArgs } from "./generate-args";

import { env } from "@/env";

export async function executeMatchingAlgorithm({
  algorithm: { algName, flag1, flag2, flag3 },
  matchingData,
}: {
  algorithm: Algorithm;
  matchingData: MatchingDataDto | MatchingDataWithArgs;
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

  if (!result.success) {
    throw new TRPCClientError(
      "Matching server did not return a valid response",
    );
  }

  const serverResponse = result.data;
  if (serverResponse.status === 400) {
    throw new TRPCClientError("Infeasible");
  }

  if (!serverResponse.data) {
    throw new TRPCClientError("Matching server did not return any data");
  }

  return serverResponse.data;
}
