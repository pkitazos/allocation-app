import { z } from "zod";

export const newAdminSchema = z.object({
  name: z.string({ required_error: "Please enter a valid name" }).min(2),
  institutionId: z
    .string({ required_error: "Please enter a valid GUID" })
    .min(2),
  email: z.string({ required_error: "Please enter a valid email" }).email(),
});

export type NewAdmin = z.infer<typeof newAdminSchema>;
