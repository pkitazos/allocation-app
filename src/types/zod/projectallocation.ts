import * as z from "zod"
import { CompleteProject, RelatedProjectModel, CompleteStudent, RelatedStudentModel } from "./index"

export const ProjectAllocationModel = z.object({
  projectId: z.string(),
  studentId: z.string(),
})

export interface CompleteProjectAllocation extends z.infer<typeof ProjectAllocationModel> {
  project: CompleteProject
  student: CompleteStudent
}

/**
 * RelatedProjectAllocationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedProjectAllocationModel: z.ZodSchema<CompleteProjectAllocation> = z.lazy(() => ProjectAllocationModel.extend({
  project: RelatedProjectModel,
  student: RelatedStudentModel,
}))
