import { prisma } from "@/lib/prisma";
import { checkUpload, logUpload } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST() {
  const allocationSubGroups = await prisma.allocationSubGroup.findMany({
    orderBy: { name: "asc" },
  });

  const subGroupAdminNames = [
    ["Bill", "Cam", "Dan"],
    // ["Florence", "Grant"],
    // ["Isaac", "Jack", "Ken"],
  ];

  const subGroupAdmins = await prisma.subGroupAdmin.findMany({
    orderBy: { name: "asc" },
  });

  if (!checkUpload("SUB_GROUP_ADMINS", subGroupAdmins, 3)) {
    await prisma.subGroupAdmin.createMany({
      data: subGroupAdminNames[0].map((name, i) => ({
        name,
        allocationSubGroupId: allocationSubGroups[i].id,
      })),
    });
  }

  logUpload("SUB_GROUP_ADMINS", subGroupAdmins, 3);
  return NextResponse.json({ status: 200, data: true });
}
