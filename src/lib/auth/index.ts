"use server";
import { cookies } from "next/headers";

import { newUserSchema, User } from "@/lib/validations/auth";

export async function slim_auth(): Promise<User | null> {
  const sessionCookie = JSON.parse(cookies().get("user")?.value ?? "");
  const result = newUserSchema.safeParse(sessionCookie);
  return result.success ? result.data : null;
}
