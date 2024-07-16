import { PrismaClient, Project, Role } from "@prisma/client";

import { InstanceParams } from "@/lib/validations/params";

import { changeInstanceId } from "./change-instance-id";
import { findByUserId } from "./find-by-user-id";
import { findItemFromTitle } from "./find-item-from-title";
import { setDiff } from "./set-difference";
import { setIntersection } from "./set-intersection";
import { updateCapacityUpperBound } from "./update-capacity-upper-bound";

export async function mergeInstanceTransaction(
  db: PrismaClient,
  parentInstanceId: string,
  params: InstanceParams,
) {
  const { group, subGroup, instance } = params;
  return db.$transaction(async (tx) => {
    const p = await tx.allocationInstance.findFirstOrThrow({
      where: {
        allocationGroupId: group,
        allocationSubGroupId: subGroup,
        id: parentInstanceId,
      },
      include: {
        users: {
          include: {
            supervisorInstanceDetails: {
              where: {
                allocationGroupId: group,
                allocationSubGroupId: subGroup,
                allocationInstanceId: instance,
              },
            },
          },
        },
        projects: { include: { allocations: true } },
        flags: true,
        tags: true,
      },
    });

    const f = await tx.allocationInstance.findFirstOrThrow({
      where: {
        allocationGroupId: group,
        allocationSubGroupId: subGroup,
        id: instance,
      },
      include: {
        users: {
          include: {
            supervisorInstanceDetails: {
              where: {
                allocationGroupId: group,
                allocationSubGroupId: subGroup,
                allocationInstanceId: instance,
              },
            },
          },
        },
        projects: { include: { allocations: true } },
        flags: true,
        tags: true,
      },
    });

    const pStudents = p.users.filter((u) => u.role === Role.STUDENT);
    const fStudents = f.users.filter((u) => u.role === Role.STUDENT);

    const forkedInstanceNewStudents = setDiff(
      fStudents,
      pStudents,
      (a) => a.userId,
    );

    await tx.userInInstance.createMany({
      data: changeInstanceId(forkedInstanceNewStudents, parentInstanceId),
    });

    const pSupervisors = p.users.filter((u) => u.role === Role.SUPERVISOR);
    const fSupervisors = f.users.filter((u) => u.role === Role.SUPERVISOR);

    const forkedInstanceNewSupervisors = setDiff(
      fSupervisors,
      pSupervisors,
      (a) => a.userId,
    );

    const newSupervisorData = changeInstanceId(
      forkedInstanceNewSupervisors,
      parentInstanceId,
    );

    await tx.userInInstance.createMany({ data: newSupervisorData });

    await tx.supervisorInstanceDetails.createMany({
      data: newSupervisorData.map((u) => u.supervisorInstanceDetails[0]),
    });

    const forkedInstanceNewFlags = setDiff(f.flags, p.flags, (a) => a.title);

    await tx.flag.createMany({
      data: changeInstanceId(forkedInstanceNewFlags, parentInstanceId),
    });

    const forkedInstanceNewTags = setDiff(f.tags, p.tags, (a) => a.title);

    await tx.tag.createMany({
      data: changeInstanceId(forkedInstanceNewTags, parentInstanceId),
    });

    const forkedInstanceUpdatedProjects = setIntersection(
      f.projects,
      p.projects,
      (a) => a.title,
    );

    const updatedProjectData = forkedInstanceUpdatedProjects.map((project) => {
      const parentEquivalentProject = findItemFromTitle(
        p.projects,
        project.title,
      );

      return {
        ...parentEquivalentProject,
        description: project.description,
        preAllocatedStudentId: project.preAllocatedStudentId,
        capacityUpperBound: updateCapacityUpperBound(
          parentEquivalentProject,
          project,
        ),
      };
    });

    await tx.project.deleteMany({
      where: { id: { in: updatedProjectData.map((p) => p.id) } },
    });

    await tx.project.createMany({
      data: updatedProjectData.map(extractProjectAttributes),
    });

    const forkedInstanceNewProjects = setDiff(
      f.projects,
      forkedInstanceUpdatedProjects,
      (a) => a.title,
    );

    const newProjectData = changeInstanceId(
      forkedInstanceNewProjects,
      parentInstanceId,
    );

    await tx.project.createMany({
      data: newProjectData.map(extractProjectAttributes),
    });

    await tx.flagOnProject.deleteMany({
      where: {
        projectId: { in: forkedInstanceUpdatedProjects.map((p) => p.id) },
      },
    });

    const forkedInstanceUpdatedFlagOnProjects = await tx.flagOnProject.findMany(
      {
        where: {
          project: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
        },
        select: { flag: true, project: true },
      },
    );

    await tx.flagOnProject.createMany({
      data: forkedInstanceUpdatedFlagOnProjects.map((f) => ({
        flagId: findItemFromTitle(p.flags, f.flag.title).id,
        projectId: findItemFromTitle(p.projects, f.project.title).id,
      })),
    });

    await tx.tagOnProject.deleteMany({
      where: {
        projectId: { in: forkedInstanceUpdatedProjects.map((p) => p.id) },
      },
    });

    const forkedInstanceUpdatedTagOnProjects = await tx.tagOnProject.findMany({
      where: {
        project: {
          allocationGroupId: group,
          allocationSubGroupId: subGroup,
          allocationInstanceId: instance,
        },
      },
      select: { tag: true, project: true },
    });

    await tx.tagOnProject.createMany({
      data: forkedInstanceUpdatedTagOnProjects.map((f) => ({
        tagId: findItemFromTitle(p.tags, f.tag.title).id,
        projectId: findItemFromTitle(p.projects, f.project.title).id,
      })),
    });

    const forkedInstanceProjectAllocations =
      await tx.projectAllocation.findMany({
        where: {
          allocationGroupId: group,
          allocationSubGroupId: subGroup,
          allocationInstanceId: instance,
        },
        include: { project: true, student: true },
      });

    const postMergeParentInstanceProjects = await tx.project.findMany({
      where: {
        allocationGroupId: group,
        allocationSubGroupId: subGroup,
        allocationInstanceId: parentInstanceId,
      },
    });

    const postMergeParentInstanceStudents = await tx.userInInstance.findMany({
      where: {
        allocationGroupId: group,
        allocationSubGroupId: subGroup,
        allocationInstanceId: parentInstanceId,
        role: Role.STUDENT,
      },
    });

    const forkedInstanceNewProjectAllocations =
      forkedInstanceProjectAllocations.map((projectAllocation) => {
        const parentEquivalentProject = findItemFromTitle(
          postMergeParentInstanceProjects,
          projectAllocation.project.title,
        );

        const parentEquivalentStudent = findByUserId(
          postMergeParentInstanceStudents,
          projectAllocation.student.userId,
        );

        return {
          allocationGroupId: group,
          allocationSubGroupId: subGroup,
          allocationInstanceId: parentInstanceId,
          projectId: parentEquivalentProject.id,
          userId: parentEquivalentStudent.userId,
          studentRanking: projectAllocation.studentRanking,
        };
      });

    await tx.projectAllocation.createMany({
      data: forkedInstanceNewProjectAllocations,
    });
  });
}

function extractProjectAttributes<T extends Project>(p: T) {
  return {
    allocationGroupId: p.allocationGroupId,
    allocationSubGroupId: p.allocationSubGroupId,
    allocationInstanceId: p.allocationInstanceId,
    title: p.title,
    description: p.description,
    supervisorId: p.supervisorId,
    capacityLowerBound: p.capacityLowerBound,
    capacityUpperBound: p.capacityUpperBound,
  };
}
