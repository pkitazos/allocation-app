import { AES, enc } from "crypto-js";

import { EVALUATORS, to_ID } from "@/lib/db/data";
import { zeros } from "@/lib/utils/general/zeros";

import { env } from "@/env";

function decrypt(password: string, key: string) {
  const bytes = AES.decrypt(password, key);
  return bytes.toString(enc.Utf8);
}

export function getEvaluatorID(password: unknown) {
  const allIDs = zeros(EVALUATORS).map((_, i) => to_ID(i + 1));
  const ID = decrypt(password as string, env.ID_KEY);
  return allIDs.includes(ID) ? ID : null;
}
