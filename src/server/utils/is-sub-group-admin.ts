import { PrismaTransactionClient } from "@/lib/db";
import { SubGroupParams } from "@/lib/validations/params";
import { AdminLevel, PrismaClient } from "@prisma/client";

export async function isSubGroupAdmin(
  db: PrismaClient,
  params: SubGroupParams,
  userId: string,
) {
  const subGroupAdmin = await db.adminInSpace.findFirst({
    where: {
      allocationGroupId: params.group,
      allocationSubGroupId: params.subGroup,
      userId,
    },
    select: { adminLevel: true },
  });

  return (
    (subGroupAdmin && subGroupAdmin.adminLevel === AdminLevel.SUB_GROUP) ??
    false
  );
}

export async function isAdminInSubGroup_v2(
  db: PrismaTransactionClient,
  params: SubGroupParams,
  userId: string,
) {
  const { subGroupAdmins } = await db.allocationSubGroup.findFirstOrThrow({
    where: { allocationGroupId: params.group, id: params.subGroup },
    select: { subGroupAdmins: { select: { userId: true } } },
  });

  return subGroupAdmins.map((x) => x.userId).includes(userId);
}
