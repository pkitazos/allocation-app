import { InstanceParams } from "@/lib/validations/params";
import { PrismaClient } from "@prisma/client";

export async function getInstance(db: PrismaClient, params: InstanceParams) {
  return await db.allocationInstance.findFirstOrThrow({
    where: {
      allocationGroupId: params.group,
      allocationSubGroupId: params.subGroup,
      id: params.instance,
    },
  });
}
