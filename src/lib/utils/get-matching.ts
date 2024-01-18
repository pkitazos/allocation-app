import { env } from "@/env";

import { generateArgs } from "@/lib/utils/generate-args";
import {
  Algorithm,
  MatchingData,
  MatchingDataWithArgs,
  builtInAlgSchema,
  serverResponseSchema,
} from "../validations/algorithm";

export async function getMatching({
  algorithm: { algName, flag1, flag2, flag3 },
  matchingData,
}: {
  algorithm: Algorithm;
  matchingData: MatchingData | MatchingDataWithArgs;
}) {
  const endpoint = (builtInAlgSchema.options as string[]).includes(algName)
    ? algName
    : "";

  if (endpoint === "") {
    matchingData = {
      ...matchingData,
      args: generateArgs({ flag1, flag2, flag3 }),
    };
  }

  const res = await fetch(`${env.SERVER_URL}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(matchingData),
  }).then((res) => res.json());

  console.log("PARSING -------------", res.data);

  const result = serverResponseSchema.safeParse(res.data);

  if (!result.success) return;

  return result.data;
}