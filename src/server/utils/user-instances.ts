import {
  AllocationInstance,
  AllocationSubGroup,
  PrismaClient,
} from "@prisma/client";

export async function getUserInstances(db: PrismaClient, userId: string) {
  const userInstances = await db.userInInstance.findMany({
    where: { userId },
  });

  const instances: AllocationInstance[] = [];
  for (const item of userInstances) {
    const instance = await db.allocationInstance.findFirstOrThrow({
      where: {
        allocationGroupId: item.allocationGroupId,
        allocationSubGroupId: item.allocationSubGroupId,
        id: item.allocationInstanceId,
      },
    });
    instances.push(instance);
  }
  return instances;
}

type GroupWithSubGroupsAndInstances = {
  id: string;
  displayName: string;
} & {
  allocationSubGroups: SubGroupWithInstances[];
};

type GroupWithSubGroups = {
  id: string;
  displayName: string;
} & {
  allocationSubGroups: AllocationSubGroup[];
};

type SubGroupWithInstances = {
  id: string;
  displayName: string;
  allocationGroupId: string;
} & {
  allocationInstances: AllocationInstance[];
};

export function getGroupInstances(group: GroupWithSubGroupsAndInstances) {
  return group.allocationSubGroups.flatMap((e) => e.allocationInstances);
}

export function getSubGroupInstances(subGroup: SubGroupWithInstances) {
  return subGroup.allocationInstances;
}

export function formatInstanceData(
  allGroups: GroupWithSubGroups[],
  instance: AllocationInstance,
) {
  const groupIdx = allGroups.findIndex(({ id }) => {
    return id === instance.allocationGroupId;
  });
  const group = allGroups[groupIdx];

  const subGroupIdx = group.allocationSubGroups.findIndex(({ id }) => {
    return id === instance.allocationSubGroupId;
  });
  const subGroup = group.allocationSubGroups[subGroupIdx];

  return {
    group: {
      id: group.id,
      displayName: group.displayName,
    },
    subGroup: {
      id: subGroup.id,
      displayName: subGroup.displayName,
    },
    instance: {
      id: instance.id,
      displayName: instance.displayName,
    },
  };
}
