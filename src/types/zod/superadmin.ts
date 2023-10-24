import * as z from "zod"
import { CompleteAllocationGroup, RelatedAllocationGroupModel } from "./index"

export const SuperAdminModel = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
})

export interface CompleteSuperAdmin extends z.infer<typeof SuperAdminModel> {
  allocationGroups: CompleteAllocationGroup[]
}

/**
 * RelatedSuperAdminModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSuperAdminModel: z.ZodSchema<CompleteSuperAdmin> = z.lazy(() => SuperAdminModel.extend({
  allocationGroups: RelatedAllocationGroupModel.array(),
}))
