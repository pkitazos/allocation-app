import { z } from "zod";

export const validatedSegmentsSchema = z.object({
  segment: z.string(),
  access: z.boolean(),
});

export type ValidatedSegments = z.infer<typeof validatedSegmentsSchema>;
