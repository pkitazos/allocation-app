import { NewSession } from "@/lib/auth/new-auth";
import { NextResponse } from "next/server";

export default async function POST() {
  const newSession: NewSession = {
    id: "hello",
    expires: 123,
    sessionToken: "123",
    userId: "123",
    user: {
      email: "123",
      id: "123",
      name: "123",
      role: "123",
    },
  };

  return NextResponse.json({
    session: newSession,
  });
}
