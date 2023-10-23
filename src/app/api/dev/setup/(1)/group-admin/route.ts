import { prisma } from "@/lib/prisma";
import { GroupAdmin } from "@prisma/client";
import { groupAdminDetails } from "./data";
import { NextResponse } from "next/server";

export async function POST() {
  console.log("GROUP_ADMIN");
  const groupAdmins = await createGroupAdmin();
  await inviteGroupAdmin(groupAdmins);
  console.log(groupAdmins);

  console.log("ok");
  return NextResponse.json({ status: 200, data: groupAdmins });
}

const createGroupAdmin = async () => {
  await prisma.groupAdmin.createMany({
    data: groupAdminDetails,
  });

  const groupAdmins = await prisma.groupAdmin.findMany({
    orderBy: { name: "asc" },
  });

  return groupAdmins;
};

const inviteGroupAdmin = async (groupAdmins: GroupAdmin[]) => {
  await prisma.invitation.createMany({
    data: groupAdmins.map(({ email: userEmail }) => ({
      userEmail,
      role: "GROUP_ADMIN",
    })),
  });
};
