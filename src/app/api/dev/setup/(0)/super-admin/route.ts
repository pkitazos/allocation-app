import { prisma } from "@/lib/prisma";
import { SuperAdmin } from "@prisma/client";
import { superAdminDetails } from "./data";
import { NextResponse } from "next/server";

export async function POST() {
  console.log("SUPER_ADMIN");
  const superAdmins = await createSuperAdmin();
  await inviteSuperAdmin(superAdmins);
  console.log(superAdmins);

  console.log("ok");
  return NextResponse.json({ status: 200, data: superAdmins });
}

const createSuperAdmin = async () => {
  await prisma.superAdmin.createMany({
    data: superAdminDetails,
  });

  const superAdmins = await prisma.superAdmin.findMany({
    orderBy: { name: "asc" },
  });

  return superAdmins;
};

const inviteSuperAdmin = async (superAdmins: SuperAdmin[]) => {
  await prisma.invitation.createMany({
    data: superAdmins.map(({ email: userEmail }) => ({
      userEmail,
      role: "SUPER_ADMIN",
    })),
  });
};
