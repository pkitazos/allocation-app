import { PrismaClient, Project, Role } from "@prisma/client";

import { findItemFromTitle } from "@/lib/utils/general/find-item-from-title";
import { setDiff } from "@/lib/utils/general/set-difference";
import { setIntersection } from "@/lib/utils/general/set-intersection";
import { InstanceParams } from "@/lib/validations/params";

import { changeInstanceId } from "@/server/utils/instance/change-instance-id";

import { updateCapacityUpperBound } from "./update-capacity-upper-bound";

export async function mergeInstanceTransaction(
  db: PrismaClient,
  parentInstanceId: string,
  params: InstanceParams,
) {
  const { group, subGroup, instance } = params;
  return db.$transaction(async (tx) => {
    // * MARKING
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

    // * MARKING
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

    // * MARKING
    const pStudents = p.users.filter((u) => u.role === Role.STUDENT);
    const fStudents = f.users.filter((u) => u.role === Role.STUDENT);

    // * MARKING
    const forkedInstanceNewStudents = setDiff(
      fStudents,
      pStudents,
      (a) => a.userId,
    );

    // * COPYING
    // ! this breaks because prisma doesn't like the data having extraneous fields
    // create the new students
    await tx.userInInstance.createMany({
      data: forkedInstanceNewStudents.map((s) =>
        changeInstanceId(s, parentInstanceId),
      ),
    });

    // ? where are the student details created?

    // * MARKING
    const pSupervisors = p.users.filter((u) => u.role === Role.SUPERVISOR);
    const fSupervisors = f.users.filter((u) => u.role === Role.SUPERVISOR);

    // * MARKING
    const forkedInstanceNewSupervisors = setDiff(
      fSupervisors,
      pSupervisors,
      (a) => a.userId,
    );

    // * TRANSFORMING
    const newSupervisorData = forkedInstanceNewSupervisors.map((s) =>
      changeInstanceId(s, parentInstanceId),
    );

    // * COPYING
    // ! this breaks because prisma doesn't like the data having extraneous fields
    // create the new supervisors
    await tx.userInInstance.createMany({ data: newSupervisorData });

    // * COPYING
    // create the new supervisor details
    await tx.supervisorInstanceDetails.createMany({
      data: newSupervisorData.map((u) => u.supervisorInstanceDetails[0]),
    });

    // * MARKING
    const forkedInstanceNewFlags = setDiff(f.flags, p.flags, (a) => a.title);

    // * COPYING
    // update new flags in f to point to p
    // ? would this work for students and supervisors?
    await tx.flag.updateMany({
      where: { id: { in: forkedInstanceNewFlags.map((f) => f.id) } },
      data: { allocationInstanceId: parentInstanceId },
    });

    // * MARKING
    const forkedInstanceNewTags = setDiff(f.tags, p.tags, (a) => a.title);

    // * COPYING
    // update new tags in f to point to p
    // ? would this work for students and supervisors?
    await tx.tag.updateMany({
      where: { id: { in: forkedInstanceNewTags.map((t) => t.id) } },
      data: { allocationInstanceId: parentInstanceId },
    });

    // * MARKING
    const forkedInstanceUpdatedProjects = setIntersection(
      f.projects,
      p.projects,
      (a) => a.title,
    );

    // update each details if they changed + update project's capacity correctly
    for (const updatedProject of forkedInstanceUpdatedProjects) {
      // * TRANSFORMING
      const parentEquivalentProject = findItemFromTitle(
        p.projects,
        updatedProject.title,
      );

      // * COPYING
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

    // * MARKING
    const forkedInstanceNewProjects = setDiff(
      f.projects,
      forkedInstanceUpdatedProjects,
      (a) => a.title,
    );

    // * TRANSFORMING
    // TODO: copy this format for students and supervisors
    const newProjectData = forkedInstanceNewProjects
      .map((p) => changeInstanceId(p, parentInstanceId))
      .map(extractProjectAttributes);

    // * COPYING
    // create new projects from f in p
    await tx.project.createMany({
      data: newProjectData,
    });

    // * MARKING
    // get updated projects in p
    const postMergeParentInstanceProjects = await tx.project.findMany({
      where: {
        allocationGroupId: group,
        allocationSubGroupId: subGroup,
        allocationInstanceId: parentInstanceId,
      },
    });

    // * MARKING
    // get updated flags in p
    const postMergeParentInstanceFlags = await tx.flag.findMany({
      where: {
        allocationGroupId: group,
        allocationSubGroupId: subGroup,
        allocationInstanceId: parentInstanceId,
      },
    });

    // * MARKING
    // get updated tags in p
    const postMergeParentInstanceTags = await tx.tag.findMany({
      where: {
        allocationGroupId: group,
        allocationSubGroupId: subGroup,
        allocationInstanceId: parentInstanceId,
      },
    });

    // * MARKING
    const pFlagOnProjects = p.flags.flatMap((f) => f.flagOnProjects);
    const pTagOnProjects = p.tags.flatMap((f) => f.tagOnProject);

    // * MARKING
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

    // * MARKING
    const forkedInstanceNewFlagOnProjects = setDiff(
      forkedInstanceFlagOnProjects,
      pFlagOnProjects,
      (a) => `${a.flag.title}-${a.project.title}`,
    );

    // * COPYING
    // create new flag on projects from f in p
    await tx.flagOnProject.createMany({
      data: forkedInstanceNewFlagOnProjects.map((f) => {
        // * TRANSFORMING
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

    // * MARKING
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

    // * MARKING
    const forkedInstanceNewTagOnProjects = setDiff(
      forkedInstanceTagOnProjects,
      pTagOnProjects,
      (a) => `${a.tag.title}-${a.project.title}`,
    );

    // * COPYING
    // create new tag on projects from f in p
    await tx.tagOnProject.createMany({
      data: forkedInstanceNewTagOnProjects.map((t) => {
        // * TRANSFORMING
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

    // * MARKING
    const forkedInstanceUpdatedStudents = setIntersection(
      fStudents,
      pStudents,
      (a) => a.userId,
    );

    // * COPYING
    // delete preferences of updated students
    // TODO: delete savedPreferences as well
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

    // * COPYING
    // create new preferences of updated students
    // TODO: create savedPreferences as well
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

    // * MARKING
    const forkedInstanceProjectAllocations =
      await tx.projectAllocation.findMany({
        where: {
          allocationGroupId: group,
          allocationSubGroupId: subGroup,
          allocationInstanceId: instance,
        },
        include: { project: true, student: true },
      });

    // * TRANSFORMING
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

    // * COPYING
    // create new project allocations from f in p
    await tx.projectAllocation.createMany({
      data: forkedInstanceNewProjectAllocations,
    });

    // * COPYING
    // delete the forked instance
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
