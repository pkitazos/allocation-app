import * as z from "zod"
import { Stage } from "@prisma/client"
import { CompleteAllocationSubGroup, RelatedAllocationSubGroupModel, CompleteProject, RelatedProjectModel, CompleteSupervisor, RelatedSupervisorModel, CompleteStudent, RelatedStudentModel } from "./index"

export const AllocationInstanceModel = z.object({
  id: z.string(),
  displayName: z.string(),
  slug: z.string(),
  stage: z.nativeEnum(Stage),
  allocationSubGroupId: z.string(),
})

export interface CompleteAllocationInstance extends z.infer<typeof AllocationInstanceModel> {
  allocationSubGroup: CompleteAllocationSubGroup
  projects: CompleteProject[]
  supervisors: CompleteSupervisor[]
  students: CompleteStudent[]
}

/**
 * RelatedAllocationInstanceModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAllocationInstanceModel: z.ZodSchema<CompleteAllocationInstance> = z.lazy(() => AllocationInstanceModel.extend({
  allocationSubGroup: RelatedAllocationSubGroupModel,
  projects: RelatedProjectModel.array(),
  supervisors: RelatedSupervisorModel.array(),
  students: RelatedStudentModel.array(),
}))
