import * as z from "zod"
import { Stage } from "@prisma/client"
import { CompleteAllocationSubGroup, RelatedAllocationSubGroupModel, CompleteProject, RelatedProjectModel, CompleteSupervisorInInstance, RelatedSupervisorInInstanceModel, CompleteStudentInInstance, RelatedStudentInInstanceModel } from "./index"

export const AllocationInstanceModel = z.object({
  displayName: z.string(),
  slug: z.string(),
  stage: z.nativeEnum(Stage),
  allocationGroupSlug: z.string(),
  allocationSubGroupSlug: z.string(),
})

export interface CompleteAllocationInstance extends z.infer<typeof AllocationInstanceModel> {
  allocationSubGroup: CompleteAllocationSubGroup
  projects: CompleteProject[]
  supervisorsInInstance: CompleteSupervisorInInstance[]
  studentsInInstance: CompleteStudentInInstance[]
}

/**
 * RelatedAllocationInstanceModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAllocationInstanceModel: z.ZodSchema<CompleteAllocationInstance> = z.lazy(() => AllocationInstanceModel.extend({
  allocationSubGroup: RelatedAllocationSubGroupModel,
  projects: RelatedProjectModel.array(),
  supervisorsInInstance: RelatedSupervisorInInstanceModel.array(),
  studentsInInstance: RelatedStudentInInstanceModel.array(),
}))
