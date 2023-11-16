import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const matchingDataSchema = z.object({
  students: z.array(z.array(z.string())),
  projects: z.array(z.tuple([z.literal(0), z.literal(1), z.string()])),
  lecturers: z.array(z.tuple([z.literal(0), z.number(), z.number()])),
});

export type MatchingData = z.infer<typeof matchingDataSchema>;

export const algorithmRouter = createTRPCRouter({
  generous: publicProcedure
    .input(matchingDataSchema)
    .mutation(async ({ input: matchingData }) => {
      const res = await fetch("http://127.0.0.1:8000/generous", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(matchingData),
      });

      console.log(res);
    }),

  greedy: publicProcedure
    .input(matchingDataSchema)
    .mutation(async ({ input: matchingData }) => {
      const res = await fetch("http://127.0.0.1:8000/greedy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(matchingData),
      });

      console.log(res);
    }),
});
