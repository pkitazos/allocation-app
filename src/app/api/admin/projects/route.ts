import { flags } from "@/data/flags";
import { projects as projectData } from "@/data/projects";
import { tags } from "@/data/tags";
import { prisma } from "@/lib/prisma";
import { randomChoice } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST() {
  await prisma.project.createMany({
    data: projectData,
  });

  const projectIds = await prisma.project.findMany({
    select: { id: true },
  });

  Promise.all(
    projectIds.map(
      async ({ id: projectid }, i) =>
        await prisma.project.update({
          where: {
            id: projectid,
          },
          data: {
            flags: {
              connect: randomChoice(flags),
            },
            tags: {
              connect: randomChoice(tags),
            },
          },
        })
    )
  );

  return NextResponse.json({ status: 200, data: "success" });
}
