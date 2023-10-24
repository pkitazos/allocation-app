import * as z from "zod"
import { CompleteAllocationSubGroup, RelatedAllocationSubGroupModel } from "./index"

export const SubGroupAdminModel = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  allocationSubGroupId: z.string(),
})

export interface CompleteSubGroupAdmin extends z.infer<typeof SubGroupAdminModel> {
  allocationSubGroup: CompleteAllocationSubGroup
}

/**
 * RelatedSubGroupAdminModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSubGroupAdminModel: z.ZodSchema<CompleteSubGroupAdmin> = z.lazy(() => SubGroupAdminModel.extend({
  allocationSubGroup: RelatedAllocationSubGroupModel,
}))
