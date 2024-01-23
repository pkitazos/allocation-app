import { adminProcedure, createTRPCRouter } from "@/server/trpc";
import { groupParamsSchema } from "@/lib/validations/params";
import { z } from "zod";
import { slugify } from "@/lib/utils";

export const groupRouter = createTRPCRouter({
  subGroupManagement: adminProcedure
    .input(z.object({ params: groupParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group },
        },
      }) => {
        const data = await ctx.db.allocationGroup.findFirstOrThrow({
          where: { id: group },
          select: {
            displayName: true,
            allocationSubGroups: true,
            groupAdmins: {
              select: { user: { select: { name: true, email: true } } },
            },
          },
        });
        const admin = ctx.session.user.role!;
        return { admin, ...data };
      },
    ),

  takenNames: adminProcedure
    .input(z.object({ params: groupParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group },
        },
      }) => {
        const data = await ctx.db.allocationGroup.findFirstOrThrow({
          where: { id: group },
          select: {
            allocationSubGroups: { select: { displayName: true } },
          },
        });
        return data.allocationSubGroups.map((item) => item.displayName);
      },
    ),

  createSubGroup: adminProcedure
    .input(z.object({ params: groupParamsSchema, name: z.string() }))
    .mutation(
      async ({
        ctx,
        input: {
          params: { group },
          name,
        },
      }) => {
        await ctx.db.allocationSubGroup.create({
          data: {
            displayName: name,
            id: slugify(name),
            allocationGroupId: group,
          },
        });
      },
    ),
});
