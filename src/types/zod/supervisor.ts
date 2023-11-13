import * as z from "zod"
import { CompleteProject, RelatedProjectModel, CompleteSupervisorInInstance, RelatedSupervisorInInstanceModel } from "./index"

export const SupervisorModel = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
})

export interface CompleteSupervisor extends z.infer<typeof SupervisorModel> {
  projects: CompleteProject[]
  supervisorInInstance: CompleteSupervisorInInstance[]
}

/**
 * RelatedSupervisorModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSupervisorModel: z.ZodSchema<CompleteSupervisor> = z.lazy(() => SupervisorModel.extend({
  projects: RelatedProjectModel.array(),
  supervisorInInstance: RelatedSupervisorInInstanceModel.array(),
}))
