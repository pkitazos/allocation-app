import { z } from "zod";

export const projectTableDataDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  supervisor: z.object({
    id: z.string(),
    name: z.string(),
  }),
  flags: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
    }),
  ),
  tags: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
    }),
  ),
});

export type ProjectTableDataDto = z.infer<typeof projectTableDataDtoSchema>;
