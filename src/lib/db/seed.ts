import { AdminLevel, PrismaClient, Role } from "@prisma/client";

import { dbg } from "@/lib/utils/general/console-debug";

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
  testGroup,
  testGroupAdmin,
  testInstance,
  testStudent,
  testSubGroup,
  testSubGroupAdmin,
  testSuperAdmin,
  testSupervisor,
} from "./data";

const db = new PrismaClient();

const inviteFlag = process.argv.includes("--invite");

async function main() {
  if (inviteFlag) {
    console.log("---------->> SEEDING invites");

    await db.invitation.createMany({
      data: invitationData.map(({ email }) => ({
        email,
        allocationGroupId: testGroup.id,
        allocationSubGroupId: testSubGroup.id,
        allocationInstanceId: testInstance.id,
      })),
    });

    console.log("ok");
    console.log("<<---------- SEEDING invites COMPLETE");
    return;
  }

  console.log("---------->> SEEDING");

  const superAdmin = await db.adminInSpace.create({
    data: {
      adminLevel: AdminLevel.SUPER,
      user: { connect: { email: testSuperAdmin.email } },
    },
  });
  dbg("SUPER-ADMIN", superAdmin);

  const groupAdmin = await db.adminInSpace.create({
    data: {
      adminLevel: AdminLevel.GROUP,
      user: { connect: { email: testGroupAdmin.email } },
    },
  });
  dbg("GROUP ADMIN", groupAdmin);

  const subGroupAdmin = await db.adminInSpace.create({
    data: {
      adminLevel: AdminLevel.SUB_GROUP,
      user: { connect: { email: testSubGroupAdmin.email } },
    },
  });
  dbg("SUB_GROUP ADMIN", subGroupAdmin);

  const allocationGroup = await db.allocationGroup.create({
    data: {
      id: testGroup.id,
      displayName: testGroup.displayName,
      groupAdmins: { connect: { systemId: groupAdmin.systemId } },
    },
  });
  dbg("GROUP", allocationGroup);

  const allocationSubGroup = await db.allocationSubGroup.create({
    data: {
      allocationGroupId: allocationGroup.id,
      id: testSubGroup.id,
      displayName: testSubGroup.displayName,
      subGroupAdmins: { connect: { systemId: subGroupAdmin.systemId } },
    },
  });
  dbg("SUB_GROUP", allocationSubGroup);

  const allocationInstance = await db.allocationInstance.create({
    data: {
      allocationGroupId: allocationGroup.id,
      allocationSubGroupId: allocationSubGroup.id,
      id: testInstance.id,
      displayName: testInstance.displayName,
      minPreferences: 1,
      maxPreferences: 10,
      maxPreferencesPerSupervisor: 10,
      projectSubmissionDeadline: new Date("2024-02-20"),
      preferenceSubmissionDeadline: new Date("2024-03-20"),
    },
  });
  dbg("INSTANCE", allocationInstance);

  const supervisorUser = await db.user.findFirstOrThrow({
    where: { email: testSupervisor.email },
  });

  const supervisor = await db.userInInstance.create({
    data: {
      allocationGroupId: allocationGroup.id,
      allocationSubGroupId: allocationSubGroup.id,
      allocationInstanceId: allocationInstance.id,
      role: Role.SUPERVISOR,
      userId: supervisorUser.id,
    },
  });
  dbg("SUPERVISOR", supervisor);

  await db.user.createMany({
    data: supervisorData.map(({ id, name, email }) => ({
      id,
      name,
      email,
    })),
  });
  dbg("SUPERVISORS - USERS");

  const [supervisor2, supervisor3] = await db.userInInstance
    .createMany({
      data: supervisorData.map(({ id }) => ({
        allocationGroupId: allocationGroup.id,
        allocationSubGroupId: allocationSubGroup.id,
        allocationInstanceId: allocationInstance.id,
        role: Role.SUPERVISOR,
        userId: id, // ? this now hopefully works
      })),
    })
    .then(
      async () =>
        await db.userInInstance.findMany({
          where: { role: Role.SUPERVISOR, NOT: { userId: supervisor.userId } },
          take: 2, // ? not actually helpful
        }),
    );
  dbg("SUPERVISORS - REST", { supervisor, supervisor2, supervisor3 });

  const testSupervisorUser = await db.user.findFirstOrThrow({
    where: { email: testSupervisor.email },
  });

  await db.supervisorInstanceDetails.create({
    data: {
      projectAllocationLowerBound: 0,
      projectAllocationTarget: testSupervisor.projectAllocationTarget,
      projectAllocationUpperBound: testSupervisor.projectAllocationUpperBound,
      userInInstance: {
        connect: {
          instanceMembership: {
            allocationGroupId: allocationGroup.id,
            allocationSubGroupId: allocationSubGroup.id,
            allocationInstanceId: allocationInstance.id,
            userId: testSupervisorUser.id,
          },
        },
      },
    },
  });

  for (const item of supervisorInInstanceData) {
    await db.supervisorInstanceDetails.create({
      data: {
        projectAllocationLowerBound: 0,
        projectAllocationTarget: item.projectAllocationTarget,
        projectAllocationUpperBound: item.projectAllocationUpperBound,
        userInInstance: {
          connect: {
            instanceMembership: {
              allocationGroupId: allocationGroup.id,
              allocationSubGroupId: allocationSubGroup.id,
              allocationInstanceId: allocationInstance.id,
              userId: item.id,
            },
          },
        },
      },
    });
  }
  dbg("SUPERVISORS - DETAILS");

  const flags = await db.flag
    .createMany({
      data: flagData.map((e) => ({
        allocationGroupId: allocationGroup.id,
        allocationSubGroupId: allocationSubGroup.id,
        allocationInstanceId: allocationInstance.id,
        ...e,
      })),
    })
    .then(async () => await db.flag.findMany({}));
  dbg("FLAGS");

  const tags = await db.tag
    .createMany({
      data: tagData.map((e) => ({
        allocationGroupId: allocationGroup.id,
        allocationSubGroupId: allocationSubGroup.id,
        allocationInstanceId: allocationInstance.id,
        ...e,
      })),
    })
    .then(async () => await db.tag.findMany({}));
  dbg("TAGS");

  const studentUser = await db.user.findFirstOrThrow({
    where: { email: testStudent.email },
  });

  const student = await db.userInInstance.create({
    data: {
      allocationGroupId: allocationGroup.id,
      allocationSubGroupId: allocationSubGroup.id,
      allocationInstanceId: allocationInstance.id,
      role: Role.STUDENT,
      userId: studentUser.id,
    },
  });
  dbg("STUDENT", student);

  await db.user.createMany({
    data: studentData.map(({ id, name, email }) => ({
      id,
      name,
      email,
    })),
  });
  dbg("STUDENTS - USERS");

  const students = await db.userInInstance
    .createMany({
      data: studentData.map(({ id }) => ({
        allocationGroupId: allocationGroup.id,
        allocationSubGroupId: allocationSubGroup.id,
        allocationInstanceId: allocationInstance.id,
        role: Role.STUDENT,
        userId: id, // ? this now hopefully works
      })),
    })
    .then(
      async () =>
        await db.userInInstance.findMany({
          where: { role: Role.STUDENT },
          orderBy: { userId: "asc" },
        }),
    );
  dbg("STUDENTS - REST");

  await db.studentInstanceDetails.createMany({
    data: students.map(({ userId }) => ({
      allocationGroupId: allocationGroup.id,
      allocationSubGroupId: allocationSubGroup.id,
      allocationInstanceId: allocationInstance.id,
      userId,
    })),
  });
  dbg("STUDENTS - DETAILS");

  await db.flagOnStudent.createMany({
    data: students.map(({ userId }) => ({
      allocationGroupId: allocationGroup.id,
      allocationSubGroupId: allocationSubGroup.id,
      allocationInstanceId: allocationInstance.id,
      userId,

      flagId: flags[0].id,
    })),
  });
  dbg("STUDENTS - FLAGS");

  await db.project.createMany({
    data: projectData.slice(0, 3).map(({ id, title, description }) => ({
      id,
      title,
      description,
      supervisorId: supervisor.userId,
      capacityLowerBound: 0,
      capacityUpperBound: 1,
      allocationGroupId: allocationGroup.id,
      allocationSubGroupId: allocationSubGroup.id,
      allocationInstanceId: allocationInstance.id,
    })),
  });
  dbg("PROJECTS - SUPERVISOR 1");

  await db.project.createMany({
    data: projectData.slice(3, 6).map(({ id, title, description }) => ({
      id,
      title,
      description,
      supervisorId: supervisor2.userId,
      capacityLowerBound: 0,
      capacityUpperBound: 1,
      allocationGroupId: allocationGroup.id,
      allocationSubGroupId: allocationSubGroup.id,
      allocationInstanceId: allocationInstance.id,
    })),
  });
  dbg("PROJECTS - SUPERVISOR 2");

  await db.project.createMany({
    data: projectData.slice(6, 8).map(({ id, title, description }) => ({
      id,
      title,
      description,
      supervisorId: supervisor3.userId,
      capacityLowerBound: 0,
      capacityUpperBound: 1,
      allocationGroupId: allocationGroup.id,
      allocationSubGroupId: allocationSubGroup.id,
      allocationInstanceId: allocationInstance.id,
    })),
  });
  dbg("PROJECTS - SUPERVISOR 3");

  const projects = await db.project.findMany({});

  await db.flagOnProject.createMany({
    data: projects.map(({ id: projectId }) => ({
      projectId,
      flagId: flags[0].id,
    })),
  });
  dbg("PROJECTS - FLAGS");

  await db.tagOnProject.createMany({
    data: projects.map(({ id: projectId }) => ({
      projectId,
      tagId: tags[0].id,
    })),
  });
  dbg("PROJECTS - TAGS");

  await db.algorithm.createMany({
    data: allAlgorithms.map(
      ({ algName, displayName, description, flag1, flag2, flag3 }) => ({
        allocationGroupId: allocationGroup.id,
        allocationSubGroupId: allocationSubGroup.id,
        allocationInstanceId: allocationInstance.id,
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
  dbg("ALGORITHMS");

  await db.preference.createMany({
    data: preferenceData.map(({ idx, projectId, rank, type }) => ({
      allocationGroupId: allocationGroup.id,
      allocationSubGroupId: allocationSubGroup.id,
      allocationInstanceId: allocationInstance.id,
      userId: students[idx].userId,
      projectId,
      rank,
      type,
    })),
  });
  dbg("PREFERENCES");

  console.log("ok");
  console.log("<<---------- SEEDING COMPLETE");
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
