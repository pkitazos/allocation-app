import { Flag, Role, Tag, UserInInstance } from "@prisma/client";

import { PrismaTransactionClient } from "@/lib/db";
import { findItemFromTitle } from "@/lib/utils/general/find-item-from-title";
import { InstanceParams } from "@/lib/validations/params";

export async function getAvailableStudents(
  db: PrismaTransactionClient,
  params: InstanceParams,
) {
  return await db.userInInstance.findMany({
    where: {
      allocationGroupId: params.group,
      allocationSubGroupId: params.subGroup,
      allocationInstanceId: params.instance,
      role: Role.STUDENT,
      studentAllocation: { is: null },
    },
  });
}

export async function getAvailableSupervisors(
  db: PrismaTransactionClient,
  params: InstanceParams,
): Promise<AvailableSupervisor[]> {
  const allSupervisors = await db.userInInstance.findMany({
    where: {
      allocationGroupId: params.group,
      allocationSubGroupId: params.subGroup,
      allocationInstanceId: params.instance,
      role: Role.SUPERVISOR,
    },
    select: {
      userId: true,
      role: true,
      supervisorProjects: {
        select: {
          id: true,
          title: true,
          description: true,
          capacityUpperBound: true,
          allocations: true,
          flagOnProjects: { select: { flag: { select: { title: true } } } },
          tagOnProject: { select: { tag: { select: { title: true } } } },
        },
      },
      supervisorInstanceDetails: {
        where: {
          allocationGroupId: params.group,
          allocationSubGroupId: params.subGroup,
          allocationInstanceId: params.instance,
        },
        select: {
          projectAllocationLowerBound: true,
          projectAllocationTarget: true,
          projectAllocationUpperBound: true,
        },
      },
    },
  });

  return allSupervisors
    .map(({ supervisorInstanceDetails, ...s }) => {
      const capacities = supervisorInstanceDetails[0];

      const allocationCount = s.supervisorProjects
        .map((p) => p.allocations.length)
        .reduce((a, b) => a + b, 0);

      const remainingCapacity =
        capacities.projectAllocationUpperBound - allocationCount;

      return {
        userId: s.userId,
        role: s.role,

        capacities: { ...capacities, remainingCapacity },

        projects: s.supervisorProjects.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          capacityUpperBound: p.capacityUpperBound,
          allocationCount: p.allocations.length,
          flags: p.flagOnProjects.map((f) => f.flag),
          tags: p.tagOnProject.map((t) => t.tag),
        })),
      };
    })
    .filter((s) => s.capacities.remainingCapacity > 0);
}

export async function getAvailableProjects(
  availableSupervisors: AvailableSupervisor[],
) {
  return availableSupervisors
    .flatMap((s) =>
      s.projects.map((p) => ({
        ...p,
        supervisorId: s.userId,
        actualCapacity: p.allocationCount,
        remainingCapacity: p.capacityUpperBound - p.allocationCount,
      })),
    )
    .filter((p) => p.remainingCapacity > 0);
}

export async function copyInstanceFlags(
  db: PrismaTransactionClient,
  params: InstanceParams,
  forkedInstanceId: string,
) {
  const flags = await db.flag.findMany({
    where: {
      allocationGroupId: params.group,
      allocationSubGroupId: params.subGroup,
      allocationInstanceId: params.instance,
    },
  });

  await db.flag.createMany({
    data: flags.map(({ title }) => ({
      title,
      allocationGroupId: params.group,
      allocationSubGroupId: params.subGroup,
      allocationInstanceId: forkedInstanceId,
    })),
  });

  return await db.flag.findMany({
    where: {
      allocationGroupId: params.group,
      allocationSubGroupId: params.subGroup,
      allocationInstanceId: forkedInstanceId,
    },
  });
}

export async function copyInstanceTags(
  db: PrismaTransactionClient,
  params: InstanceParams,
  forkedInstanceId: string,
) {
  const tags = await db.tag.findMany({
    where: {
      allocationGroupId: params.group,
      allocationSubGroupId: params.subGroup,
      allocationInstanceId: params.instance,
    },
  });

  await db.tag.createMany({
    data: tags.map(({ title }) => ({
      title,
      allocationGroupId: params.group,
      allocationSubGroupId: params.subGroup,
      allocationInstanceId: forkedInstanceId,
    })),
  });

  return await db.tag.findMany({
    where: {
      allocationGroupId: params.group,
      allocationSubGroupId: params.subGroup,
      allocationInstanceId: forkedInstanceId,
    },
  });
}

export async function createStudents(
  db: PrismaTransactionClient,
  availableStudents: UserInInstance[],
  forkedInstanceId: string,
) {
  await db.userInInstance.createMany({
    data: availableStudents.map((student) => ({
      ...student,
      allocationInstanceId: forkedInstanceId,
    })),
  });
}

export async function createSupervisors(
  db: PrismaTransactionClient,
  availableSupervisors: AvailableSupervisor[],
  params: InstanceParams,
  forkedInstanceId: string,
) {
  await db.userInInstance.createMany({
    data: availableSupervisors.map((supervisor) => ({
      userId: supervisor.userId,
      allocationGroupId: params.group,
      allocationSubGroupId: params.subGroup,
      allocationInstanceId: forkedInstanceId,
      role: Role.SUPERVISOR,
    })),
  });

  /**
   * example:
   *
   * original_target: 2
   * original_upperBound: 3
   *
   * -> fork instance and adjust capacities
   *
   * if (adjusted_upperBound === 2) // adjusted_upperBound >= original_target
   * then the target can remain 2
   *
   * if (adjusted_upperBound === 1) // adjusted_upperBound < original_target
   * then the target should be adjusted to 1 // set adjusted_target = adjusted upperBound
   */
  await db.supervisorInstanceDetails.createMany({
    data: availableSupervisors.map((s) => {
      const adjustedUpperBound = s.capacities.remainingCapacity;
      const originalTarget = s.capacities.projectAllocationTarget;
      const adjustedTarget =
        adjustedUpperBound >= originalTarget
          ? originalTarget
          : adjustedUpperBound;
      return {
        userId: s.userId,
        allocationGroupId: params.group,
        allocationSubGroupId: params.subGroup,
        allocationInstanceId: forkedInstanceId,
        projectAllocationLowerBound: s.capacities.projectAllocationLowerBound,
        projectAllocationTarget: adjustedTarget,
        projectAllocationUpperBound: adjustedUpperBound,
      };
    }),
  });
}

export async function createProjects(
  db: PrismaTransactionClient,
  availableProjects: AvailableProjects[],
  params: InstanceParams,
  forkedInstanceId: string,
): Promise<ModifiedProject[]> {
  await db.project.createMany({
    data: availableProjects.map((p) => ({
      title: p.title,
      description: p.description,
      supervisorId: p.supervisorId,
      capacityLowerBound: 0,
      capacityUpperBound: p.remainingCapacity,
      allocationGroupId: params.group,
      allocationSubGroupId: params.subGroup,
      allocationInstanceId: forkedInstanceId,
    })),
  });

  const newProjects = await db.project.findMany({
    where: {
      allocationGroupId: params.group,
      allocationSubGroupId: params.subGroup,
      allocationInstanceId: forkedInstanceId,
    },
  });

  return newProjects.map((p) => ({
    ...p,
    flags: findItemFromTitle(availableProjects, p.title).flags,
    tags: findItemFromTitle(availableProjects, p.title).tags,
  }));
}

export async function createFlagOnProjects(
  db: PrismaTransactionClient,
  newProjects: ModifiedProject[],
  newFlags: Flag[],
) {
  await db.flagOnProject.createMany({
    data: newProjects.flatMap((p) =>
      p.flags.map((f) => ({
        projectId: p.id,
        flagId: findItemFromTitle(newFlags, f.title).id,
      })),
    ),
  });
}

export async function createTagOnProjects(
  db: PrismaTransactionClient,
  newProjects: ModifiedProject[],
  newTags: Tag[],
) {
  await db.tagOnProject.createMany({
    data: newProjects.flatMap((p) =>
      p.tags.map((t) => ({
        projectId: p.id,
        tagId: findItemFromTitle(newTags, t.title).id,
      })),
    ),
  });
}

type AvailableSupervisor = {
  userId: string;
  role: Role;
  capacities: {
    remainingCapacity: number;
    projectAllocationLowerBound: number;
    projectAllocationTarget: number;
    projectAllocationUpperBound: number;
  };
  projects: {
    id: string;
    title: string;
    description: string;
    capacityUpperBound: number;
    flags: { title: string }[];
    tags: { title: string }[];
    allocationCount: number;
  }[];
};

type AvailableProjects = {
  id: string;
  title: string;
  description: string;
  supervisorId: string;
  capacityUpperBound: number;
  actualCapacity: number;
  remainingCapacity: number;
  flags: {
    title: string;
  }[];
  tags: {
    title: string;
  }[];
};

type ModifiedProject = Omit<
  AvailableProjects,
  "remainingCapacity" | "actualCapacity"
>;
