import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/lib/db";
import { ShibUser } from "@/lib/validations/auth";

export async function getShibUserFromHeaders() {
  const shib_guid = headers().get("DH75HDYT76");
  const shib_displayName = headers().get("DH75HDYT77");
  const shib_email = "test@gmail.com";
  // const shib_groups = headers().get("DH75HDYT78");

  console.log(">>> from shibboleth", {
    GUID: shib_guid,
    DisplayName: shib_displayName,
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

  const newUser = await db.user.create({
    data: {
      id: user.guid,
      name: user.displayName,
      email: user.email,
    },
  });
  return newUser;
}
