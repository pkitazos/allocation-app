import { NextRequest, NextResponse } from "next/server";
import { ShibUser } from "./lib/auth/new";
import { NewSession, newSessionSchema } from "./lib/auth/new-auth";

export async function middleware(req: NextRequest) {
  // Extract the headers from the request
  const shib_guid = req.headers.get("DH75HDYT76");
  const shib_displayName = req.headers.get("DH75HDYT77");
  const shib_groups = req.headers.get("DH75HDYT78");

  // Log the headers to the console
  console.log("GUID:", shib_guid);
  console.log("Display Name:", shib_displayName);
  console.log("Groups:", shib_groups);

  // Parse the headers into their expected types
  // const id = z.string().parse(shib_guid);
  // const displayName = z.string().parse(shib_displayName);
  // const email = "";
  // const groups = [] as string[];

  const testShibUser: ShibUser = {
    guid: "456",
    displayName: "Petros from Shib",
    email: "",
    groups: "shib-user",
  };

  const result = await fetch("http://localhost:3000/api/create-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testShibUser),
  })
    .then(async (res) => res.json())
    .then((res) => newSessionSchema.safeParse(res.data));

  console.log("this is the result", result);

  const UP = new Error("UP");
  if (!result.success) throw UP;

  // const user = await getUserAction({
  //   guid: id,
  //   displayName,
  //   email,
  //   groups,
  // });

  // TODO: add the user / session to the cookies
  // TODO: figure out if this is the best / optimal way todo this.

  const testSession: NewSession = {
    id: "hello",
    expires: 123123123,
    sessionToken: "123",
    userId: "123",
    user: {
      id: "hello",
      email: "",
      name: "Petros from Middleware",
      role: "middleware-user",
    },
  };

  const response = NextResponse.next();
  response.cookies.set({
    name: "session",
    value: JSON.stringify(result.data),
    httpOnly: true,
  });

  // Continue to the next middleware or the request handler
  return response;
}

export const config = { matcher: "/:path*", exclude: ["/api/create-user"] };
