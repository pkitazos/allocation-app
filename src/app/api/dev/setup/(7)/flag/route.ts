import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { flagData } from "./data";

export async function POST() {
  console.log("FLAGS");
  const flags = await createFlag();

  console.log("ok");
  return NextResponse.json({ status: 200, data: flags });
}

const createFlag = async () => {
  await prisma.flag.createMany({ data: flagData });

  const flags = await prisma.flag.findMany({});
  return flags;
};
