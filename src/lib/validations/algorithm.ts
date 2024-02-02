import { AlgorithmFlag } from "@prisma/client";
import { z } from "zod";

export const algorithmFlagSchema = z.nativeEnum(AlgorithmFlag);

export const builtInAlgSchema = z.enum([
  "generous",
  "greedy",
  "minimum-cost",
  "greedy-generous",
]);

export type BuiltInAlg = z.infer<typeof builtInAlgSchema>;

export const algorithmSchema = z.object({
  algName: z.string(),
  displayName: z.string(),
  description: z.string(),
  flag1: z.nativeEnum(AlgorithmFlag),
  flag2: z.nativeEnum(AlgorithmFlag).nullable(),
  flag3: z.nativeEnum(AlgorithmFlag).nullable(),
});

export type Algorithm = z.infer<typeof algorithmSchema>;
