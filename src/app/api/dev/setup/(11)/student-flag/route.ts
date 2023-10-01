import { prisma } from "@/lib/prisma";
import { randomChoice } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST() {
  const flags = (
    await prisma.flag.findMany({
      select: {
        title: true,
      },
    })
  ).map((item) => item.title);

  const students = await prisma.student.findMany({ select: { id: true } });

  Promise.all(
    students.map(
      async ({ id }) =>
        await prisma.student.update({
          where: {
            id,
          },
          data: {
            flags: {
              connect: { title: randomChoice(flags) },
            },
          },
        }),
    ),
  );

  return NextResponse.json({ status: 200, data: true });
}
