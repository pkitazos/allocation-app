import { AlgorithmFlag } from "@prisma/client";

export function generateArgs({
  flag1,
  flag2,
  flag3,
}: {
  flag1: AlgorithmFlag;
  flag2: AlgorithmFlag;
  flag3: AlgorithmFlag;
}) {
  const toArg = (flag: AlgorithmFlag) => `-${flag.toLowerCase()}`;
  const args = [
    "-na",
    "3",
    toArg(flag1),
    "1",
    toArg(flag2),
    "2",
    toArg(flag3),
    "3",
  ];
  return args;
}
