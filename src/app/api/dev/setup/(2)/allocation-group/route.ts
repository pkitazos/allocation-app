import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { GroupAdminModel, SuperAdminModel } from "@/types/zod";
import { GroupAdmin, SuperAdmin } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { allocationGroupNames } from "./data";

const dataSchema = z.object({
  superAdmins: z.array(SuperAdminModel),
  groupAdmins: z.array(GroupAdminModel),
});

export async function POST(req: NextRequest) {
  console.log("ALLOCATION_GROUP");
  const data = await req.json();
  const result = dataSchema.safeParse(data);

  if (!result.success) return NextResponse.json({ status: 400 }); // TODO: add more informative message

  const { superAdmins, groupAdmins }: z.infer<typeof dataSchema> = data;

  const allocationGroups = await createAllocationGroup(
    superAdmins[0],
    groupAdmins as GroupAdmin[],
  );
  console.log(allocationGroups);

  console.log("ok");
  return NextResponse.json({ status: 200, data: allocationGroups });
}

const createAllocationGroup = async (
  superAdmin: SuperAdmin,
  groupAdmins: GroupAdmin[],
) => {
  await prisma.allocationGroup.createMany({
    data: allocationGroupNames.map((name, i) => ({
      displayName: name,
      groupAdminId: groupAdmins[i].id,
      slug: slugify(name),
      superAdminId: superAdmin.id,
    })),
  });

  const allocationGroups = await prisma.allocationGroup.findMany({
    orderBy: { displayName: "asc" },
  });

  return allocationGroups;
};
