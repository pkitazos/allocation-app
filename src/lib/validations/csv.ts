import { z } from "zod";

export const NewStudentSchema = z.object({
  fullName: z.string(),
  schoolId: z.string(),
  email: z.string().email(),
});

export const NewSupervisorSchema = z.object({
  fullName: z.string(),
  schoolId: z.string(),
  email: z.string().email(),
  projectTarget: z.number().int(),
  projectUpperQuota: z.number().int(),
});

export type NewStudent = z.infer<typeof NewStudentSchema>;

export type NewSupervisor = z.infer<typeof NewSupervisorSchema>;
