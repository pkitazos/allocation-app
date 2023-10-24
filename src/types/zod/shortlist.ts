import * as z from "zod"
import { CompleteProject, RelatedProjectModel, CompleteStudent, RelatedStudentModel } from "./index"

export const ShortlistModel = z.object({
  projectId: z.string(),
  studentId: z.string(),
})

export interface CompleteShortlist extends z.infer<typeof ShortlistModel> {
  project: CompleteProject
  student: CompleteStudent
}

/**
 * RelatedShortlistModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedShortlistModel: z.ZodSchema<CompleteShortlist> = z.lazy(() => ShortlistModel.extend({
  project: RelatedProjectModel,
  student: RelatedStudentModel,
}))
