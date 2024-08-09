import { PrismaClient } from "@prisma/client";

import { env } from "@/env";
import { newUserSchema, ShibUser } from "@/lib/validations/auth";

export async function getUserAction(user: ShibUser) {
  "use server";
  const db = new PrismaClient();

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

export async function authenticateUser(userPayload: ShibUser) {
  console.log("==================== FETCH STARTED");

  const payload = JSON.stringify(userPayload);

  console.log("==================== PAYLOAD");

  const hello = await fetch(`https://spa-staging.gla.ac.uk/api/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
  }).then(async (res) => await res.json());
  // .then((res) => newUserSchema.safeParse(res.data));

  console.log("==================== FETCH COMPLETE", hello);

  return newUserSchema.safeParse(hello);
}
