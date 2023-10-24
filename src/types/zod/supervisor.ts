import * as z from "zod"
import { CompleteProject, RelatedProjectModel, CompleteAllocationInstance, RelatedAllocationInstanceModel } from "./index"

export const SupervisorModel = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
})

export interface CompleteSupervisor extends z.infer<typeof SupervisorModel> {
  projects: CompleteProject[]
  allocationInstances: CompleteAllocationInstance[]
}

/**
 * RelatedSupervisorModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSupervisorModel: z.ZodSchema<CompleteSupervisor> = z.lazy(() => SupervisorModel.extend({
  projects: RelatedProjectModel.array(),
  allocationInstances: RelatedAllocationInstanceModel.array(),
}))
