import { env } from "@/env";
import { adminProcedure, createTRPCRouter } from "@/server/trpc";
import { instanceParamsSchema } from "@/types/params";
import { AlgorithmFlag } from "@prisma/client";
import { z } from "zod";

const matchingDataSchema = z.object({
  students: z.array(z.array(z.string())),
  projects: z.array(z.tuple([z.string(), z.number(), z.number(), z.string()])),
  //^ consider making this an object not a tuple
  // its pretty opaque as a tuple - what do these things mean?
  // if it really needs to be a tuple you could have a .transform() maybe?
  lecturers: z.array(z.tuple([z.string(), z.number(), z.number(), z.number()])),
  // ^ same deal here
});

const mathcingDataWithArgsSchema = z.object({
  students: z.array(z.array(z.string())),
  projects: z.array(z.tuple([z.string(), z.number(), z.number(), z.string()])),
  lecturers: z.array(z.tuple([z.string(), z.number(), z.number(), z.number()])),
  //  ^ these 2 also
  args: z.array(z.string()),
});

export const serverResponseDataSchema = z.object({
  matching: z.array(z.tuple([z.string(), z.string(), z.number()])),
  profile: z.array(z.number()),
  weight: z.number(),
  size: z.number(),
  degree: z.number(),
});

export const algorithmResultSchema = serverResponseDataSchema.extend({
  selected: z.boolean(),
});

export type ServerResponseData = z.infer<typeof serverResponseDataSchema>;

export type AlgorithmResult = z.infer<typeof algorithmResultSchema>;

export type MatchingData = z.infer<typeof matchingDataSchema>;

export type MatchingDataWithArgs = z.infer<typeof mathcingDataWithArgsSchema>;

type AlgorithmServerData =
  | { algorithm: "custom"; matchingData: MatchingDataWithArgs }
  | { algorithm: BuiltInAlg; matchingData: MatchingData };

const builtInAlgSchema = z.enum([
  "generous",
  "greedy",
  "minimum-cost",
  "greedy-generous",
]);

export type BuiltInAlg = z.infer<typeof builtInAlgSchema>;

const algorithmFlag: Record<BuiltInAlg, AlgorithmFlag> = {
  generous: "GEN",
  greedy: "GRE",
  "minimum-cost": "MINCOST",
  "greedy-generous": "GRE",
};

export const algorithmRouter = createTRPCRouter({
  run: adminProcedure
    .input(
      instanceParamsSchema.and(
        z.object({
          algorithm: builtInAlgSchema,
          matchingData: matchingDataSchema,
        }),
      ),
    )
    .mutation(
      async ({
        ctx,
        input: { group, subGroup, instance, algorithm, matchingData },
      }) => {
        const serverResult = await getMatching({
          algorithm,
          matchingData,
        });

        if (!serverResult) return undefined;

        const result = { ...serverResult, selected: false };

        await ctx.db.algorithmResult.upsert({
          where: {
            name_allocationGroupId_allocationSubGroupId_allocationInstanceId: {
              name: algorithm,
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
            },
          },
          update: {
            data: JSON.stringify(result),
          },
          create: {
            name: algorithm,
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            algFlag1: "MAXSIZE",
            algFlag2: algorithmFlag[algorithm],
            algFlag3: "LSB",
            data: JSON.stringify(result),
          },
        });

        return result;
      },
    ),

  // TODO: decide how to name custom Algorithm configurations
  custom: adminProcedure
    .input(mathcingDataWithArgsSchema)
    .mutation(async ({ input: matchingData }) => {
      const result = await getMatching({ algorithm: "custom", matchingData });
      return result;
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
  }).then((res) => res.json());

  console.log("from getMatching", res);
  if (res.ok) console.log(res);

  const result = serverResponseDataSchema.safeParse(res.data);
  console.log("from getMatching", result);

  if (!result.success) return;

  return result.data;
};
