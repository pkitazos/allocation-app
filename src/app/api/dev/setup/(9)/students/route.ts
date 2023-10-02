import { studentData } from "@/data";
import { prisma } from "@/lib/prisma";
import { checkUpload, logUpload } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST() {
  const students = await prisma.student.findMany({ select: { id: true } });

  if (!checkUpload("STUDENTS", students, 22)) {
    await prisma.student.createMany({ data: studentData });
  }

  logUpload("STUDENTS", students, 22);
  return NextResponse.json({ status: 200, data: true });
}
