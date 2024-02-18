/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from "@prisma/client";

import { adminAccess } from "@/server/utils/admin-access";
import { dbg } from "@/lib/utils/general/console-debug";

const db = new PrismaClient();

async function main() {
  const ga = "clsqhj7ud0003do38z24yj6a9";
  const sga = "clsqhjf6b0006do38slei16lr";

  const groupId = "school-of-computing-science";
  const subGroupId = "level-4-individual-project";

  const params1 = { group: groupId };
  const params2 = { group: groupId, subGroup: subGroupId };

  const shape = await adminAccess(db, sga, params1);
  dbg("SHAPE:", shape);

  console.log("ok");
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
