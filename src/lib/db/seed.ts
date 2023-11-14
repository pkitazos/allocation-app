import { PrismaClient } from "@prisma/client";
import {
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
  console.log("SEEDING");
  const superAdmin = await db.superAdmin.create({
    data: {
      name: "Alice",
      email: "super.allocationapp@gmail.com",
    },
  });

  const allocationGroup = await db.allocationGroup.create({
    data: {
      slug: "school-of-computing-science",
      displayName: "School of Computing Science",
      superAdminId: superAdmin.id,
    },
  });

  await db.groupAdmin.create({
    data: {
      name: "Bob",
      email: "group.allocationapp@gmail.com",
      allocationGroupId: allocationGroup.slug,
    },
  });

  const allocationSubGroup = await db.allocationSubGroup.create({
    data: {
      slug: "level-4-individual-project",
      displayName: "Level 4 Individual Project",
      allocationGroupId: allocationGroup.slug,
    },
  });

  await db.subGroupAdmin.create({
    data: {
      name: "Chris",
      email: "subgroup.allocationapp@gmail.com",
      allocationGroupId: allocationGroup.slug,
      allocationSubGroupId: allocationSubGroup.slug,
    },
  });

  const allocationInstance = await db.allocationInstance.create({
    data: {
      slug: "2023",
      displayName: "2023",
      allocationGroupId: allocationGroup.slug,
      allocationSubGroupId: allocationSubGroup.slug,
    },
  });

  const supervisor = await db.supervisor
    .createMany({
      data: supervisorData,
    })
    .then(async () => await db.supervisor.findMany({}));

  await db.supervisorInInstance.createMany({
    data: supervisorInInstanceData.map((item) => ({
      supervisorId: item.id,
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

  await db.preference.createMany({
    data: preferenceData.map(({ idx, projectId, rank }) => ({
      studentId: students[idx].id,
      projectId,
      rank,
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
