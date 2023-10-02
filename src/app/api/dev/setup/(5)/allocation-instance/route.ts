import { prisma } from "@/lib/prisma";
import { Stage } from "@/lib/types";
import { checkUpload, logUpload } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST() {
  const allocationSubGroups = await prisma.allocationSubGroup.findMany({
    orderBy: { name: "asc" },
  });

  const allocationInstanceNames = [
    [["2022", "2023"], ["2022", "2023"], ["2023"]],
    // [["2022", "2023"],["2022", "2023"]],
    // [["2022", "2023"], ["2022", "2023"], ["2022", "2023"]],
  ];

  const allocationInstances = await prisma.allocationInstance.findMany({});

  if (!checkUpload("ALLOCATION_INSTANCES", allocationInstances, 5)) {
    allocationSubGroups.map(async (subGroup, i) => {
      await prisma.allocationInstance.createMany({
        data: allocationInstanceNames[0][i].map((instanceName) => ({
          name: instanceName,
          allocationSubGroupId: subGroup.id,
          stage: Stage.SETUP,
        })),
      });
    });
  }

  logUpload("ALLOCATION_INSTANCES", allocationInstances, 5);
  return NextResponse.json({ status: 200, data: true });
}
