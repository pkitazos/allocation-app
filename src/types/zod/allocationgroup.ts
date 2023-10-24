import * as z from "zod"
import { CompleteSuperAdmin, RelatedSuperAdminModel, CompleteGroupAdmin, RelatedGroupAdminModel, CompleteAllocationSubGroup, RelatedAllocationSubGroupModel } from "./index"

export const AllocationGroupModel = z.object({
  id: z.string(),
  displayName: z.string(),
  slug: z.string(),
  superAdminId: z.string(),
})

export interface CompleteAllocationGroup extends z.infer<typeof AllocationGroupModel> {
  superAdmin: CompleteSuperAdmin
  groupAdmin: CompleteGroupAdmin[]
  allocationSubGroups: CompleteAllocationSubGroup[]
}

/**
 * RelatedAllocationGroupModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAllocationGroupModel: z.ZodSchema<CompleteAllocationGroup> = z.lazy(() => AllocationGroupModel.extend({
  superAdmin: RelatedSuperAdminModel,
  groupAdmin: RelatedGroupAdminModel.array(),
  allocationSubGroups: RelatedAllocationSubGroupModel.array(),
}))
