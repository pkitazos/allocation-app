import { PrismaClient } from "@prisma/client";
import {
  allAlgorithms,
  flagData,
  invitationData,
  preferenceData,
  projectData,
  studentData,
  supervisorData,
  supervisorInInstanceData,
  tagData,
} from "./data";

const db = new PrismaClient();

async function main() {
  const debug = false;

  console.log("SEEDING");
  const superAdmin = await db.superAdmin.create({
    data: {
      name: "Alice",
      email: "super.allocationapp@gmail.com",
    },
  });
  if (debug) console.log("------------ SUPER-ADMIN", superAdmin);

  const allocationGroup = await db.allocationGroup.create({
    data: {
      slug: "school-of-computing-science",
      displayName: "School of Computing Science",
      superAdminId: superAdmin.id,
    },
  });
  if (debug) console.log("------------ ALLOCATION GROUP", allocationGroup);

  const groupAdmin = await db.groupAdmin.create({
    data: {
      name: "Bob",
      email: "group.allocationapp@gmail.com",
      allocationGroupId: allocationGroup.slug,
    },
  });
  if (debug) console.log("------------ GROUP ADMIN", groupAdmin);

  const allocationSubGroup = await db.allocationSubGroup.create({
    data: {
      slug: "level-4-individual-project",
      displayName: "Level 4 Individual Project",
      allocationGroupId: allocationGroup.slug,
    },
  });
  if (debug)
    console.log("------------ ALLOCATION SUB GROUP", allocationSubGroup);

  const subGroupAdmin = await db.subGroupAdmin.create({
    data: {
      name: "Chris",
      email: "subgroup.allocationapp@gmail.com",
      allocationGroupId: allocationGroup.slug,
      allocationSubGroupId: allocationSubGroup.slug,
    },
  });
  if (debug) console.log("------------ SUB GROUP ADMIN", subGroupAdmin);

  const allocationInstance = await db.allocationInstance.create({
    data: {
      slug: "2023",
      displayName: "2023",
      allocationGroupId: allocationGroup.slug,
      allocationSubGroupId: allocationSubGroup.slug,
    },
  });
  if (debug)
    console.log("------------ ALLOCATION INSTANCE", allocationInstance);

  const supervisor = await db.supervisor
    .createMany({
      data: supervisorData,
    })
    .then(async () => await db.supervisor.findMany({}));
  if (debug) console.log("------------ SUPERVISOR", supervisor);

  await db.supervisorInInstance.createMany({
    data: supervisorInInstanceData.map((item) => ({
      supervisorId: item.id,
      projectAllocationLowerBound: 0,
      projectAllocationTarget: item.projectAllocationTarget,
      projectAllocationUpperBound: item.projectAllocationUpperBound,
      allocationGroupId: allocationGroup.slug,
      allocationSubGroupId: allocationSubGroup.slug,
      allocationInstanceId: allocationInstance.slug,
    })),
  });

  const flags = await db.flag
    .createMany({ data: flagData })
    .then(async () => await db.flag.findMany({}));

  const tags = await db.tag
    .createMany({ data: tagData })
    .then(async () => await db.tag.findMany({}));

  const students = await db.student
    .createMany({ data: studentData })
    .then(async () => await db.student.findMany({ orderBy: { id: "asc" } }));

  await db.studentInInstance.createMany({
    data: students.map(({ id: studentId }) => ({
      studentId,
      allocationGroupId: allocationGroup.slug,
      allocationSubGroupId: allocationSubGroup.slug,
      allocationInstanceId: allocationInstance.slug,
    })),
  });

  await db.flagOnStudent.createMany({
    data: students.map(({ id: studentId }) => ({
      studentId,
      flagId: flags[0].id,
    })),
  });

  await db.project.createMany({
    data: projectData.slice(0, 3).map(({ id, title, description }) => ({
      id,
      title,
      description,
      supervisorId: supervisor[0].id,
      capacityLowerBound: 0,
      capacityUpperBound: 1,
      allocationGroupId: allocationGroup.slug,
      allocationSubGroupId: allocationSubGroup.slug,
      allocationInstanceId: allocationInstance.slug,
    })),
  });

  await db.project.createMany({
    data: projectData.slice(3, 6).map(({ id, title, description }) => ({
      id,
      title,
      description,
      supervisorId: supervisor[1].id,
      capacityLowerBound: 0,
      capacityUpperBound: 1,
      allocationGroupId: allocationGroup.slug,
      allocationSubGroupId: allocationSubGroup.slug,
      allocationInstanceId: allocationInstance.slug,
    })),
  });

  await db.project.createMany({
    data: projectData.slice(6, 8).map(({ id, title, description }) => ({
      id,
      title,
      description,
      supervisorId: supervisor[2].id,
      capacityLowerBound: 0,
      capacityUpperBound: 1,
      allocationGroupId: allocationGroup.slug,
      allocationSubGroupId: allocationSubGroup.slug,
      allocationInstanceId: allocationInstance.slug,
    })),
  });

  const projects = await db.project.findMany({});

  await db.flagOnProject.createMany({
    data: projects.map(({ id: projectId }) => ({
      projectId,
      flagId: flags[0].id,
    })),
  });

  await db.tagOnProject.createMany({
    data: projects.map(({ id: projectId }) => ({
      projectId,
      tagId: tags[0].id,
    })),
  });

  await db.algorithm.createMany({
    data: allAlgorithms.map(
      ({ algName, displayName, description, flag1, flag2, flag3 }) => ({
        allocationGroupId: allocationGroup.slug,
        allocationSubGroupId: allocationSubGroup.slug,
        allocationInstanceId: allocationInstance.slug,
        algName,
        displayName,
        description,
        flag1,
        flag2,
        flag3,
        matchingResultData: JSON.stringify({}),
      }),
    ),
  });

  await db.preference.createMany({
    data: preferenceData.map(({ idx, projectId, rank, type }) => ({
      studentId: students[idx].id,
      projectId,
      rank,
      type,
    })),
  });

  await db.invitation.createMany({
    data: invitationData,
  });

  console.log("ok");
  console.log("SEEDING COMPLETE");
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
