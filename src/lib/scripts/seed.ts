import { PrismaClient } from "@prisma/client";

import {
  adminsInSpaces,
  algorithms,
  allUsers,
  allUsersInInstance,
  capacities,
  EVALUATORS,
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
  to_ID,
} from "@/lib/db/data";
import { dbg } from "@/lib/utils/general/console-debug";

const db = new PrismaClient();

async function main() {
  console.log("------------>> SEEDING\n");

  await db.user.create({ data: superAdmin });
  await db.adminInSpace.create({ data: superAdminInSpace });
  dbg("super-admin\n");

  for (let idx = 1; idx <= EVALUATORS; idx++) {
    const ID = to_ID(idx);

    // create and invite users
    await db.user.createMany({ data: allUsers(ID) });
    await db.invitation.createMany({ data: invites(ID) });
    dbg("users + invites");

    // create spaces
    await db.allocationGroup.create({ data: sampleGroup(ID) });
    await db.allocationSubGroup.create({ data: sampleSubGroup(ID) });
    await db.allocationInstance.create({ data: sampleInstance(ID) });
    dbg("allocation spaces");

    // add users to spaces
    await db.adminInSpace.createMany({ data: adminsInSpaces(ID) });
    await db.userInInstance.createMany({ data: allUsersInInstance(ID) });
    dbg("users in spaces");

    // add algorithms, flags, and tags to instance
    await db.algorithm.createMany({ data: algorithms(ID) });
    await db.tag.createMany({ data: tags(ID) });
    await db.flag.createMany({ data: flags(ID) });
    dbg("instance details");

    // add supervisor capacity details
    await db.supervisorInstanceDetails.createMany({ data: capacities(ID) });
    dbg("user instance details");

    // create projects and preferences
    await db.project.createMany({ data: projects(ID) });
    await db.tagOnProject.createMany({ data: tagsOnProjects(ID) });
    await db.flagOnProject.createMany({ data: flagsOnProjects(ID) });
    await db.preference.createMany({ data: preferences(ID) });
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
