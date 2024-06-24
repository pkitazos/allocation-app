import { z } from "zod";

import { tagTypeSchema } from "@/components/tag/tag-input";

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
  isPreAllocated: z.boolean().optional(),
  capacityUpperBound: z.coerce.number().int().positive(),
  preAllocatedStudentId: z.string().optional(),
});

export const updatedProjectFormDetailsSchema = baseProjectFormSchema.refine(
  ({ isPreAllocated, preAllocatedStudentId }) => {
    isPreAllocated = Boolean(isPreAllocated);
    return !(isPreAllocated && preAllocatedStudentId === "");
  },
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
export const formInternalDataSchema = z.object({
  flags: z.array(z.object({ id: z.string(), title: z.string() })),
  tags: z.array(tagTypeSchema),
  students: z.array(z.object({ id: z.string() })),
});

export type FormInternalData = z.infer<typeof formInternalDataSchema>;
