import { algorithmSchema } from "@/lib/validations/algorithm";
import { AlgorithmFlag } from "@prisma/client";
import { z } from "zod";

const toArg = (flag: AlgorithmFlag) => `-${flag.toLowerCase()}`;

const algFlagsSchema = algorithmSchema.pick({
  flag1: true,
  flag2: true,
  flag3: true,
});
type algFlags = z.infer<typeof algFlagsSchema>;

export function generateArgs({ flag1, flag2, flag3 }: algFlags) {
  const args = ["-na", "3", toArg(flag1), "1"];

  if (flag2) args.push(...[toArg(flag2), "2"]);
  if (flag3) args.push(...[toArg(flag3), "3"]);

  return args;
}
