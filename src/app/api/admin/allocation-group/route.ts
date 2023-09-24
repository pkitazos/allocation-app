import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  await prisma.allocationGroup.create({
    data: { name: "SOCS" },
  });

  return NextResponse.json({ status: 200, data: "success" });
}
