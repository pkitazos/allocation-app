import { z } from "zod";

// TODO: updated validation schemas according to the agreed API response
export const studentCheckResponseSchema = z.array(
  z.object({
    matriculation: z.string(),
    exists: z.literal(0).or(z.literal(1)),
  }),
);

export type StudentCheckResponse = z.infer<typeof studentCheckResponseSchema>;

const studentMatriculationDataSchema = z.object({
  matriculation: z.string(),
});

export type StudentMatriculationData = z.infer<
  typeof studentMatriculationDataSchema
>;

export const supervisorCheckResponseSchema = z.array(
  z.object({
    guid: z.string(),
    exists: z.number(),
  }),
);

export type SupervisorCheckResponse = z.infer<
  typeof supervisorCheckResponseSchema
>;

const supervisorGuidDataSchema = z.object({
  guid: z.string(),
});

export type SupervisorGuidData = z.infer<typeof supervisorGuidDataSchema>;
