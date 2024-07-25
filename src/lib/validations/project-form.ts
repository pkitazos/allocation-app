import { z } from "zod";

import { tagTypeSchema } from "@/components/tag/tag-input";

const baseProjectFormSchema = z.object({
  title: z.string().min(4, "Please enter a longer title"),
  description: z.string().min(10, "Please enter a longer description"),
  flagIds: z.array(z.string()),
  tags: z.array(z.object({ id: z.string(), title: z.string() })),
  isPreAllocated: z.boolean().optional(),
  capacityUpperBound: z.coerce.number().int().positive(),
  preAllocatedStudentId: z.string().optional(),
  specialTechnicalRequirements: z.string().optional(),
});

export const updatedProjectSchema = baseProjectFormSchema.refine(
  ({ isPreAllocated, preAllocatedStudentId }) => {
    isPreAllocated = Boolean(isPreAllocated);
    return !(isPreAllocated && preAllocatedStudentId === "");
  },
  { message: "Please select a student", path: ["preAllocatedStudentId"] },
);

export type UpdatedProject = z.infer<typeof updatedProjectSchema>;

export function buildUpdatedProjectSchema(takenTitles: string[]) {
  return updatedProjectSchema.refine(
    ({ title }) => !takenTitles.includes(title),
    {
      message: "This title is already taken",
      path: ["title"],
    },
  );
}

export const currentProjectFormDetailsSchema = baseProjectFormSchema
  .omit({
    capacityUpperBound: true,
    preAllocatedStudentId: true,
  })
  .extend({
    id: z.string(),
    capacityUpperBound: z.number(),
    preAllocatedStudentId: z.string(),
  });

export type CurrentProjectFormDetails = z.infer<
  typeof currentProjectFormDetailsSchema
>;

const formInternalDataSchema = z.object({
  takenTitles: z.array(z.string()),
  flags: z.array(z.object({ id: z.string(), title: z.string() })),
  tags: z.array(tagTypeSchema),
  students: z.array(z.object({ id: z.string() })),
});

export type FormInternalData = z.infer<typeof formInternalDataSchema>;
