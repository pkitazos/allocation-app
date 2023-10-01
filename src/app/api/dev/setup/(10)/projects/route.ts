import { projectData, studentData } from "@/data";
import { prisma } from "@/lib/prisma";
import { checkUpload, randomChoice } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST() {
  const supervisors = (
    await prisma.supervisor.findMany({
      select: { id: true },
    })
  ).map((item) => item.id);

  const allocInstanId = "481674ab-c2a8-4964-9a3b-77657fe91dca";

  const projects = await prisma.project.findMany({});

  if (!checkUpload("PROJECTS", projects, 33)) {
    await prisma.project.createMany({
      data: projectData.map(({ title, description }) => ({
        title: title,
        description: description,
        allocationInstanceId: allocInstanId,
        supervisorId: randomChoice(supervisors),
      })),
    });
  }
  return NextResponse.json({ status: 200, data: true });
}
