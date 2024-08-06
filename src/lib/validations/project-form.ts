import { z } from "zod";

import { tagTypeSchema } from "@/components/tag/tag-input";
import { projectFlags } from "@/content/config/flags";

const baseProjectFormSchema = z.object({
  title: z.string().min(4, "Please enter a longer title"),
  description: z.string().min(10, "Please enter a longer description"),
  flagTitles: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one flag for a project.",
    }),
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
  return updatedProjectSchema
    .refine(({ title }) => !takenTitles.includes(title), {
      message: "This title is already taken",
      path: ["title"],
    })
    .refine(
      ({ flagTitles }) => {
        const requiredFlags: string[] = [
          projectFlags.level4,
          projectFlags.level5,
        ];
        return flagTitles.some((title) => requiredFlags.includes(title));
      },
      {
        message: `Must select at least one of "${projectFlags.level4}" or "${projectFlags.level5}"`,
        path: ["flagTitles"],
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
