import { prisma } from "@/lib/prisma";
import { randomChoice } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST() {
  const projects = await prisma.project.findMany({});

  const flags = await prisma.flag.findMany({
    select: {
      title: true,
    },
  });

  const tags = await prisma.tag.findMany({
    select: {
      title: true,
    },
  });

  Promise.all(
    projects.map(
      async ({ id }) =>
        await prisma.project.update({
          where: {
            id,
          },
          data: {
            flags: {
              connect: randomChoice(flags),
            },
            tags: {
              connect: randomChoice(tags),
            },
          },
        }),
    ),
  );

  return NextResponse.json({ status: 200, data: true });
}
