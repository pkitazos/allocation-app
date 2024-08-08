import { z } from "zod";

export const addStudentsCsvHeaders = [
  "full_name",
  "guid",
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
  full_name: z.string({
    required_error: "a valid Full Name",
    invalid_type_error: "a valid Full Name",
  }),
  guid: z.string({
    required_error: "a valid GUID",
    invalid_type_error: "a valid GUID",
  }),
  email: z
    .string({
      required_error: "a valid Email",
      invalid_type_error: "a valid Email",
    })
    .email({ message: "a valid Email" }),
  student_level: z
    .number({
      required_error: "a valid Student Level",
      invalid_type_error: "a valid Student Level",
    })
    .int({ message: "an integer Student Level" })
    .positive({ message: "a positive Student Level" })
    .refine((level) => level === 4 || level === 5, {
      message: "a valid Student Level",
    }),
});

export const addSupervisorsCsvRowSchema = z
  .object({
    full_name: z.string({
      required_error: "a valid Full Name",
      invalid_type_error: "a valid Full Name",
    }),
    guid: z.string({
      required_error: "a valid GUID",
      invalid_type_error: "a valid GUID",
    }),
    email: z
      .string({
        required_error: "a valid Email",
        invalid_type_error: "a valid Email",
      })
      .email({ message: "a valid Email" }),
    project_target: z
      .number({
        required_error: "a valid Target",
        invalid_type_error: "a valid Target",
      })
      .int({ message: "an integer Target value" })
      .positive({ message: "a positive Target value" }),
    project_upper_quota: z
      .number({
        required_error: "a valid Upper Quota",
        invalid_type_error: "a valid Upper Quota",
      })
      .int({ message: "an integer Upper Quota" })
      .positive({ message: "a positive Upper Quota" }),
  })
  .refine(
    ({ project_target, project_upper_quota }) =>
      project_target <= project_upper_quota,
    {
      message: "a Target value less than or equal to the Upper Quota value",
    },
  );
