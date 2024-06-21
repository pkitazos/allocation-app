import { z } from "zod";

// export const projectDetailsSchema = z.object({
//   title: z.string(),
//   description: z.string(),
//   flagIds: z.array(z.string()),
//   tags: z.array(z.object({ id: z.string(), title: z.string() })),
//   capacityUpperBound: z.coerce.number().int().positive().optional(),
//   preAllocatedStudentId: z.string().optional(),
// });

const baseProjectFormSchema = z.object({
  title: z.string().min(4, "Please enter a longer title"),
  description: z.string().min(10, "Please enter a longer description"),
  flagIds: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one flag for a project.",
  }),
  tags: z
    .array(z.object({ id: z.string(), title: z.string() }))
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one tag for a project.",
    }),
  isPreAllocated: z.boolean(),
  capacityUpperBound: z.coerce.number().int().positive(),
  preAllocatedStudentId: z.string().optional(),
});

export const updatedProjectFormDetailsSchema = baseProjectFormSchema.refine(
  ({ isPreAllocated, preAllocatedStudentId }) =>
    isPreAllocated && preAllocatedStudentId !== "",
  { message: "Please select a student", path: ["preAllocatedStudentId"] },
);

export type UpdatedProjectFormDetails = z.infer<
  typeof updatedProjectFormDetailsSchema
>;

const currentProjectFormDetailsSchema = baseProjectFormSchema
  .omit({
    flagIds: true,
    capacityUpperBound: true,
    preAllocatedStudentId: true,
  })
  .extend({
    id: z.string(),
    capacityUpperBound: z.number(),
    preAllocatedStudentId: z.string(),
    flagIds: z.array(z.string()),
  });

export type CurrentProjectFormDetails = z.infer<
  typeof currentProjectFormDetailsSchema
>;
