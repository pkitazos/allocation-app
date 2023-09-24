import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  await prisma.allocationInstance.create({
    data: {
      name: "lvl 4 - 2023",
      stage: "SETUP",
      allocationGroupId: "4fac5273-c561-4f1a-9f2b-ab37330e1ca4",
    },
  });

  return NextResponse.json({ status: 200, data: "success" });
}
