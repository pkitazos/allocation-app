import * as z from "zod"
import { CompleteAllocationGroup, RelatedAllocationGroupModel } from "./index"

export const GroupAdminModel = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  allocationGroupSlug: z.string(),
})

export interface CompleteGroupAdmin extends z.infer<typeof GroupAdminModel> {
  allocationGroup: CompleteAllocationGroup
}

/**
 * RelatedGroupAdminModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedGroupAdminModel: z.ZodSchema<CompleteGroupAdmin> = z.lazy(() => GroupAdminModel.extend({
  allocationGroup: RelatedAllocationGroupModel,
}))
