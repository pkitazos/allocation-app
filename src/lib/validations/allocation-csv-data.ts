import { z } from "zod";

export const allocationCsvDataSchema = z.object({
  projectInternalId: z.string(),
  studentId: z.string(),
  studentMatric: z.string(),
  studentLevel: z.number().int(),
  projectTitle: z.string(),
  projectDescription: z.string(),
  projectSpecialTechnicalRequirements: z.string(),
  studentRanking: z.number(),
});

// TODO: add supervisor to export data

export type AllocationCsvData = z.infer<typeof allocationCsvDataSchema>;
