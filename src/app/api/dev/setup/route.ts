import { prisma } from "@/lib/prisma";
import {
  AllocationGroup,
  AllocationInstance,
  AllocationSubGroup,
  Flag,
  GroupAdmin,
  Project,
  Student,
  SubGroupAdmin,
  SuperAdmin,
  Supervisor,
  Tag,
} from "@prisma/client";
import { NextResponse } from "next/server";
import {
  supervisorData,
  flagData,
  tagData,
  studentData,
  projectData,
} from "@/data";
import { randomChoice, slugify } from "@/lib/utils";

const superAdminDetails = [
  { name: "Zoe", email: "super.allocationapp@gmail.com" },
  // { name: "Alice", email: "group.allocationapp@gmail.com" },
  // { name: "Evan", email: "group2.allocationapp@gmail.com" },
  // { name: "Holly", email: "group3.allocationapp@gmail.com" },
];

const groupAdminDetails = [
  // { name: "Petros", email: "super.allocationapp.gmail.com" },
  { name: "Alice", email: "group.allocationapp@gmail.com" },
  // { name: "Evan", email: "group2.allocationapp@gmail.com" },
  // { name: "Holly", email: "group3.allocationapp@gmail.com" },
];

const allocationGroupNames = [
  "School of Computing Science",
  // "School of Engineering",
  // "School of Medicine",
];

const allocationSubGroupNames = [
  [
    "Level 3 Group Project",
    "Level 4 Individual Project",
    "Level 5 Research Project",
  ],
  // [
  //   "Level 3 Individual Project",
  //   "Level 4 Individual Project",
  // ],
  // [
  //   "Level 4 Research Project",
  //   "Level 5 Research Project",
  //   "Level 6 Research Project",
  // ],
];

const subGroupAdminDetails = [
  [
    { name: "Bill", email: "subgroup.allocationapp@gmail.com" },
    { name: "Chris", email: "chris@example.com" },
    { name: "Dan", email: "dan@example.com" },
  ],
  // [
  //   { name: "Florence", email: "florence@example.com" },
  //   { name: "Grant", email: "grant@example.com" },
  // ],
  // [
  //   { name: "Isaac", email: "isaac@example.com" },
  //   { name: "Jack", email: "jack@example.com" },
  //   { name: "Ken", email: "ken@example.com" },
  // ],
];

const allocationInstanceNames = [
  [["2022", "2023"], ["2022", "2023"], ["2023"]],
  // [["2022", "2023"],["2022", "2023"]],
  // [["2022", "2023"], ["2022", "2023"], ["2022", "2023"]],
];

const dbEmpty = false;

// step 0
const createSuperAdmin = async () => {
  if (!dbEmpty) await prisma.superAdmin.deleteMany({});

  await prisma.superAdmin.createMany({
    data: superAdminDetails,
  });

  const superAdmins = await prisma.superAdmin.findMany({
    orderBy: { name: "asc" },
  });

  return superAdmins;
};

const inviteSuperAdmin = async (superAdmins: SuperAdmin[]) => {
  if (!dbEmpty) {
    await prisma.invitation.deleteMany({ where: { role: "SUPER_ADMIN" } });
  }
  await prisma.invitation.createMany({
    data: superAdmins.map(({ email: userEmail }) => ({
      userEmail,
      role: "SUPER_ADMIN",
    })),
  });
};

// step 1
const createGroupAdmin = async () => {
  if (!dbEmpty) await prisma.groupAdmin.deleteMany({});

  await prisma.groupAdmin.createMany({
    data: groupAdminDetails,
  });

  const groupAdmins = await prisma.groupAdmin.findMany({
    orderBy: { name: "asc" },
  });

  return groupAdmins;
};

const inviteGroupAdmin = async (groupAdmins: GroupAdmin[]) => {
  if (!dbEmpty) {
    await prisma.invitation.deleteMany({ where: { role: "GROUP_ADMIN" } });
  }
  await prisma.invitation.createMany({
    data: groupAdmins.map(({ email: userEmail }) => ({
      userEmail,
      role: "GROUP_ADMIN",
    })),
  });
};

// step 2
const createAllocationGroup = async (groupAdmins: GroupAdmin[]) => {
  if (!dbEmpty) await prisma.allocationGroup.deleteMany({});

  await prisma.allocationGroup.createMany({
    data: allocationGroupNames.map((name, i) => ({
      displayName: name,
      groupAdminId: groupAdmins[i].id,
      slug: slugify(name),
    })),
  });

  const allocationGroups = await prisma.allocationGroup.findMany({
    orderBy: { displayName: "asc" },
  });

  return allocationGroups;
};

// step 3
const createAllocaitonSubGroup = async (
  allocationGroups: AllocationGroup[],
) => {
  if (!dbEmpty) await prisma.allocationSubGroup.deleteMany({});

  // TODO: remove prisma call in map
  allocationGroups.map(async ({ id }, i) => {
    await prisma.allocationSubGroup.createMany({
      data: allocationSubGroupNames[i].map((name) => ({
        displayName: name,
        allocationGroupId: id,
        slug: slugify(name),
      })),
    });
  });

  const allocationSubGroups = await prisma.allocationSubGroup.findMany({
    orderBy: { displayName: "asc" },
  });

  return allocationSubGroups;
};

// step 4
const createSubGroupAdmin = async (
  allocationSubGroups: AllocationSubGroup[],
) => {
  if (!dbEmpty) await prisma.subGroupAdmin.deleteMany({});

  const flatSubGroupAdminDetails = subGroupAdminDetails.flat();

  await prisma.subGroupAdmin.createMany({
    data: allocationSubGroups.map(({ id: allocationSubGroupId }, i) => ({
      allocationSubGroupId,
      name: flatSubGroupAdminDetails[i].name,
      email: flatSubGroupAdminDetails[i].email,
    })),
  });

  const subGroupAdmins = await prisma.subGroupAdmin.findMany({
    orderBy: { name: "asc" },
  });

  return subGroupAdmins;
};

const inviteSubGroupAdmin = async (subGroupAdmins: SubGroupAdmin[]) => {
  if (!dbEmpty) {
    await prisma.invitation.deleteMany({ where: { role: "SUB_GROUP_ADMIN" } });
  }

  await prisma.invitation.createMany({
    data: subGroupAdmins.map(({ email: userEmail }) => ({
      userEmail,
      role: "SUB_GROUP_ADMIN" as const,
    })),
  });
};

// step 5
const createAllocationInstance = async (
  allocationSubGroups: AllocationSubGroup[],
) => {
  if (!dbEmpty) await prisma.allocationInstance.deleteMany({});

  const flatInstanceNames = allocationInstanceNames.flat(1);

  const intermediate = allocationSubGroups
    .map(({ id: allocationSubGroupId }, i) =>
      flatInstanceNames[i].map((name) => ({
        allocationSubGroupId,
        name,
        stage: "SETUP" as const,
      })),
    )
    .flat();

  console.log({ intermediate });

  await prisma.allocationInstance.createMany({
    data: allocationSubGroups
      .map(({ id: allocationSubGroupId }, i) =>
        flatInstanceNames[i].map((name) => ({
          allocationSubGroupId,
          displayName: name,
          stage: "SETUP" as const,
          slug: slugify(name),
        })),
      )
      .flat(),
  });

  const allocationInstances = await prisma.allocationInstance.findMany({});
  return allocationInstances;
};

// step 6
const createSupervisor = async () => {
  if (!dbEmpty) await prisma.supervisor.deleteMany({});

  await prisma.supervisor.createMany({ data: supervisorData });

  const supervisors = await prisma.supervisor.findMany();
  return supervisors;
};

const connectToSupervisor = async (
  supervisors: Supervisor[],
  testInstace: AllocationInstance,
) => {
  Promise.all(
    supervisors.map(
      async ({ id }) =>
        await prisma.supervisor.update({
          where: {
            id,
          },
          data: {
            allocationInstances: {
              connect: {
                id: testInstace.id,
              },
            },
          },
        }),
    ),
  );
};

const inviteSupervisor = async (supervisors: Supervisor[]) => {
  if (!dbEmpty) {
    await prisma.invitation.deleteMany({ where: { role: "SUPERVISOR" } });
  }

  await prisma.invitation.createMany({
    data: supervisors.map(({ email: userEmail }) => ({
      userEmail,
      role: "SUPERVISOR" as const,
    })),
  });
};

// step 7
const createFlag = async () => {
  if (!dbEmpty) await prisma.flag.deleteMany({});

  await prisma.flag.createMany({ data: flagData });

  const flags = await prisma.flag.findMany({});
  return flags;
};

// step 8
const createTag = async () => {
  if (!dbEmpty) await prisma.tag.deleteMany({});

  await prisma.tag.createMany({ data: tagData });

  const tags = await prisma.tag.findMany({});
  return tags;
};

// step 9
const createStudent = async () => {
  if (!dbEmpty) await prisma.student.deleteMany({});

  await prisma.student.createMany({ data: studentData });

  const students = await prisma.student.findMany({});
  return students;
};

const connectToStudent = async (
  students: Student[],
  flags: Flag[],
  testInstace: AllocationInstance,
) => {
  Promise.all(
    students.map(
      async ({ id }) =>
        await prisma.student.update({
          where: {
            id,
          },
          data: {
            flags: {
              connect: { title: randomChoice(flags).title },
            },
            allocationInstances: {
              connect: {
                id: testInstace.id,
              },
            },
          },
        }),
    ),
  );
};

const inviteStudent = async (students: Student[]) => {
  if (!dbEmpty) {
    await prisma.invitation.deleteMany({ where: { role: "STUDENT" } });
  }

  await prisma.invitation.createMany({
    data: students.map(({ email: userEmail }) => ({
      userEmail,
      role: "STUDENT" as const,
    })),
  });
};

// step 10
const createProject = async (
  supervisors: Supervisor[],
  testInstance: AllocationInstance,
) => {
  if (!dbEmpty) await prisma.project.deleteMany({});

  await prisma.project.createMany({
    data: projectData.map(({ title, description }) => ({
      title,
      description,
      allocationInstanceId: testInstance.id ?? "",
      supervisorId: randomChoice(supervisors).id,
    })),
  });

  const projects = await prisma.project.findMany({});
  return projects;
};

const connectToProject = async (
  projects: Project[],
  flags: Flag[],
  tags: Tag[],
) => {
  Promise.all(
    projects.map(
      async ({ id }) =>
        await prisma.project.update({
          where: {
            id,
          },
          data: {
            flags: {
              connect: randomChoice(flags),
            },
            tags: {
              connect: randomChoice(tags),
            },
          },
        }),
    ),
  );
};

export async function POST() {
  // step 0
  console.log("SUPER_ADMIN");
  const superAdmins = await createSuperAdmin();
  await inviteSuperAdmin(superAdmins);
  console.log(superAdmins);
  console.log("ok");

  // step 1
  console.log("GROUP_ADMIN");
  const groupAdmins = await createGroupAdmin();
  await inviteGroupAdmin(groupAdmins);
  console.log(groupAdmins);
  console.log("ok");

  // step 2
  console.log("ALLOCATION_GROUP");
  const allocationGroups = await createAllocationGroup(groupAdmins);
  console.log(allocationGroups);
  console.log("ok");

  // step 3
  console.log("ALLOCATION_SUB_GROUP");
  const allocationSubGroups = await createAllocaitonSubGroup(allocationGroups);
  console.log(allocationSubGroups);
  console.log("ok");

  // setp 4
  console.log("SUB_GROUP_ADMIN");
  const subGroupAdmins = await createSubGroupAdmin(allocationSubGroups);
  console.log(subGroupAdmins);
  await inviteSubGroupAdmin(subGroupAdmins);
  console.log("ok");

  // step 5
  console.log("ALLOCATION_INSTANCE");
  const allocationInstances =
    await createAllocationInstance(allocationSubGroups);
  console.log(allocationInstances);

  const testInstace = await prisma.allocationInstance.findFirst({
    where: {
      displayName: "2023",
      allocationSubGroup: { displayName: "Level 4 Individual Project" },
    },
    include: {
      allocationSubGroup: {
        select: { displayName: true },
      },
    },
  });

  if (!testInstace) {
    console.log("ERROR creating testInstance");
    return NextResponse.json({ status: 500, data: "error" });
  }

  console.log({ testInstace });
  console.log("ok");

  // step 6
  console.log("SUPERVISOR");
  const supervisors = await createSupervisor();
  await connectToSupervisor(supervisors, testInstace!);
  await inviteSupervisor(supervisors);
  console.log("ok");

  // step 7
  console.log("FLAGS");
  const flags = await createFlag();
  console.log("ok");

  // step 8
  console.log("TAGS");
  const tags = await createTag();
  console.log("ok");

  // step 9
  console.log("STUDENT");
  const students = await createStudent();
  await connectToStudent(students, flags, testInstace!);
  await inviteStudent(students);
  console.log("ok");

  // step 10
  console.log("PROJECT");
  const projects = await createProject(supervisors, testInstace!);
  await connectToProject(projects, flags, tags);
  console.log("ok");

  console.log("SETUP COMPLETE");
  return NextResponse.json({ status: 200, data: "success" });
}
