import { z } from "zod";

export const allocationCsvDataSchema = z.object({
  projectInternalId: z.string(),
  studentId: z.string(),
  studentLevel: z.number().int(),
  projectTitle: z.string(),
  projectDescription: z.string(),
  projectSpecialTechnicalRequirements: z.string(),
  studentRanking: z.number(),
});

export type AllocationCsvData = z.infer<typeof allocationCsvDataSchema>;
