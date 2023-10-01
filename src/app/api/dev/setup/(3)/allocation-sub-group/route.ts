import { prisma } from "@/lib/prisma";
import { checkUpload } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST() {
  const allocationGroups = await prisma.allocationGroup.findMany({
    orderBy: { name: "asc" },
  });

  const allocationSubGroupNames = [
    [
      "Level 3 Group Project",
      "Level 4 Individual Project",
      "Level 5 Research Project",
    ],
    // [
    //   "Level 3 Individual Project",
    //   "Level 4 Individual Project",
    // ],
    // [
    //   "Level 4 Research Project",
    //   "Level 5 Research Project",
    //   "Level 6 Research Project",
    // ],
  ];

  const allocationSubGroups = await prisma.allocationSubGroup.findMany({
    orderBy: { name: "asc" },
  });

  if (!checkUpload("ALLOCATION_SUB_GROUPS", allocationSubGroups, 3)) {
    allocationGroups.map(async ({ id }, i) => {
      await prisma.allocationSubGroup.createMany({
        data: allocationSubGroupNames[i].map((name) => ({
          name: name,
          allocationGroupId: id,
        })),
      });
    });
  }

  return NextResponse.json({ status: 200, data: true });
}
