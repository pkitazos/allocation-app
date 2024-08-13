import { PrismaClient } from "@prisma/client";

import { superAdmin_levels, superAdmin_users } from "@/lib/db/data";
import { dbg } from "@/lib/utils/general/console-debug";

const db = new PrismaClient();

async function main() {
  console.log("------------>> SEEDING\n");

  await db.$transaction(async (tx) => {
    await tx.user.createMany({ data: superAdmin_users });
    await tx.adminInSpace.createMany({ data: superAdmin_levels });
    dbg("super-admins\n");
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
