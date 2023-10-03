import { supervisors as supervisorData } from "@/data/supervisors";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  await prisma.supervisor.createMany({
    data: supervisorData,
  });

  return NextResponse.json({ status: 200, data: "success" });
}
