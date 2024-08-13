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
  savedPreferences,
  studentDetails,
  superAdmin,
  superAdmin2,
  superAdminInSpace,
  superAdminInSpace2,
  tags,
  tagsOnProjects,
  to_ID,
} from "@/lib/db/data";
import { dbg } from "@/lib/utils/general/console-debug";

const db = new PrismaClient();

async function main() {
  console.log("------------>> SEEDING\n");

  await db.$transaction(async (tx) => {
    await tx.user.create({ data: superAdmin });
    await tx.user.create({ data: superAdmin2 });
    await tx.adminInSpace.create({ data: superAdminInSpace });
    await tx.adminInSpace.create({ data: superAdminInSpace2 });
    dbg("super-admin\n");

    for (let idx = 1; idx <= EVALUATORS; idx++) {
      const ID = to_ID(idx);

      // create and invite users
      await tx.user.createMany({ data: allUsers(ID) });
      await tx.invitation.createMany({ data: invites(ID) });
      dbg("users + invites");

      // create spaces
      await tx.allocationGroup.create({ data: sampleGroup(ID) });
      await tx.allocationSubGroup.create({ data: sampleSubGroup(ID) });
      await tx.allocationInstance.create({ data: sampleInstance(ID) });
      dbg("allocation spaces");

      // add users to spaces
      await tx.adminInSpace.createMany({ data: adminsInSpaces(ID) });
      await tx.userInInstance.createMany({ data: allUsersInInstance(ID) });
      dbg("users in spaces");

      // add algorithms, flags, and tags to instance
      await tx.algorithm.createMany({ data: algorithms(ID) });
      await tx.tag.createMany({ data: tags(ID) });
      await tx.flag.createMany({ data: flags(ID) });
      dbg("instance details");

      // add student details
      await tx.studentDetails.createMany({ data: studentDetails(ID) });
      dbg("student instance details");

      // add supervisor capacity details
      await tx.supervisorInstanceDetails.createMany({ data: capacities(ID) });
      dbg("supervisor instance details");

      // create projects and preferences
      await tx.project.createMany({ data: projects(ID) });
      await tx.tagOnProject.createMany({ data: tagsOnProjects(ID) });
      await tx.flagOnProject.createMany({ data: flagsOnProjects(ID) });
      await tx.preference.createMany({ data: preferences(ID) });
      await tx.savedPreference.createMany({ data: savedPreferences(ID) });
      dbg("projects + preferences");

      dbg(`instance ${idx}/${EVALUATORS} complete\n`);
    }
  });

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
