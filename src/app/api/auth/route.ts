import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { getUserAction } from "@/lib/auth/procedures";
import { shibUserSchema } from "@/lib/validations/auth";

// TODO: restrict access to endpoint to only the middleware
export async function POST(req: NextRequest) {
  const result = await req.json().then(shibUserSchema.safeParse);

  if (!result.success) {
    return NextResponse.json({
      status: 400,
      error: "Invalid request body format",
    });
  }

  const newUser = await getUserAction(result.data);

  // Add the user to the cookies
  cookies().set({
    name: "user",
    value: JSON.stringify(newUser),
    httpOnly: true,
  });

  return NextResponse.json({
    status: 200,
    // TODO: check that this actually limits the CORS policy
    // headers: { "Access-Control-Allow-Origin": env.SITE_URL },
    data: newUser,
  });
}
