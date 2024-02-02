import { SpaceParams, subGroupParamsSchema } from "@/lib/validations/params";
import { PrismaClient } from "@prisma/client";

export async function isAdminInSpace(
  db: PrismaClient,
  userId: string,
  params: SpaceParams,
) {
  const subgroupParams = subGroupParamsSchema.safeParse(params);

  if (!subgroupParams.success) {
    const { groupAdmins } = await db.allocationGroup.findFirstOrThrow({
      where: { id: params.group },
      select: { groupAdmins: { select: { userId: true } } },
    });
    return groupAdmins.map((u) => u.userId).includes(userId);
  }

  const { group, subGroup } = subgroupParams.data;

  const { subGroupAdmins } = await db.allocationSubGroup.findFirstOrThrow({
    where: { id: subGroup, allocationGroupId: group },
    select: { subGroupAdmins: { select: { userId: true } } },
  });

  return subGroupAdmins.map((u) => u.userId).includes(userId);
}
