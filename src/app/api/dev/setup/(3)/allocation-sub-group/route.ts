import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { AllocationGroupModel } from "@/types/zod";
import { AllocationGroup } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { allocationSubGroupNames } from "./data";

const dataSchema = z.object({
  allocationGroups: z.array(AllocationGroupModel),
});

export async function POST(req: NextRequest) {
  console.log("ALLOCATION_SUB_GROUP");
  const data = await req.json();
  const result = dataSchema.safeParse(data);

  if (!result.success) return NextResponse.json({ status: 400 }); // TODO: add more informative message

  const { allocationGroups }: z.infer<typeof dataSchema> = data;

  const allocationSubGroups = await createAllocationSubGroup(allocationGroups);
  console.log(allocationSubGroups);

  console.log("ok");
  return NextResponse.json({ status: 200, data: allocationSubGroups });
}

const createAllocationSubGroup = async (
  allocationGroups: AllocationGroup[],
) => {
  // TODO: remove prisma call in map
  allocationGroups.map(async ({ id }, i) => {
    await prisma.allocationSubGroup.createMany({
      data: allocationSubGroupNames[i].map((name) => ({
        displayName: name,
        allocationGroupId: id,
        slug: slugify(name),
      })),
    });
  });

  const allocationSubGroups = await prisma.allocationSubGroup.findMany({
    orderBy: { displayName: "asc" },
  });

  return allocationSubGroups;
};
