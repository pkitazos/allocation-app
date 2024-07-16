import { slugify } from "@/lib/utils/general/slugify";
import { InstanceParams } from "@/lib/validations/params";
import { PrismaClient } from "@prisma/client";
import {
  getAvailableStudents,
  getAvailableSupervisors,
  getAvailableProjects,
  copyInstanceFlags,
  copyInstanceTags,
  createStudents,
  createSupervisors,
  createProjects,
  createFlagOnProjects,
  createTagOnProjects,
} from "./instance-forking";
import { ForkedInstanceDetails } from "@/lib/validations/instance-form";

export async function forkInstanceTransaction(
  db: PrismaClient,
  forked: ForkedInstanceDetails,
  params: InstanceParams,
) {
  const { group, subGroup, instance } = params;
  return db.$transaction(async (tx) => {
    const availableStudents = await getAvailableStudents(tx, params);
    const availableSupervisors = await getAvailableSupervisors(tx, params);
    const availableProjects = await getAvailableProjects(availableSupervisors);

    const parentInstance = await tx.allocationInstance.findFirstOrThrow({
      where: {
        allocationGroupId: group,
        allocationSubGroupId: subGroup,
        id: instance,
      },
    });

    const forkedInstance = await tx.allocationInstance.create({
      data: {
        allocationGroupId: group,
        allocationSubGroupId: subGroup,
        id: slugify(forked.instanceName),
        parentInstanceId: instance,
        displayName: forked.instanceName,
        projectSubmissionDeadline: forked.projectSubmissionDeadline,
        preferenceSubmissionDeadline: forked.preferenceSubmissionDeadline,
        minPreferences: parentInstance.minPreferences,
        maxPreferences: parentInstance.maxPreferences,
        maxPreferencesPerSupervisor: parentInstance.maxPreferencesPerSupervisor,
      },
    });

    const newFlags = await copyInstanceFlags(tx, params, forkedInstance.id);

    const newTags = await copyInstanceTags(tx, params, forkedInstance.id);

    await createStudents(tx, availableStudents, forkedInstance.id);

    await createSupervisors(
      tx,
      availableSupervisors,
      params,
      forkedInstance.id,
    );

    const newProjects = await createProjects(
      tx,
      availableProjects,
      params,
      forkedInstance.id,
    );

    await createFlagOnProjects(tx, newProjects, newFlags);
    await createTagOnProjects(tx, newProjects, newTags);

    const newAlgorithmData = await tx.algorithm.findMany({
      where: {
        allocationGroupId: group,
        allocationSubGroupId: subGroup,
        allocationInstanceId: instance,
      },
    });

    await tx.algorithm.createMany({
      data: newAlgorithmData.map((a) => ({
        ...a,
        allocationInstanceId: forkedInstance.id,
        matchingResultData: JSON.stringify({}),
      })),
    });
  });
}
