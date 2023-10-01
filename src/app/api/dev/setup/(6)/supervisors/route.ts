import { supervisorData } from "@/data";
import { prisma } from "@/lib/prisma";
import { checkUpload } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST() {
  const supervisors = await prisma.supervisor.findMany();

  if (!checkUpload("SUPERVISORS", supervisors, 28)) {
    await prisma.supervisor.createMany({ data: supervisorData });
  }

  return NextResponse.json({ status: 200, data: true });
}
