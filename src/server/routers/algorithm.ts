import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "@/env";

const matchingDataSchema = z.object({
  students: z.array(z.array(z.number())),
  projects: z.array(z.array(z.number())),
  lecturers: z.array(z.array(z.number())),
});

const mathcingDataWithArgsSchema = z.object({
  students: z.array(z.array(z.number())),
  projects: z.array(z.array(z.number())),
  lecturers: z.array(z.array(z.number())),
  args: z.array(z.string()),
});

export type MatchingData = z.infer<typeof matchingDataSchema>;

type MatchingDataWithArgs = z.infer<typeof mathcingDataWithArgsSchema>;

type AlgorithmServerData =
  | { algorithm: ""; matchingData: MatchingDataWithArgs }
  | { algorithm: string; matchingData: MatchingData };

export const algorithmRouter = createTRPCRouter({
  generous: publicProcedure
    .input(matchingDataSchema)
    .mutation(async ({ input: matchingData }) => {
      const result = await getMatching({ algorithm: "generous", matchingData });
      console.log(result);
    }),

  greedy: publicProcedure
    .input(matchingDataSchema)
    .mutation(async ({ input: matchingData }) => {
      const result = await getMatching({ algorithm: "greedy", matchingData });
      console.log(result);
    }),

  minCost: publicProcedure
    .input(matchingDataSchema)
    .mutation(async ({ input: matchingData }) => {
      const result = await getMatching({
        algorithm: "minimum-cost",
        matchingData,
      });
      console.log(result);
    }),

  greedyGen: publicProcedure
    .input(matchingDataSchema)
    .mutation(async ({ input: matchingData }) => {
      const result = await getMatching({
        algorithm: "greedy-generous",
        matchingData,
      });
      console.log(result);
    }),

  custom: publicProcedure
    .input(mathcingDataWithArgsSchema)
    .mutation(async ({ input: matchingData }) => {
      const result = await getMatching({ algorithm: "", matchingData });
      console.log(result);
    }),
});

const getMatching = async ({
  algorithm,
  matchingData,
}: AlgorithmServerData) => {
  const res = await fetch(`${env.SERVER_URL}/${algorithm}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(matchingData),
  });

  const result = await res.json();
  if (res.ok) console.log(result);
  return result;
};
