import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/lib/db";
import { ShibUser } from "@/lib/validations/auth";

import { env } from "@/env";

export async function getShibUserFromHeaders() {
  let shib_guid: string | null = null;
  let shib_displayName: string | null = null;

  if (env.DEV_ENV !== "LOCAL") {
    shib_guid = headers().get("DH75HDYT76");
    shib_displayName = headers().get("DH75HDYT77");
    // const shib_groups = headers().get("DH75HDYT78");
  }

  console.log(">>> from shibboleth", {
    GUID: shib_guid,
    DisplayName: shib_displayName,
    // Groups: shib_groups?.split(";"),
  });

  const guid = z.string().parse(shib_guid);
  const displayName = z.string().parse(shib_displayName);
  // const groups = z.string().parse(shib_groups).split(";");

  return { guid, displayName };
}

export async function retrieveUser(user: ShibUser) {
  const dbUser = await db.user.findFirst({ where: { id: user.guid } });
  if (!dbUser) throw new Error("No valid invite found for this user");
  return dbUser;
}
