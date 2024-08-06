import { shibUserSchema } from "@/lib/auth/new";
import { NewSession } from "@/lib/auth/new-auth";
import { NextRequest, NextResponse } from "next/server";

export default async function POST(req: NextRequest) {
  const result = shibUserSchema.safeParse(req.body);

  if (!result.success) {
    console.log("===>> Failed to parse body", req.body);
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

  return NextResponse.json({
    session: newSession,
  });
}
