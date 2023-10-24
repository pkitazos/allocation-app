import * as z from "zod"
import { CompleteSupervisor, RelatedSupervisorModel, CompleteAllocationInstance, RelatedAllocationInstanceModel, CompleteFlag, RelatedFlagModel, CompleteTag, RelatedTagModel, CompleteShortlist, RelatedShortlistModel, CompletePreference, RelatedPreferenceModel, CompleteProjectAllocation, RelatedProjectAllocationModel } from "./index"

export const ProjectModel = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  supervisorId: z.string(),
  allocationInstanceId: z.string(),
})

export interface CompleteProject extends z.infer<typeof ProjectModel> {
  supervisor: CompleteSupervisor
  allocationInstance: CompleteAllocationInstance
  flags: CompleteFlag[]
  tags: CompleteTag[]
  shortlistedIn: CompleteShortlist[]
  preferenceIn: CompletePreference[]
  allocatedTo?: CompleteProjectAllocation | null
}

/**
 * RelatedProjectModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedProjectModel: z.ZodSchema<CompleteProject> = z.lazy(() => ProjectModel.extend({
  supervisor: RelatedSupervisorModel,
  allocationInstance: RelatedAllocationInstanceModel,
  flags: RelatedFlagModel.array(),
  tags: RelatedTagModel.array(),
  shortlistedIn: RelatedShortlistModel.array(),
  preferenceIn: RelatedPreferenceModel.array(),
  allocatedTo: RelatedProjectAllocationModel.nullish(),
}))
