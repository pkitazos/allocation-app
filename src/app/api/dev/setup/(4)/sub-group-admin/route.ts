import { prisma } from "@/lib/prisma";
import { AllocationSubGroupModel } from "@/types/zod";
import { AllocationSubGroup, SubGroupAdmin } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { subGroupAdminDetails } from "./data";

const dataSchema = z.object({
  allocationSubGroups: z.array(AllocationSubGroupModel),
});

export async function POST(req: NextRequest) {
  console.log("SUB_GROUP_ADMIN");

  const data = await req.json();
  const result = dataSchema.safeParse(data);

  if (!result.success) return NextResponse.json({ status: 400 }); // TODO: add more informative message

  const { allocationSubGroups }: z.infer<typeof dataSchema> = data;

  const subGroupAdmins = await createSubGroupAdmin(allocationSubGroups);
  console.log(subGroupAdmins);
  await inviteSubGroupAdmin(subGroupAdmins);

  console.log("ok");
  return NextResponse.json({ status: 200, data: subGroupAdmins });
}

const createSubGroupAdmin = async (
  allocationSubGroups: AllocationSubGroup[],
) => {
  const flatSubGroupAdminDetails = subGroupAdminDetails.flat();

  await prisma.subGroupAdmin.createMany({
    data: allocationSubGroups.map(({ id: allocationSubGroupId }, i) => ({
      allocationSubGroupId,
      name: flatSubGroupAdminDetails[i].name,
      email: flatSubGroupAdminDetails[i].email,
    })),
  });

  const subGroupAdmins = await prisma.subGroupAdmin.findMany({
    orderBy: { name: "asc" },
  });

  return subGroupAdmins;
};

const inviteSubGroupAdmin = async (subGroupAdmins: SubGroupAdmin[]) => {
  await prisma.invitation.createMany({
    data: subGroupAdmins.map(({ email: userEmail }) => ({
      userEmail,
      role: "SUB_GROUP_ADMIN" as const,
    })),
  });
};
