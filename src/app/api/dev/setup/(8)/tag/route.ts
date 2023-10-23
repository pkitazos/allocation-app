import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { tagData } from "./data";

export async function POST() {
  console.log("TAGS");
  const tags = await createTag();

  console.log("ok");
  return NextResponse.json({ status: 200, data: tags });
}

const createTag = async () => {
  await prisma.tag.createMany({ data: tagData });

  const tags = await prisma.tag.findMany({});
  return tags;
};
