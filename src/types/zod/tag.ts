import * as z from "zod"
import { CompleteProject, RelatedProjectModel } from "./index"

export const TagModel = z.object({
  id: z.string(),
  title: z.string(),
})

export interface CompleteTag extends z.infer<typeof TagModel> {
  projects: CompleteProject[]
}

/**
 * RelatedTagModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTagModel: z.ZodSchema<CompleteTag> = z.lazy(() => TagModel.extend({
  projects: RelatedProjectModel.array(),
}))
