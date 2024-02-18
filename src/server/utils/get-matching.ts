import { env } from "@/env";

import { Algorithm, builtInAlgSchema } from "@/lib/validations/algorithm";
import {
  MatchingData,
  MatchingDataWithArgs,
  serverResponseSchema,
} from "@/lib/validations/matching";
import { generateArgs } from "@/server/utils/generate-args";

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

  const result = serverResponseSchema.safeParse(res.data);

  if (!result.success) return;
  return result.data;
}
