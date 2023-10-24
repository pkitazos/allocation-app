import * as z from "zod"
import { CompleteStudent, RelatedStudentModel, CompleteProject, RelatedProjectModel } from "./index"

export const FlagModel = z.object({
  id: z.string(),
  title: z.string(),
})

export interface CompleteFlag extends z.infer<typeof FlagModel> {
  students: CompleteStudent[]
  projects: CompleteProject[]
}

/**
 * RelatedFlagModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedFlagModel: z.ZodSchema<CompleteFlag> = z.lazy(() => FlagModel.extend({
  students: RelatedStudentModel.array(),
  projects: RelatedProjectModel.array(),
}))
