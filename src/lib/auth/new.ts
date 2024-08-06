import { PrismaClient } from "@prisma/client";

type ShibUser = {
  guid: string;
  displayName: string;
  email: string;
  groups: string[]; // TODO: check what the actual type of this is
};

export async function getUserAction(user: ShibUser) {
  "use server";
  const db = new PrismaClient();

  const dbUser = await db.newUser.findFirst({ where: { id: user.guid } });
  if (dbUser) return dbUser;

  const newUser = await createUserAction(db, user);
  return newUser;
}

async function createUserAction(db: PrismaClient, user: ShibUser) {
  "use server";
  return await db.newUser.create({
    data: {
      id: user.guid,
      name: user.displayName,
      email: user.email,
    },
  });
}

// TODO: create panel for super-admin to add SupervisorInstanceDetails or StudentDetails
