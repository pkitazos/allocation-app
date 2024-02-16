import { z } from "zod";

export const newStudentSchema = z.object({
  fullName: z.string(),
  schoolId: z.string(),
  email: z.string().email(),
});

export const newSupervisorSchema = z.object({
  fullName: z.string(),
  schoolId: z.string(),
  email: z.string().email(),
  projectTarget: z.number().int(),
  projectUpperQuota: z.number().int(),
});

export type NewStudent = z.infer<typeof newStudentSchema>;

export type NewSupervisor = z.infer<typeof newSupervisorSchema>;
