import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getUserAction } from "./lib/auth/new";

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
  const id = z.string().parse(shib_guid);
  const displayName = z.string().parse(shib_displayName);
  const email = "";
  const groups = [] as string[];

  const res = await fetch(
    "https://guss.dcs.gla.ac.uk/projects/api/create-user",
    {
      method: "POST",
    },
  );
  console.log("---->", res);
  // const user = await getUserAction({
  //   guid: id,
  //   displayName,
  //   email,
  //   groups,
  // });

  // TODO: add the user / session to the cookies
  // TODO: figure out if this is the best / optimal way todo this.
  const response = NextResponse.next();
  response.cookies.set("user", JSON.stringify({}), {
    httpOnly: true,
    path: "/",
  });

  // Continue to the next middleware or the request handler
  return response;
}

export const config = { matcher: "/:path*" };
