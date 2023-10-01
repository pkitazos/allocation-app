import {
  flagData,
  projectData,
  studentData,
  supervisorData,
  tagData,
} from "@/data";
import { prisma } from "@/lib/prisma";
import { Stage } from "@/lib/types";
import { NextResponse } from "next/server";

import { checkUpload, randomChoice } from "@/lib/utils";

export async function POST() {
  const groupAdminNames = [
    "Chris",
    // "Evan",
    // "Holly"
  ];

  const groupAdmins = await prisma.groupAdmin.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  if (!checkUpload("GROUP_ADMINS", groupAdmins, 1)) {
    await prisma.groupAdmin.createMany({
      data: groupAdminNames.map((name) => ({ name: name })),
    });
  }

  const allocationGroupNames = [
    "School of Computing Science",
    // "School of Engineering",
    // "School of Medicine",
  ];

  const allocationGroups = await prisma.allocationGroup.findMany({
    orderBy: { name: "asc" },
  });

  if (!checkUpload("ALLOCATION_GROUPS", allocationGroups, 1)) {
    groupAdmins.map(async (admin, i) => {
      await prisma.allocationGroup.create({
        data: { name: allocationGroupNames[i], groupAdminId: admin.id },
      });
    });
  }

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

  const allocationSubGroups = await prisma.allocationSubGroup.findMany({
    orderBy: { name: "asc" },
  });

  if (!checkUpload("ALLOCATION_SUB_GROUPS", allocationSubGroups, 3)) {
    allocationGroups.map(async ({ id }, i) => {
      await prisma.allocationSubGroup.createMany({
        data: allocationSubGroupNames[i].map((name) => ({
          name: name,
          allocationGroupId: id,
        })),
      });
    });
  }

  const subGroupAdminNames = [
    ["Bill", "Cam", "Dan"],
    // ["Florence", "Grant"],
    // ["Isaac", "Jack", "Ken"],
  ];

  const subGroupAdmins = await prisma.subGroupAdmin.findMany({
    orderBy: { name: "asc" },
  });

  if (!checkUpload("SUB_GROUP_ADMINS", subGroupAdmins, 3)) {
    await prisma.subGroupAdmin.createMany({
      data: subGroupAdminNames[0].map((name, i) => ({
        name,
        allocationSubGroupId: allocationSubGroups[i].id,
      })),
    });
  }

  const allocationInstanceNames = [
    [["2022", "2023"], ["2022", "2023"], ["2023"]],
    // [["2022", "2023"],["2022", "2023"]],
    // [["2022", "2023"], ["2022", "2023"], ["2022", "2023"]],
  ];

  const allocationInstances = await prisma.allocationInstance.findMany({});

  if (!checkUpload("ALLOCATION_INSTANCES", allocationInstances, 5)) {
    allocationSubGroups.map(async (subGroup, i) => {
      await prisma.allocationInstance.createMany({
        data: allocationInstanceNames[0][i].map((instanceName) => ({
          name: instanceName,
          allocationSubGroupId: subGroup.id,
          stage: Stage.SETUP,
        })),
      });
    });
  }

  const supervisors = await prisma.supervisor.findMany({
    orderBy: { name: "asc" },
  });

  if (!checkUpload("SUPERVISORS", supervisors, 28)) {
    await prisma.supervisor.createMany({ data: supervisorData });
  }

  const flags = (
    await prisma.flag.findMany({
      select: {
        title: true,
      },
    })
  ).map((item) => item.title);

  if (!checkUpload("FLAGS", flags, 5)) {
    await prisma.flag.createMany({ data: flagData });
  }

  const tags = (
    await prisma.tag.findMany({
      select: {
        title: true,
      },
    })
  ).map((item) => item.title);

  if (!checkUpload("TAGS", tags, 20)) {
    await prisma.tag.createMany({ data: tagData });
  }

  const students = await prisma.student.findMany({ select: { id: true } });

  if (!checkUpload("STUDENTS", students, 22)) {
    await prisma.student.createMany({ data: studentData });
  }

  const allocInstanId = "481674ab-c2a8-4964-9a3b-77657fe91dca";

  const projects = await prisma.project.findMany({});

  if (!checkUpload("PROJECTS", projects, 33)) {
    await prisma.project.createMany({
      data: projectData.map(({ title, description }) => ({
        title: title,
        description: description,
        allocationInstanceId: allocInstanId,
        supervisorId: randomChoice(supervisors.map((item) => item.id)),
      })),
    });
  }

  // * uncomment
  //   Promise.all(
  //     students.map(
  //       async ({ id }) =>
  //         await prisma.student.update({
  //           where: {
  //             id,
  //           },
  //           data: {
  //             flags: {
  //               connect: { title: randomChoice(flags) },
  //             },
  //           },
  //         }),
  //     ),
  //   );

  // * uncomment
  //   Promise.all(
  //     projects.map(
  //       async ({ id }) =>
  //         await prisma.project.update({
  //           where: {
  //             id,
  //           },
  //           data: {
  //             flags: {
  //               connect: { title: randomChoice(flags) },
  //             },
  //             tags: {
  //               connect: { title: randomChoice(tags) },
  //             },
  //           },
  //         }),
  //     ),
  //   );

  return NextResponse.json({ status: 200, data: "success" });
}
