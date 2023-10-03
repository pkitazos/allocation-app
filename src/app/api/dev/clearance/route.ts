import { auth, clerkClient } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const dataSchema = z.object({
  clearance: z.number(),
});

export async function PATCH(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const data = await req.json();
  const result = dataSchema.safeParse(data);

  if (!result.success) {
    return NextResponse.json({ status: 400 });
  }

  const { clearance } = result.data;

  await clerkClient.users
    .updateUserMetadata(userId, {
      publicMetadata: {
        clearance,
      },
    })
    .then(() => {
      let message;
      switch (clearance) {
        case 3:
          message = " super-admin :))";
          break;
        case 2:
          message = "n admin :)";
          break;
        case 1:
          message = " supervisor :)";
          break;
        case 0:
          message = " student :)";
          break;
        default:
          message = "n unauthorized user :((";
      }
      console.log(`you are now a${message}`);
    });

  return NextResponse.json({ status: 200, data: "success" });
}
