"use server";

import { cookies } from "next/headers";
import { User } from "@/lib/validations/auth";

export async function setCookies(newUser: User) {
  // Add the user to the cookies
  cookies().set({
    name: "user",
    value: JSON.stringify(newUser),
    httpOnly: true,
  });
}
