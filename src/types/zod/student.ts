import * as z from "zod"
import { CompleteFlag, RelatedFlagModel, CompleteShortlist, RelatedShortlistModel, CompletePreference, RelatedPreferenceModel, CompleteProjectAllocation, RelatedProjectAllocationModel, CompleteStudentInInstance, RelatedStudentInInstanceModel } from "./index"

export const StudentModel = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  schoolId: z.string(),
})

export interface CompleteStudent extends z.infer<typeof StudentModel> {
  flags: CompleteFlag[]
  shortlist: CompleteShortlist[]
  preferences: CompletePreference[]
  allocations: CompleteProjectAllocation[]
  studentInInstance: CompleteStudentInInstance[]
}

/**
 * RelatedStudentModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedStudentModel: z.ZodSchema<CompleteStudent> = z.lazy(() => StudentModel.extend({
  flags: RelatedFlagModel.array(),
  shortlist: RelatedShortlistModel.array(),
  preferences: RelatedPreferenceModel.array(),
  allocations: RelatedProjectAllocationModel.array(),
  studentInInstance: RelatedStudentInInstanceModel.array(),
}))
