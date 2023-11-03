import { db } from "@/lib/prisma";

export async function getUserInstance(userId: string) {
  return db.user.findFirstOrThrow({
    where: {
      id: userId,
    },
  });
}
