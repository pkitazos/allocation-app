import { z } from "zod";

import { studentLevelSchema } from "../student-level";

export const newStudentSchema = z.object({
  fullName: z.string().min(1, "Please enter a valid name"),
  institutionId: z.string().min(1, "Please enter a valid institution ID"),
  email: z.string().email("Please enter a valid email address"),
  level: z.coerce
    .number({
      required_error: "Required",
      invalid_type_error: "Invalid integer",
    })
    .int("Please enter an integer for the level")
    .refine((level) => studentLevelSchema.parse(level), {
      message: "Level must be 4 or 5",
    }),
});

export const newSupervisorSchema = z
  .object({
    fullName: z.string().min(1, "Please enter a valid name"),
    institutionId: z.string().min(1, "Please enter a valid institution ID"),
    email: z.string().email("Please enter a valid email address"),
    projectTarget: z.coerce
      .number({
        required_error: "Required",
        invalid_type_error: "Invalid integer",
      })
      .int("Please enter an integer for the project target")
      .positive("Project target must be a positive integer"),
    projectUpperQuota: z.coerce
      .number({
        required_error: "Required",
        invalid_type_error: "Invalid integer",
      })
      .int("Please enter an integer for the project upper quota")
      .positive("Project upper quota must be a positive integer"),
  })
  .refine(
    ({ projectTarget, projectUpperQuota }) =>
      projectTarget <= projectUpperQuota,
    {
      message: "Project target can't be greater than the project upper quota",
      path: ["projectTarget"],
    },
  );

export type NewStudent = z.infer<typeof newStudentSchema>;

export type NewSupervisor = z.infer<typeof newSupervisorSchema>;
