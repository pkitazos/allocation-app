import { z } from "zod";

export const shibUserSchema = z.object({
  guid: z.string(),
  displayName: z.string(),
  email: z.string(),
});

export type ShibUser = z.infer<typeof shibUserSchema>;

export const newUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

export type User = z.infer<typeof newUserSchema>;

export type Session = { user: User | null };
