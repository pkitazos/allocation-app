import { flagData } from "@/data";
import { prisma } from "@/lib/prisma";
import { checkUpload, logUpload } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST() {
  const flags = (
    await prisma.flag.findMany({
      select: {
        title: true,
      },
    })
  ).map((item) => item.title);

  if (!checkUpload("FLAGS", flags, 5)) {
    await prisma.flag.createMany({ data: flagData });
  }

  logUpload("FLAGS", flags, 5);
  return NextResponse.json({ status: 200, data: true });
}
