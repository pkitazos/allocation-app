import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const dataSchema = z.object({
  studentId: z.string(),
  projectId: z.string(),
});

export async function PATCH(req: NextRequest) {
  const data = await req.json();
  const result = dataSchema.safeParse(data);

  console.log("PATCH");
  console.log({ result });

  if (!result.success) {
    return NextResponse.json({ status: 400 });
  }

  await prisma.shortlist.create({
    data: {
      projectId: data.projectId,
      studentId: data.studentId,
    },
  });

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

export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = dataSchema.safeParse(data);

  console.log("POST");
  console.log({ result });

  if (!result.success) {
    return NextResponse.json({ status: 400 });
  }

  await prisma.shortlist.create({
    data: {
      projectId: data.projectId,
      studentId: data.studentId,
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
