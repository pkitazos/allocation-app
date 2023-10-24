import * as z from "zod"
import { CompleteProject, RelatedProjectModel, CompleteStudent, RelatedStudentModel } from "./index"

export const PreferenceModel = z.object({
  projectId: z.string(),
  studentId: z.string(),
  rank: z.number().int(),
})

export interface CompletePreference extends z.infer<typeof PreferenceModel> {
  project: CompleteProject
  student: CompleteStudent
}

/**
 * RelatedPreferenceModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPreferenceModel: z.ZodSchema<CompletePreference> = z.lazy(() => PreferenceModel.extend({
  project: RelatedProjectModel,
  student: RelatedStudentModel,
}))
