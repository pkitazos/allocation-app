import { prisma } from "@/lib/prisma";
import { checkUpload, logUpload } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST() {
  const groupAdminNames = [
    "Chris",
    // "Evan",
    // "Holly"
  ];

  const groupAdmins = await prisma.groupAdmin.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  if (!checkUpload("GROUP_ADMINS", groupAdmins, 1)) {
    await prisma.groupAdmin.createMany({
      data: groupAdminNames.map((name) => ({ name: name })),
    });
  }

  logUpload("GROUP_ADMINS", groupAdmins, 1);
  return NextResponse.json({ status: 200, data: true });
}
