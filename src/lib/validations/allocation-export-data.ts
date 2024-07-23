import { z } from "zod";

const studentDataResponseSchema = z.object({
  matriculation: z.string(),
  existsResponse: z.number(),
});

export type StudentDataResponse = z.infer<typeof studentDataResponseSchema>;

const studentMatriculationDataSchema = z.object({
  matriculation: z.string(),
});

export type StudentMatriculationData = z.infer<
  typeof studentMatriculationDataSchema
>;

const supervisorDataResponseSchema = z.object({
  guid: z.string(),
  existsResponse: z.number(),
});

export type SupervisorDataResponse = z.infer<
  typeof supervisorDataResponseSchema
>;

const supervisorGuidDataSchema = z.object({
  guid: z.string(),
});

export type SupervisorGuidData = z.infer<typeof supervisorGuidDataSchema>;
