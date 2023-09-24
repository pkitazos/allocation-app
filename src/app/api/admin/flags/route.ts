import { flags } from "@/data/flags";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  await prisma.flag.createMany({ data: flags });

  return NextResponse.json({ status: 200, data: "success" });
}
