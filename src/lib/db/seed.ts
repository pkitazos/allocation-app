import { PrismaClient } from "@prisma/client";

import { dbg } from "@/lib/utils/general/console-debug";

import {
  adminsInSpaces,
  algorithms,
  allUsers,
  allUsersInInstance,
  capacities,
  flags,
  flagsOnProjects,
  invites,
  preferences,
  projects,
  sampleGroup,
  sampleInstance,
  sampleSubGroup,
  superAdmin,
  superAdminInSpace,
  tags,
  tagsOnProjects,
} from "./data/evaluation-data";

const db = new PrismaClient();

async function main() {
  const EVALUATORS = 10;
  console.log("------------>> SEEDING\n");

  await db.user.create({ data: superAdmin });
  await db.adminInSpace.create({ data: superAdminInSpace });
  dbg("super-admin\n");

  for (let idx = 1; idx <= EVALUATORS; idx++) {
    // create and invite users
    await db.user.createMany({ data: allUsers(idx) });
    await db.invitation.createMany({ data: invites(idx) });
    dbg("users + invites");

    // create spaces
    await db.allocationGroup.create({ data: sampleGroup(idx) });
    await db.allocationSubGroup.create({ data: sampleSubGroup(idx) });
    await db.allocationInstance.create({ data: sampleInstance(idx) });
    dbg("allocation spaces");

    // add users to spaces
    await db.adminInSpace.createMany({ data: adminsInSpaces(idx) });
    await db.userInInstance.createMany({ data: allUsersInInstance(idx) });
    dbg("users in spaces");

    // add algorithms, flags, and tags to instance
    await db.algorithm.createMany({ data: algorithms(idx) });
    await db.tag.createMany({ data: tags(idx) });
    await db.flag.createMany({ data: flags(idx) });
    dbg("instance details");

    // add supervisor capacity details
    await db.supervisorInstanceDetails.createMany({ data: capacities(idx) });
    dbg("user instance details");

    // create projects and preferences
    await db.project.createMany({ data: projects(idx) });
    await db.tagOnProject.createMany({ data: tagsOnProjects(idx) });
    await db.flagOnProject.createMany({ data: flagsOnProjects(idx) });
    await db.preference.createMany({ data: preferences(idx) });
    dbg("projects + preferences");

    dbg(`instance ${idx}/${EVALUATORS} complete\n`);
  }

  console.log("<<------------ SEEDING COMPLETE");
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
