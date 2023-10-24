import { prisma } from "@/lib/prisma";

export async function getUserInstance(userId: string) {
  return prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    },
  });
}
