import { cookies } from "next/headers";
import { z } from "zod";

export const newUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
});

export const newSessionSchema = z.object({
  id: z.string(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.number(),
  user: newUserSchema,
});

export type NewSession = z.infer<typeof newSessionSchema>;

export async function slim_auth(): Promise<NewSession | null> {
  const sessionCookie = JSON.parse(cookies().get("session")?.value ?? "");
  const result = newSessionSchema.safeParse(sessionCookie);
  return result.success ? result.data : null;
}
