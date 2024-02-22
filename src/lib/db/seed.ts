import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("---------->> SEEDING");

  await db.invitation.createMany({
    data: [],
  });

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
