import { slugify } from "@/lib/utils";
import {
  spaceParamSchema,
  subGroupParamsSchema,
} from "@/lib/validations/params";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/trpc";
import { AdminLevel } from "@prisma/client";
import { z } from "zod";
import { groupRouter } from "./group";
import { instanceRouter } from "./instance";
import { subGroupRouter } from "./sub-group";

export const institutionRouter = createTRPCRouter({
  group: groupRouter,
  subGroup: subGroupRouter,
  instance: instanceRouter,

  spaceMembership: protectedProcedure
    .input(z.object({ params: spaceParamSchema }))
    .query(async ({ ctx, input: { params } }) => {
      const user = ctx.session.user;

      const superAdmin = await ctx.db.adminInSpace.findFirst({
        where: { userId: user.id, adminLevel: AdminLevel.SUPER },
      });
      if (superAdmin) return true;

      const subgroupParams = subGroupParamsSchema.safeParse(params);

      if (!subgroupParams.success) {
        const group = await ctx.db.allocationGroup.findFirstOrThrow({
          where: { id: params.group },
          select: { groupAdmins: { select: { userId: true } } },
        });
        return group.groupAdmins.map((u) => u.userId).includes(user.id);
      }

      const { group, subGroup } = subgroupParams.data;

      const data = await ctx.db.allocationSubGroup.findFirstOrThrow({
        where: { id: subGroup, allocationGroupId: group },
        select: { subGroupAdmins: { select: { userId: true } } },
      });

      return data.subGroupAdmins.map((u) => u.userId).includes(user.id);
    }),

  superAdminAccess: protectedProcedure.query(async ({ ctx }) => {
    const access = await ctx.db.adminInSpace.findFirst({
      where: { userId: ctx.session.user.id, adminLevel: AdminLevel.SUPER },
      select: { adminLevel: true },
    });
    return !!access;
  }),

  groupManagement: adminProcedure.query(async ({ ctx }) => {
    const groups = await ctx.db.allocationGroup.findMany({});
    const superAdmin = ctx.session.user;
    return { groups, superAdmin };
  }),

  takenNames: adminProcedure.query(async ({ ctx }) => {
    return (
      await ctx.db.allocationGroup.findMany({
        select: {
          displayName: true,
        },
      })
    ).map((item) => item.displayName);
  }),

  createGroup: adminProcedure
    .input(
      z.object({
        groupName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { groupName } }) => {
      await ctx.db.allocationGroup.create({
        data: {
          id: slugify(groupName),
          displayName: groupName,
        },
      });
    }),
});
