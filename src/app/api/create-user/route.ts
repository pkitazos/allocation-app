import { ShibUser, shibUserSchema } from "@/lib/auth/new";
import { NewSession } from "@/lib/auth/new-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const result = await request.json().then(shibUserSchema.safeParse);

  if (!result.success) {
    console.log("===>> Failed to parse body");
    throw new Error("Panic");
  }

  const newSession: NewSession = {
    id: "hello",
    expires: 123,
    sessionToken: "123",
    userId: "123",
    user: {
      email: result.data.email,
      id: result.data.guid,
      name: result.data.displayName,
      role: result.data.groups,
    },
  };

  return NextResponse.json({ status: 200, data: newSession });
}
