import { z } from "zod";

export const allocationCsvDataSchema = z.object({
  project: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    specialTechnicalRequirements: z.string(),
  }),
  student: z.object({
    id: z.string(),
    matric: z.string(),
    level: z.number(),
    ranking: z.number(),
  }),
  supervisor: z.object({ id: z.string(), name: z.string() }),
});

export type AllocationCsvData = z.infer<typeof allocationCsvDataSchema>;
