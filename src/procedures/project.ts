import { prisma } from "@/lib/prisma";
import { Flag } from "@prisma/client";

export async function getAllProjects(allocationInstanceId: string) {
  return prisma.project.findMany({
    where: {
      allocationInstanceId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      flags: true,
      tags: true,
      supervisor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function getProjectsByFlag(flag: Flag) {
  return prisma.project.findMany({
    where: {
      flags: {
        some: {
          id: flag.id,
        },
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      flags: true,
      tags: true,
      supervisor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}
