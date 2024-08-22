import { z } from "zod";

export const instanceDisplayDataSchema = z.object({
  group: z.object({
    id: z.string(),
    displayName: z.string(),
  }),
  subGroup: z.object({
    id: z.string(),
    displayName: z.string(),
  }),
  instance: z.object({
    id: z.string(),
    displayName: z.string(),
  }),
});

export type InstanceDisplayData = z.infer<typeof instanceDisplayDataSchema>;
