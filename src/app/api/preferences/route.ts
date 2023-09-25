import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const dataSchema = z.object({
  projectId: z.string(),
  studentId: z.string(),
});

export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = dataSchema.safeParse(data);

  console.log("POST");
  console.log({ result });

  if (!result.success) {
    return NextResponse.json({ status: 400 });
  }

  const currentPreferences = await prisma.preference.findMany({
    where: { studentId: data.studentId },
    select: { rank: true },
  });

  const lowestRank =
    currentPreferences.length !== 0
      ? Math.max(...currentPreferences.map((item) => item.rank))
      : 0;

  await prisma.preference.create({
    data: {
      projectId: data.projectId,
      studentId: data.studentId,
      rank: lowestRank + 1,
    },
  });

  await prisma.shortlist.delete({
    where: {
      projectId_studentId: {
        projectId: data.projectId,
        studentId: data.studentId,
      },
    },
  });

  return NextResponse.json({ status: 200, data: "success" });
}

export async function DELETE(req: NextRequest) {
  const data = await req.json();
  const result = dataSchema.safeParse(data);

  console.log("DELETE");
  console.log({ result });

  if (!result.success) {
    return NextResponse.json({ status: 400 });
  }

  await prisma.preference.delete({
    where: {
      projectId_studentId: {
        projectId: data.projectId,
        studentId: data.studentId,
      },
    },
  });
  return NextResponse.json({ status: 200, data: "success" });
}
