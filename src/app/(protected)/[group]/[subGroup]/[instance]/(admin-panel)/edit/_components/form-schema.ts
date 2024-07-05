import { isAfter } from "date-fns";
import { z } from "zod";

const baseFormDetailsSchema = z.object({
  tags: z.array(z.object({ title: z.string().min(1, "Please add a tag") })),
  flags: z.array(z.object({ title: z.string().min(1, "Please add a flag") })),

  projectSubmissionDeadline: z.date(),

  minNumPreferences: z.coerce.number().int().positive(),
  maxNumPreferences: z.coerce.number().int().positive(),
  maxNumPerSupervisor: z.coerce.number().int().positive(),
  preferenceSubmissionDeadline: z.date(),
});

export function creationFormSchemaFactory(takenNames: string[]) {
  return baseFormDetailsSchema
    .extend({
      instanceName: z
        .string()
        .min(1, "Please enter a name")
        .refine(
          (name) => !takenNames.includes(name),
          "This name is already taken",
        ),
    })
    .refine(
      ({ minNumPreferences, maxNumPreferences }) =>
        minNumPreferences <= maxNumPreferences,
      {
        message:
          "Maximum Number of Preferences can't be less than Minimum Number of Preferences",
        path: ["maxNumPreferences"],
      },
    )
    .refine(
      ({ maxNumPreferences, maxNumPerSupervisor }) =>
        maxNumPreferences >= maxNumPerSupervisor,
      {
        message:
          "Maximum Number of Preferences per supervisor can't be more than Maximum Number of Preferences",
        path: ["maxNumPerSupervisor"],
      },
    )
    .refine(
      ({ projectSubmissionDeadline, preferenceSubmissionDeadline }) =>
        isAfter(preferenceSubmissionDeadline, projectSubmissionDeadline),
      {
        message:
          "Preference Submission deadline can't be before Project Upload deadline",
        path: ["preferenceSubmissionDeadline"],
      },
    )
    .refine(
      ({ flags }) => {
        const flagSet = new Set(flags);
        return flags.length === flagSet.size;
      },
      {
        message: "Flags must have distinct values",
        path: ["flags.0.title"],
      },
    );
}

export const editFormDetailsSchema = baseFormDetailsSchema
  .refine(
    ({ minNumPreferences, maxNumPreferences }) =>
      minNumPreferences <= maxNumPreferences,
    {
      message:
        "Maximum Number of Preferences can't be less than Minimum Number of Preferences",
      path: ["maxNumPreferences"],
    },
  )
  .refine(
    ({ maxNumPreferences, maxNumPerSupervisor }) =>
      maxNumPreferences >= maxNumPerSupervisor,
    {
      message:
        "Maximum Number of Preferences per supervisor can't be more than Maximum Number of Preferences",
      path: ["maxNumPerSupervisor"],
    },
  )
  .refine(
    ({ projectSubmissionDeadline, preferenceSubmissionDeadline }) =>
      isAfter(preferenceSubmissionDeadline, projectSubmissionDeadline),
    {
      message:
        "Preference Submission deadline can't be before Project Upload deadline",
      path: ["preferenceSubmissionDeadline"],
    },
  )
  .refine(
    ({ flags }) => {
      const flagSet = new Set(flags);
      return flags.length === flagSet.size;
    },
    {
      message: "Flags must have distinct values",
      path: ["flags.0.title"],
    },
  );
