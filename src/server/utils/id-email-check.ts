import { TRPCClientError } from "@trpc/client";

import { PrismaTransactionClient } from "@/lib/db";
import { blankEmail } from "@/lib/utils/general/blank-email";

export async function validateEmailGUIDMatch(
  tx: PrismaTransactionClient,
  institutionId: string,
  email: string,
  name: string,
) {
  // Find user with this email address
  let user = await tx.user.findFirst({
    where: { id: institutionId, email },
  });

  if (user) {
    return user;
  }
  // See if this user exists with no/empty email address
  user = await tx.user.findFirst({
    where: { id: institutionId, email: blankEmail(institutionId) },
  });
  if (user) {
    // We found the user with a blank email, but the function
    // parameter email isn't empty (else the earlier return would
    // fire) so update the email address
    user = await tx.user.update({
      where: { id: institutionId },
      data: {
        email: email,
      },
    });
    return user;
  }
  // Could not find the user, so create them
  try {
    user = await tx.user.create({
      data: {
        id: institutionId,
        name,
        email,
      },
    });
  } catch (e) {
    // this email is already taken
    throw new TRPCClientError("GUID and email do not match");
  }

  return user;
}
