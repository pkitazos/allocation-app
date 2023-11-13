import * as z from "zod"
import { CompleteSupervisor, RelatedSupervisorModel, CompleteAllocationInstance, RelatedAllocationInstanceModel } from "./index"

export const SupervisorInInstanceModel = z.object({
  supervisorId: z.string(),
  allocationGroupSlug: z.string(),
  allocationSubGroupSlug: z.string(),
  allocationInstanceSlug: z.string(),
})

export interface CompleteSupervisorInInstance extends z.infer<typeof SupervisorInInstanceModel> {
  supervisor: CompleteSupervisor
  allocationInstance: CompleteAllocationInstance
}

/**
 * RelatedSupervisorInInstanceModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSupervisorInInstanceModel: z.ZodSchema<CompleteSupervisorInInstance> = z.lazy(() => SupervisorInInstanceModel.extend({
  supervisor: RelatedSupervisorModel,
  allocationInstance: RelatedAllocationInstanceModel,
}))
