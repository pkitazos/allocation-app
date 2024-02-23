import { PrismaClient } from "@prisma/client";

import { dbg } from "@/lib/utils/general/console-debug";

import {
  adminsInSpaces,
  algorithms,
  allUsers,
  allUsersInInstance,
  flags,
  flagsOnProjects,
  invites,
  preferences,
  projects,
  sampleGroup,
  sampleInstance,
  sampleSubGroup,
  supervisorDetails,
  tags,
  tagsOnProjects,
} from "./data/evaluation-data";

const db = new PrismaClient();

async function main() {
  console.log("---------->> SEEDING");

  // create and invite users
  await db.user.createMany({ data: allUsers });
  await db.invitation.createMany({ data: invites });
  dbg("users + invites");

  // create spaces
  await db.allocationGroup.create({ data: sampleGroup });
  await db.allocationSubGroup.create({ data: sampleSubGroup });
  await db.allocationInstance.create({ data: sampleInstance });
  dbg("allocation spaces");

  // add users to spaces
  await db.adminInSpace.createMany({ data: adminsInSpaces });
  await db.userInInstance.createMany({ data: allUsersInInstance });
  dbg("users in spaces");

  // add algorithms, flags, and tags to instance
  await db.algorithm.createMany({ data: algorithms });
  await db.tag.createMany({ data: tags });
  await db.flag.createMany({ data: flags });
  dbg("instance details");

  // add supervisor capacity details
  await db.supervisorInstanceDetails.createMany({ data: supervisorDetails });
  dbg("user instance details");

  // create projects and preferences
  await db.project.createMany({ data: projects });
  await db.tagOnProject.createMany({ data: tagsOnProjects });
  await db.flagOnProject.createMany({ data: flagsOnProjects });
  await db.preference.createMany({ data: preferences });
  dbg("projects + preferences");

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
