import { z } from "zod";

const newUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
});

const newSessionSchema = z.object({
  id: z.string(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.number(),
  user: newUserSchema,
});

export type NewSession = z.infer<typeof newSessionSchema>;

// Function to read cookies
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

// TODO: maybe not the best way todo this?
export async function slim_auth(): Promise<NewSession | null> {
  // Retrieve the user cookie
  const userCookie = getCookie("user");
  if (!userCookie) return null;

  // Parse the cookie JSON into a NewSession object
  const result = newSessionSchema.safeParse(userCookie);

  if (!result.success) {
    console.error(result.error.errors);
    return null;
  }

  return result.data;
}
