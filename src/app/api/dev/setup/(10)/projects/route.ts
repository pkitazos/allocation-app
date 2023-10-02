import { projectData, studentData } from "@/data";
import { prisma } from "@/lib/prisma";
import { checkUpload, logUpload, randomChoice } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST() {
  const supervisors = (
    await prisma.supervisor.findMany({
      select: { id: true },
    })
  ).map((item) => item.id);

  const allocationInstance = await prisma.allocationInstance.findFirst({
    where: {
      name: "2023",
      allocationSubGroup: {
        name: "Level 4 Individual Project",
      },
    },
    select: {
      id: true,
    },
  });

  const projects = await prisma.project.findMany({});

  if (!checkUpload("PROJECTS", projects, 33)) {
    await prisma.project.createMany({
      data: projectData.map(({ title, description }) => ({
        title: title,
        description: description,
        allocationInstanceId: allocationInstance?.id ?? "",
        supervisorId: randomChoice(supervisors),
      })),
    });
  }

  logUpload("PROJECTS", projects, 33);
  return NextResponse.json({ status: 200, data: true });
}
