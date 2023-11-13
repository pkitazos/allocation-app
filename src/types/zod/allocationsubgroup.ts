import * as z from "zod"
import { CompleteAllocationGroup, RelatedAllocationGroupModel, CompleteSubGroupAdmin, RelatedSubGroupAdminModel, CompleteAllocationInstance, RelatedAllocationInstanceModel } from "./index"

export const AllocationSubGroupModel = z.object({
  slug: z.string(),
  displayName: z.string(),
  allocationGroupSlug: z.string(),
})

export interface CompleteAllocationSubGroup extends z.infer<typeof AllocationSubGroupModel> {
  allocationGroup: CompleteAllocationGroup
  subGroupAdmins: CompleteSubGroupAdmin[]
  allocationInstances: CompleteAllocationInstance[]
}

/**
 * RelatedAllocationSubGroupModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAllocationSubGroupModel: z.ZodSchema<CompleteAllocationSubGroup> = z.lazy(() => AllocationSubGroupModel.extend({
  allocationGroup: RelatedAllocationGroupModel,
  subGroupAdmins: RelatedSubGroupAdminModel.array(),
  allocationInstances: RelatedAllocationInstanceModel.array(),
}))
