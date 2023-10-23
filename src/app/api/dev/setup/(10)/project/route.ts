import { prisma } from "@/lib/prisma";
import { randomChoice } from "@/lib/utils";
import {
  AllocationInstanceModel,
  FlagModel,
  SupervisorModel,
  TagModel,
} from "@/types/zod";
import {
  AllocationInstance,
  Flag,
  Project,
  Supervisor,
  Tag,
} from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { projectData } from "./data";

const dataSchema = z.object({
  supervisors: z.array(SupervisorModel),
  testInstance: AllocationInstanceModel,
  flags: z.array(FlagModel),
  tags: z.array(TagModel),
});

export async function POST(req: NextRequest) {
  console.log("PROJECT");
  const data = await req.json();
  const result = dataSchema.safeParse(data);

  if (!result.success) return NextResponse.json({ status: 400 }); // TODO: add more informative message

  const { supervisors, testInstance, flags, tags }: z.infer<typeof dataSchema> =
    data;

  const projects = await createProject(supervisors, testInstance);
  await connectToProject(projects, flags, tags);
  console.log("ok");

  console.log("SETUP COMPLETE");
  return NextResponse.json({ status: 200, data: projects });
}

const createProject = async (
  supervisors: Supervisor[],
  testInstance: AllocationInstance,
) => {
  await prisma.project.createMany({
    data: projectData.map(({ title, description }) => ({
      title,
      description,
      allocationInstanceId: testInstance.id ?? "",
      supervisorId: randomChoice(supervisors).id,
    })),
  });

  const projects = await prisma.project.findMany({});
  return projects;
};

const connectToProject = async (
  projects: Project[],
  flags: Flag[],
  tags: Tag[],
) => {
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
};
