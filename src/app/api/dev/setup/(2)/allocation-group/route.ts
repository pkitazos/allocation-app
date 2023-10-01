import { prisma } from "@/lib/prisma";
import { checkUpload } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST() {
  const groupAdmins = await prisma.groupAdmin.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const allocationGroupNames = [
    "School of Computing Science",
    // "School of Engineering",
    // "School of Medicine",
  ];

  const allocationGroups = await prisma.allocationGroup.findMany({
    orderBy: { name: "asc" },
  });

  if (!checkUpload("ALLOCATION_GROUPS", allocationGroups, 1)) {
    groupAdmins.map(async ({ id }, i) => {
      await prisma.allocationGroup.create({
        data: { name: allocationGroupNames[i], groupAdminId: id },
      });
    });
  }

  return NextResponse.json({ status: 200, data: true });
}
