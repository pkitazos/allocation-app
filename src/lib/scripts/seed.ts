import { PrismaClient } from "@prisma/client";

import { superAdmin_levels, superAdmin_users } from "@/lib/db/data";

const db = new PrismaClient();

async function main() {
  await db.$transaction(async (tx) => {
    await tx.user.createMany({ data: superAdmin_users });
    await tx.adminInSpace.createMany({ data: superAdmin_levels });
  });

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
