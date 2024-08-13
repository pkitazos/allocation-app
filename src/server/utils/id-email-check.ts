import { TRPCClientError } from "@trpc/client";

import { PrismaTransactionClient } from "@/lib/db";

export async function validateEmailGUIDMatch(
  tx: PrismaTransactionClient,
  institutionId: string,
  email: string,
  name: string,
) {
  let user = await tx.user.findFirst({
    where: { id: institutionId, email },
  });

  if (!user) {
    try {
      user = await tx.user.create({
        data: {
          id: institutionId,
          name,
          email,
        },
      });
    } catch (e) {
      throw new TRPCClientError("GUID and email do not match");
    }
  }

  return user;
}
