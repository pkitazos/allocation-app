import {
  SpaceParams,
  groupParamsSchema,
  subGroupParamsSchema,
} from "@/lib/validations/params";
import { PrismaClient } from "@prisma/client";

export async function adminAccess(
  db: PrismaClient,
  userId: string,
  params: SpaceParams,
) {
  const result = subGroupParamsSchema.safeParse(params);

  if (!result.success) {
    const { group } = groupParamsSchema.parse(params);

    const access = await db.adminInSpace.findFirst({
      where: {
        allocationGroupId: group,
        allocationSubGroupId: null,
        userId,
      },
    });
    return !!access;
  }

  const { group, subGroup } = result.data;

  const access = await db.adminInSpace.findFirst({
    where: {
      allocationGroupId: group,
      userId,
      OR: [{ allocationSubGroupId: subGroup }, { allocationSubGroupId: null }],
    },
  });
  return !!access;
}
