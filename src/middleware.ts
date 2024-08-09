import { NextRequest, NextResponse } from "next/server";

import { authenticateUser } from "@/lib/auth/procedures";
import { z } from "zod";

export async function middleware(req: NextRequest) {
  // Extract the headers from the request
  const shib_guid = req.headers.get("DH75HDYT76");
  const shib_displayName = req.headers.get("DH75HDYT77");
  const shib_groups = req.headers.get("DH75HDYT78");

  // Log the headers to the console
  console.log(">>> from shibboleth", {
    GUID: shib_guid,
    "Display Name": shib_displayName,
    Groups: shib_groups?.split(";"),
  });

  // Parse the headers into their expected types
  // const guid = z.string().parse(shib_guid);
  // const displayName = z.string().parse(shib_displayName);
  // const email = "";
  // const groups = z.string().parse(shib_groups).split(";");

  // TODO: Replace dummy values with the parsed values from above when running behind shibboleth server
  // test values for testing while running locally
  const guid = "123456";
  const displayName = "Name from shib";
  const email = "";
  const groups = [];

  //  Call auth endpoint to create or get user
  const result = await authenticateUser({ guid, displayName, email });

  if (!result.success) {
    throw new Error("Something went wrong while authenticating this user");
  }

  return NextResponse.next();
}

export const config = { matcher: "/:path*", exclude: ["/api/auth"] };
