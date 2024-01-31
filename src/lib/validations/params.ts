import { z } from "zod";

export const groupParamsSchema = z.object({
  group: z.string(),
});

export const subGroupParamsSchema = z.object({
  group: z.string(),
  subGroup: z.string(),
});

export const spaceParamSchema = groupParamsSchema.or(subGroupParamsSchema);

export type SpaceParam = z.infer<typeof spaceParamSchema>;

export const instanceParamsSchema = z.object({
  group: z.string(),
  subGroup: z.string(),
  instance: z.string(),
});

export type groupParams = z.infer<typeof groupParamsSchema>;

export type subGroupParams = z.infer<typeof subGroupParamsSchema>;

export type instanceParams = z.infer<typeof instanceParamsSchema>;
