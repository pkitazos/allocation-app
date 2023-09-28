import { tags } from "@/data/tags";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  await prisma.tag.createMany({ data: tags });

  return NextResponse.json({ status: 200, data: "success" });
}
