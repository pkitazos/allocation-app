import { NewUser } from "@prisma/client";
import { cookies } from "next/headers";

import { newUserSchema } from "@/lib/validations/auth";

export async function slim_auth(): Promise<NewUser | null> {
  const sessionCookie = JSON.parse(cookies().get("user")?.value ?? "");
  const result = newUserSchema.safeParse(sessionCookie);
  return result.success ? result.data : null;
}
