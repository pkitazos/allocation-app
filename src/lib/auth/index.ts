// "use server";
import { cookies } from "next/headers";

import { newUserSchema, User } from "@/lib/validations/auth";
import { getUserFromHeaders } from "./fake-middleware";
import { getUserAction } from "./procedures";

export async function slim_auth(): Promise<User | null> {
  // const sessionCookie = JSON.parse(cookies().get("user")?.value ?? "");
  const user = await getUserFromHeaders();
  const newUser = await getUserAction(user);
  return newUser;
}
