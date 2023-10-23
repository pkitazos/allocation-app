import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { AllocationSubGroupModel } from "@/types/zod";
import { AllocationSubGroup } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { allocationInstanceNames } from "./data";

const dataSchema = z.object({
  allocationSubGroups: z.array(AllocationSubGroupModel),
});

export async function POST(req: NextRequest) {
  console.log("ALLOCATION_INSTANCE");
  const data = await req.json();
  const result = dataSchema.safeParse(data);

  if (!result.success) return NextResponse.json({ status: 400 }); // TODO: add more informative message

  const { allocationSubGroups }: z.infer<typeof dataSchema> = data;

  const allocationInstances =
    await createAllocationInstance(allocationSubGroups);
  console.log(allocationInstances);

  const testInstance = await prisma.allocationInstance.findFirst({
    where: {
      displayName: "2023",
      allocationSubGroup: { displayName: "Level 4 Individual Project" },
    },
    include: {
      allocationSubGroup: {
        select: { displayName: true },
      },
    },
  });

  if (!testInstance) {
    console.log("ERROR creating testInstance");
    return NextResponse.json({ status: 500, data: "error" });
  }

  console.log({ testInstace: testInstance });
  console.log("ok");
  return NextResponse.json({
    status: 200,
    data: testInstance,
  });
}

const createAllocationInstance = async (
  allocationSubGroups: AllocationSubGroup[],
) => {
  const flatInstanceNames = allocationInstanceNames.flat(1);

  await prisma.allocationInstance.createMany({
    data: allocationSubGroups
      .map(({ id: allocationSubGroupId }, i) =>
        flatInstanceNames[i].map((name) => ({
          allocationSubGroupId,
          displayName: name,
          stage: "SETUP" as const,
          slug: slugify(name),
        })),
      )
      .flat(),
  });

  const allocationInstances = await prisma.allocationInstance.findMany({});
  return allocationInstances;
};
