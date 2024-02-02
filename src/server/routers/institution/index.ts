import { z } from "zod";

import { slugify } from "@/lib/utils/slugify";
import { spaceParamsSchema } from "@/lib/validations/params";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/trpc";
import { isAdminInSpace } from "@/server/utils/is-admin-in-space";
import { isSuperAdmin } from "@/server/utils/is-super-admin";
import { groupRouter } from "./group";
import { instanceRouter } from "./instance";
import { subGroupRouter } from "./sub-group";

export const institutionRouter = createTRPCRouter({
  group: groupRouter,
  subGroup: subGroupRouter,
  instance: instanceRouter,

  spaceMembership: protectedProcedure
    .input(z.object({ params: spaceParamsSchema }))
    .query(async ({ ctx, input: { params } }) => {
      const user = ctx.session.user;

      const superAdmin = await isSuperAdmin(ctx.db, user.id);
      if (superAdmin) return true;

      const adminInSpace = await isAdminInSpace(ctx.db, user.id, params);
      return adminInSpace;
    }),

  superAdminAccess: protectedProcedure.query(async ({ ctx }) => {
    const access = await isSuperAdmin(ctx.db, ctx.session.user.id);
    return access;
  }),

  groupManagement: adminProcedure.query(async ({ ctx }) => {
    const groups = await ctx.db.allocationGroup.findMany({});
    const superAdmin = ctx.session.user;
    return { groups, superAdmin };
  }),

  takenNames: adminProcedure.query(async ({ ctx }) => {
    const groups = await ctx.db.allocationGroup.findMany({
      select: { displayName: true },
    });
    return groups.map(({ displayName }) => displayName);
  }),

  createGroup: adminProcedure
    .input(z.object({ groupName: z.string() }))
    .mutation(async ({ ctx, input: { groupName } }) => {
      await ctx.db.allocationGroup.create({
        data: {
          id: slugify(groupName),
          displayName: groupName,
        },
      });
    }),
});
