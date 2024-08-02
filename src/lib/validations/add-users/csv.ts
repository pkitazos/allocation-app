import { z } from "zod";

export const addStudentsCsvHeaders = [
  "full_name",
  "matriculation_number",
  "email",
  "student_level",
];

export const addSupervisorsCsvHeaders = [
  "full_name",
  "guid",
  "email",
  "project_target",
  "project_upper_quota",
];

export const addStudentsCsvRowSchema = z.object({
  full_name: z.string(),
  matriculation_number: z.string(),
  email: z.string().email(),
  student_level: z.number().positive().int(),
});

export const addSupervisorsCsvRowSchema = z.object({
  full_name: z.string(),
  guid: z.string(),
  email: z.string().email(),
  project_target: z.number().int(),
  project_upper_quota: z.number().int(),
});
