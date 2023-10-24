import * as z from "zod"
import { CompleteProject, RelatedProjectModel, CompleteStudent, RelatedStudentModel } from "./index"

export const AllocationModel = z.object({
  projectId: z.string(),
  studentId: z.string(),
})

export interface CompleteAllocation extends z.infer<typeof AllocationModel> {
  project: CompleteProject
  student: CompleteStudent
}

/**
 * RelatedAllocationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAllocationModel: z.ZodSchema<CompleteAllocation> = z.lazy(() => AllocationModel.extend({
  project: RelatedProjectModel,
  student: RelatedStudentModel,
}))
