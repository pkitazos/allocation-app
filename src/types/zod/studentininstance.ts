import * as z from "zod"
import { CompleteStudent, RelatedStudentModel, CompleteAllocationInstance, RelatedAllocationInstanceModel } from "./index"

export const StudentInInstanceModel = z.object({
  studentId: z.string(),
  allocationGroupSlug: z.string(),
  allocationSubGroupSlug: z.string(),
  allocationInstanceSlug: z.string(),
})

export interface CompleteStudentInInstance extends z.infer<typeof StudentInInstanceModel> {
  student: CompleteStudent
  allocationInstance: CompleteAllocationInstance
}

/**
 * RelatedStudentInInstanceModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedStudentInInstanceModel: z.ZodSchema<CompleteStudentInInstance> = z.lazy(() => StudentInInstanceModel.extend({
  student: RelatedStudentModel,
  allocationInstance: RelatedAllocationInstanceModel,
}))
