import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/lib/db";
import { ShibUser } from "@/lib/validations/auth";

import { env } from "@/env";

export async function getShibUserFromHeaders() {
  let shib_guid: string | null = null;
  let shib_displayName: string | null = null;
  let shib_email: string | null = null;

  if (env.DEV_ENV !== "LOCAL") {
    shib_guid = headers().get("DH75HDYT76");
    shib_displayName = headers().get("DH75HDYT77");
    shib_email = headers().get("DH75HDYT80");
    // const shib_groups = headers().get("DH75HDYT78");
  }

  console.log(">>> from shibboleth", {
    GUID: shib_guid,
    DisplayName: shib_displayName,
    Email: shib_email,
    // Groups: shib_groups?.split(";"),
  });

  const guid = z.string().parse(shib_guid);
  const displayName = z.string().parse(shib_displayName);
  const email = z.string().parse(shib_email);
  // const groups = z.string().parse(shib_groups).split(";");

  return { guid, displayName, email };
}

export async function retrieveUser(user: ShibUser) {
  const dbUser = await db.user.findFirst({ where: { id: user.guid } });
  if (dbUser) return dbUser;

  try {
    const newUser = await db.user.create({
      data: {
        id: user.guid,
        name: user.displayName,
        email: user.email,
      },
    });
    return newUser;
  } catch (e) {
    throw new Error("No valid invite found for this user");
  }
}
