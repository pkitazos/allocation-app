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
  projectTarget: z.coerce.number().int(),
  projectUpperQuota: z.coerce.number().int(),
});

export type NewStudent = z.infer<typeof newStudentSchema>;

export type NewSupervisor = z.infer<typeof newSupervisorSchema>;
