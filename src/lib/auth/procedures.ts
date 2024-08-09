import { PrismaClient } from "@prisma/client";

import { newUserSchema, ShibUser } from "@/lib/validations/auth";

export async function getUserAction(user: ShibUser) {
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
  return await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userPayload),
  })
    .then(async (res) => res.json())
    .then((res) => newUserSchema.safeParse(res.data));
}
