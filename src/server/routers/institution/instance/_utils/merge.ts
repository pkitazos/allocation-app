import { PrismaClient, Project, Role } from "@prisma/client";

import { findItemFromTitle } from "@/lib/utils/general/find-item-from-title";
import { setDiff } from "@/lib/utils/general/set-difference";
import { setIntersection } from "@/lib/utils/general/set-intersection";
import { InstanceParams } from "@/lib/validations/params";

import { changeInstanceId } from "@/server/utils/change-instance-id";

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
            studentPreferences: {
              where: {
                allocationGroupId: group,
                allocationSubGroupId: subGroup,
                allocationInstanceId: instance,
              },
              include: { project: true },
            },
          },
        },
        projects: { include: { allocations: true } },
        flags: {
          include: {
            flagOnProjects: { select: { flag: true, project: true } },
          },
        },
        tags: {
          include: { tagOnProject: { select: { tag: true, project: true } } },
        },
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
            studentPreferences: {
              where: {
                allocationGroupId: group,
                allocationSubGroupId: subGroup,
                allocationInstanceId: instance,
              },
              include: { project: true },
            },
          },
        },
        projects: { include: { allocations: true } },
        flags: {
          include: {
            flagOnProjects: { select: { flag: true, project: true } },
          },
        },
        tags: {
          include: { tagOnProject: { select: { tag: true, project: true } } },
        },
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
      data: forkedInstanceNewStudents.map((s) =>
        changeInstanceId(s, parentInstanceId),
      ),
    });

    const pSupervisors = p.users.filter((u) => u.role === Role.SUPERVISOR);
    const fSupervisors = f.users.filter((u) => u.role === Role.SUPERVISOR);

    const forkedInstanceNewSupervisors = setDiff(
      fSupervisors,
      pSupervisors,
      (a) => a.userId,
    );

    const newSupervisorData = forkedInstanceNewSupervisors.map((s) =>
      changeInstanceId(s, parentInstanceId),
    );

    await tx.userInInstance.createMany({ data: newSupervisorData });

    await tx.supervisorInstanceDetails.createMany({
      data: newSupervisorData.map((u) => u.supervisorInstanceDetails[0]),
    });

    const forkedInstanceNewFlags = setDiff(f.flags, p.flags, (a) => a.title);

    await tx.flag.updateMany({
      where: { id: { in: forkedInstanceNewFlags.map((f) => f.id) } },
      data: { allocationInstanceId: parentInstanceId },
    });

    const forkedInstanceNewTags = setDiff(f.tags, p.tags, (a) => a.title);

    await tx.tag.updateMany({
      where: { id: { in: forkedInstanceNewTags.map((t) => t.id) } },
      data: { allocationInstanceId: parentInstanceId },
    });

    const forkedInstanceUpdatedProjects = setIntersection(
      f.projects,
      p.projects,
      (a) => a.title,
    );

    for (const updatedProject of forkedInstanceUpdatedProjects) {
      const parentEquivalentProject = findItemFromTitle(
        p.projects,
        updatedProject.title,
      );

      await tx.project.update({
        where: { id: parentEquivalentProject.id },
        data: {
          description: updatedProject.description,
          preAllocatedStudentId: updatedProject.preAllocatedStudentId,
          capacityUpperBound: updateCapacityUpperBound(
            parentEquivalentProject,
            updatedProject,
          ),
        },
      });
    }

    const forkedInstanceNewProjects = setDiff(
      f.projects,
      forkedInstanceUpdatedProjects,
      (a) => a.title,
    );

    const newProjectData = forkedInstanceNewProjects
      .map((p) => changeInstanceId(p, parentInstanceId))
      .map(extractProjectAttributes);

    await tx.project.createMany({
      data: newProjectData,
    });

    const postMergeParentInstanceProjects = await tx.project.findMany({
      where: {
        allocationGroupId: group,
        allocationSubGroupId: subGroup,
        allocationInstanceId: parentInstanceId,
      },
    });

    const postMergeParentInstanceFlags = await tx.flag.findMany({
      where: {
        allocationGroupId: group,
        allocationSubGroupId: subGroup,
        allocationInstanceId: parentInstanceId,
      },
    });

    const postMergeParentInstanceTags = await tx.tag.findMany({
      where: {
        allocationGroupId: group,
        allocationSubGroupId: subGroup,
        allocationInstanceId: parentInstanceId,
      },
    });

    const pFlagOnProjects = p.flags.flatMap((f) => f.flagOnProjects);
    const pTagOnProjects = p.tags.flatMap((f) => f.tagOnProject);

    const forkedInstanceFlagOnProjects = await tx.flagOnProject.findMany({
      where: {
        project: {
          allocationGroupId: group,
          allocationSubGroupId: subGroup,
          allocationInstanceId: instance,
        },
      },
      select: { flag: true, project: true },
    });

    const forkedInstanceNewFlagOnProjects = setDiff(
      forkedInstanceFlagOnProjects,
      pFlagOnProjects,
      (a) => `${a.flag.title}-${a.project.title}`,
    );

    await tx.flagOnProject.createMany({
      data: forkedInstanceNewFlagOnProjects.map((f) => {
        const parentEquivalentFlag = findItemFromTitle(
          postMergeParentInstanceFlags,
          f.flag.title,
        );
        const parentEquivalentProject = findItemFromTitle(
          postMergeParentInstanceProjects,
          f.project.title,
        );
        return {
          flagId: parentEquivalentFlag.id,
          projectId: parentEquivalentProject.id,
        };
      }),
    });

    const forkedInstanceTagOnProjects = await tx.tagOnProject.findMany({
      where: {
        project: {
          allocationGroupId: group,
          allocationSubGroupId: subGroup,
          allocationInstanceId: instance,
        },
      },
      select: { tag: true, project: true },
    });

    const forkedInstanceNewTagOnProjects = setDiff(
      forkedInstanceTagOnProjects,
      pTagOnProjects,
      (a) => `${a.tag.title}-${a.project.title}`,
    );

    await tx.tagOnProject.createMany({
      data: forkedInstanceNewTagOnProjects.map((t) => {
        const parentEquivalentProject = findItemFromTitle(
          postMergeParentInstanceProjects,
          t.project.title,
        );
        const parentEquivalentTag = findItemFromTitle(
          postMergeParentInstanceTags,
          t.tag.title,
        );

        return {
          tagId: parentEquivalentTag.id,
          projectId: parentEquivalentProject.id,
        };
      }),
    });

    const forkedInstanceUpdatedStudents = setIntersection(
      fStudents,
      pStudents,
      (a) => a.userId,
    );

    await tx.preference.deleteMany({
      where: {
        allocationGroupId: group,
        allocationSubGroupId: subGroup,
        allocationInstanceId: parentInstanceId,
        userId: {
          in: forkedInstanceUpdatedStudents
            .filter((s) => s.studentPreferences.length > 0)
            .map((s) => s.userId),
        },
      },
    });

    await tx.preference.createMany({
      data: fStudents.flatMap(({ userId, studentPreferences }) =>
        studentPreferences.map((p) => {
          const parentEquivalentProject = findItemFromTitle(
            postMergeParentInstanceProjects,
            p.project.title,
          );
          return {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: parentInstanceId,
            userId: userId,
            projectId: parentEquivalentProject.id,
            rank: p.rank,
            type: p.type,
          };
        }),
      ),
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

    const forkedInstanceNewProjectAllocations =
      forkedInstanceProjectAllocations.map((projectAllocation) => {
        const parentEquivalentProject = findItemFromTitle(
          postMergeParentInstanceProjects,
          projectAllocation.project.title,
        );

        return {
          allocationGroupId: group,
          allocationSubGroupId: subGroup,
          allocationInstanceId: parentInstanceId,
          projectId: parentEquivalentProject.id,
          userId: projectAllocation.student.userId,
          studentRanking: projectAllocation.studentRanking,
        };
      });

    await tx.projectAllocation.createMany({
      data: forkedInstanceNewProjectAllocations,
    });

    await tx.allocationInstance.delete({
      where: {
        instanceId: {
          allocationGroupId: group,
          allocationSubGroupId: subGroup,
          id: instance,
        },
      },
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
    latestEditDateTime: p.latestEditDateTime,
  };
}
